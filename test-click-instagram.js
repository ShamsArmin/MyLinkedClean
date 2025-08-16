// Simulate clicking Instagram Connect button
const fetch = require('node-fetch');

async function testInstagramConnect() {
  try {
    // First, establish session by logging in
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Armin',
        password: 'testpass123'
      })
    });

    if (!loginResponse.ok) {
      console.log('Login failed, trying to get OAuth URL directly...');
    }

    // Get session cookie
    const cookies = loginResponse.headers.get('set-cookie') || '';
    
    // Try to get Instagram OAuth URL
    const connectResponse = await fetch('http://localhost:5000/api/social/connect/instagram', {
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    });

    if (connectResponse.ok) {
      const data = await connectResponse.json();
      console.log('Instagram OAuth URL generated:');
      console.log(data.authUrl);
      console.log('\nOpen this URL in your browser to complete Instagram connection');
    } else {
      const error = await connectResponse.text();
      console.log('Connect failed:', error);
      console.log('Status:', connectResponse.status);
    }

  } catch (error) {
    console.log('Error:', error.message);
  }
}

testInstagramConnect();