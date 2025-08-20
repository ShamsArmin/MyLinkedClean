import { randomUUID } from 'crypto';

const base = process.env.BASE_URL || 'http://localhost:5000';

async function api(path: string, options: any) {
  const res = await fetch(base + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include'
  });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

(async () => {
  const id = randomUUID().slice(0, 8);
  const username = `smoke_${id}`;
  const password = 'pass123!';
  const name = 'Smoke Test';
  const email = `smoke_${id}@example.com`;

  let { res } = await api('/api/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, name, email })
  });
  console.log('register', res.status);

  ({ res } = await api('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }));
  console.log('login', res.status);

  ({ res } = await api('/api/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, name, email })
  }));
  console.log('duplicate', res.status);
})();
