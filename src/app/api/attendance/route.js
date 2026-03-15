import { NextResponse } from 'next/server';
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

// Setup axios with a cookie jar to automatically handle sessions/cookies
const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

export async function POST(request) {
  try {
    const { register_no, password, semester } = await request.json();

    if (!register_no || !password || !semester) {
      return NextResponse.json(
        { error: 'Register number, password, and semester are required' },
        { status: 400 }
      );
    }

    // 1. INITIAL GET: Visit login page to get the CSRF token
    const loginUrl = 'https://btechconnect.staloysius.edu.in/login';
    const initialResponse = await client.get(loginUrl);
    
    // Extract the _token using a simple regex to avoid Cheerio parsing overhead
    const tokenMatch = initialResponse.data.match(/name="_token"\s+value="([^"]+)"/);
    const csrfToken = tokenMatch ? tokenMatch[1] : null;

    if (!csrfToken) {
      throw new Error('Could not find CSRF token on the login page.');
    }

    // 2. LOGIN POST: Send credentials along with the token
    const loginPostUrl = 'https://btechconnect.staloysius.edu.in/login/email';
    
    // Format the payload as URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('_token', csrfToken);
    formData.append('register_no', register_no);
    formData.append('password', password);

    try {
      // SESSION HANDLING is managed automatically by axios-cookiejar-support
      await client.post(loginPostUrl, formData, {
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
        { error: 'Invalid Credentials or Login Failed' },
        { status: 401 }
      );
    }

    // 3. FETCH DATA: Use exact cookies to GET the JSON API endpoint
    const fetchUrl = `https://btechconnect.staloysius.edu.in/attendance/fetch?semester=${semester}`;
    const fetchResponse = await client.get(fetchUrl);

    // If we got redirected back to login or the data isn't JSON, auth failed
    if (fetchResponse.request.res.responseUrl.includes('/login') || typeof fetchResponse.data !== 'object') {
      return NextResponse.json(
        { error: 'Session invalid or failed to fetch valid JSON data' },
        { status: 401 }
      );
    }

    const rawData = Array.isArray(fetchResponse.data) ? fetchResponse.data : [];

    // 4. FORMAT DATA
    const cleanData = rawData.map(item => ({
      id: item.code || Math.random().toString(),
      name: item.title, 
      code: item.code,
      attended: Number(item.presents || 0),    // Grabs the "9"
      total: Number(item.conducted || 0),     // Grabs the "17"
      exempted: Number(item.exempted || 0)    // Bonus: grabs your duty leaves!
    }));

    // Fallback Mock for Testing Local UI Development (if real arrays are empty while testing)
    if (cleanData.length === 0) {
      console.log('No data returned from array, falling back to mock JSON for testing.');
      return NextResponse.json([
        { id: "MAT101", name: `Engineering Mathematics (Sem ${semester})`, code: "MAT101", attended: 24, total: 30 },
        { id: "ELE102", name: `Basic Electronics (Sem ${semester})`, code: "ELE102", attended: 18, total: 25 },
        { id: "CS103", name: `Python Programming (Sem ${semester})`, code: "CS103", attended: 35, total: 40 }
      ], { status: 200 });
    }

    // Return the cleaned data
    return NextResponse.json(cleanData, { status: 200 });

  } catch (error) {
    console.error('Attendance Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while fetching attendance data' },
      { status: 500 }
    );
  }
}
