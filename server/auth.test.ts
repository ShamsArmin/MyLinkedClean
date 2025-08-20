import express from 'express';
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { registerRoutes } from './routes';

let app: express.Express;
let server: any;
let baseUrl: string;
let cookie = '';

before(async () => {
  app = express();
  await registerRoutes(app);
  server = app.listen(0);
  const { port } = server.address() as any;
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server?.close();
});

async function api(path: string, options: any) {
  const res = await fetch(baseUrl + path, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}), cookie },
  });
  const text = await res.text();
  let body: any = undefined;
  try { body = text ? JSON.parse(text) : undefined; } catch {}
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie;
  return { res, body };
}

test('register/login flow', async () => {
  const username = `test${Date.now()}`;
  const password = 'secret123';
  const email = `${username}@example.com`;
  const name = 'Test User';

  let result = await api('/api/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email, name })
  });
  assert.equal(result.res.status, 201);
  assert.ok(cookie.includes('mylinked.session'));

  result = await api('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
  assert.equal(result.res.status, 200);
  assert.ok(cookie.includes('mylinked.session'));

  result = await api('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password: 'wrong' })
  });
  assert.equal(result.res.status, 401);

  result = await api('/api/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email, name })
  });
  assert.equal(result.res.status, 409);
});
