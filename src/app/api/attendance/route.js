import { NextResponse } from 'next/server';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export const dynamic = 'force-dynamic';

export async function POST(request) {

  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true }));

  try {
    const { register_no, password, semester } = await request.json();
    console.log("API received request parameters:", { register_no, hasPassword: !!password, semester });

    if (!register_no || !password || !semester) {
      return NextResponse.json(
        { error: 'Register number, password, and semester are required' },
        { status: 400 }
      );
    }

    const loginUrl = 'https://btechconnect.staloysius.edu.in/login';
    const initialResponse = await client.get(loginUrl, {
      headers: { 'Cache-Control': 'no-store' }
    });

    const tokenMatch = initialResponse.data.match(/name="_token"\s+value="([^"]+)"/);
    const csrfToken = tokenMatch ? tokenMatch[1] : null;

    if (!csrfToken) {
      throw new Error('Could not find CSRF token on the login page.');
    }

    const loginPostUrl = 'https://btechconnect.staloysius.edu.in/login/email';

    const formData = new URLSearchParams();
    formData.append('_token', csrfToken);
    formData.append('register_no', register_no);
    formData.append('password', password);

    let loginResponse;
    try {

      loginResponse = await client.post(loginPostUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': loginUrl,
        },
        maxRedirects: 5, 
        validateStatus: (status) => status >= 200 && status < 400,
      });
    } catch (loginError) {
      console.error('Login POST failed:', loginError.message);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const responseUrl = loginResponse.request?.res?.responseUrl || loginResponse.config?.url || '';
    const setCookieHeader = loginResponse.headers['set-cookie'] || loginResponse.headers['Set-Cookie'];
    const cookiesInJar = jar.getCookiesSync(loginPostUrl).length > 0;
    
    if (responseUrl.includes('login') || (!setCookieHeader && !cookiesInJar)) {
      return NextResponse.json(
        { error: "Invalid credentials" }, 
        { status: 401 }
      );
    }

    const fetchUrl = `https://btechconnect.staloysius.edu.in/attendance/fetch?semester=${semester}`;
    const fetchResponse = await client.get(fetchUrl, {
      headers: { 'Cache-Control': 'no-store', 'Pragma': 'no-cache' }
    });

    let scrapedName = null;
    try {
        const homeUrl = 'https://btechconnect.staloysius.edu.in/home';
        const homeResponse = await client.get(homeUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        const html = homeResponse.data;

        const nameMatch = html.match(/<font[^>]*class=["']text-primary["'][^>]*>\s*([^<]+?)\s*<\/font>/i);
        if (nameMatch && nameMatch[1]) {
            scrapedName = nameMatch[1].trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        }
    } catch (error) {
        console.error("Scraping error:", error);
    }

    const rawData = Array.isArray(fetchResponse.data) ? fetchResponse.data : [];

    const cleanData = rawData.map(item => {

      const attendedClasses = parseInt(item.presents || item.present || 0, 10); 
      const totalClasses = parseInt(item.conducted || item.total || 0, 10);
      const exemptedClasses = parseInt(item.exempted, 10) || 0;
      const officialPercentage = parseFloat(item.percentage) || 0;

      return {
        id: item.code || Math.random().toString(),
        name: item.title,
        code: item.code,
        attended: attendedClasses,
        total: totalClasses,
        exempted: exemptedClasses,
        officialPercentage
      };
    });

    // Bulletproof Branch Routing based on Registration Number
    const regNumber = parseInt(register_no, 10);
    let derivedBranch = "UNKNOWN";

    if (regNumber >= 25190101 && regNumber <= 25190157) {
        derivedBranch = "CSE";
    } else if (regNumber >= 25191101 && regNumber <= 25191160) {
        derivedBranch = "AIML";
    } else if (regNumber >= 25192101 && regNumber <= 25192151) {
        derivedBranch = "ISE";
    } else if (regNumber >= 25195101 && regNumber <= 25195141) {
        derivedBranch = "ECE";
    } else {
        console.log(`Registration number ${regNumber} falls outside known ranges.`);
    }

    return NextResponse.json(
      { 
        loginId: register_no, 
        studentName: scrapedName, 
        branch: derivedBranch, 
        subjects: cleanData 
      }, 
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );

  } catch (error) {
    console.error('Attendance Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching attendance data' },
      { status: 500 }
    );
  }
}
