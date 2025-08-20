const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const email = `test+${Date.now()}@example.com`;
const username = email.split('@')[0];
const password = 'Passw0rd!23';

async function run() {
  const registerRes = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, name: username, email, password }),
    credentials: 'include'
  });
  console.log('register', registerRes.status);

  const loginRes = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  console.log('login', loginRes.status, loginRes.headers.get('set-cookie') ? 'cookie' : 'no-cookie');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
