import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

process.env.DATABASE_URL = 'postgres://user:pass@localhost:5432/db';
const { setupAuth, hashPassword, comparePasswords } = await import('../server/auth');
const { storage } = await import('../server/storage');

process.env.SESSION_SECRET = 'test-secret';

// In-memory user store for tests
const users = [];

Object.assign(storage, {
  sessionStore: undefined,
  async getUserByUsername(username) {
    const u = username.trim().toLowerCase();
    return users.find(x => x.username === u);
  },
  async getUserByEmail(email) {
    const e = email.trim().toLowerCase();
    return users.find(x => x.email === e);
  },
  async createUser(u) {
    const user = {
      id: users.length + 1,
      username: u.username.trim().toLowerCase(),
      email: u.email?.trim().toLowerCase(),
      name: u.name,
      password: await hashPassword(u.password),
      bio: u.bio
    };
    users.push(user);
    return user;
  },
    comparePasswords,
    hashPassword
  });

const app = express();
app.use(express.json());
setupAuth(app);

const server = app.listen(0);
const base = () => `http://localhost:${(server.address() as any).port}`;

test.after(() => {
  server.close();
});

const creds = { username: 'testuser', password: 'Passw0rd!23', name: 'Test User', email: 'Email@Example.com' };

// register new user
test('register new user', async () => {
  const res = await fetch(base() + '/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds)
  });
  assert.equal(res.status, 201);
  assert.equal(users.length, 1);
});

// login correct credentials
test('login correct creds', async () => {
  const res = await fetch(base() + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: creds.username, password: creds.password })
  });
  assert.equal(res.status, 200);
  assert.ok(res.headers.get('set-cookie'));
});

// login wrong password
test('login wrong password', async () => {
  const res = await fetch(base() + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: creds.username, password: 'wrong' })
  });
  assert.equal(res.status, 401);
});

// duplicate register
test('duplicate register', async () => {
  const res = await fetch(base() + '/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...creds, email: 'email@example.com' })
  });
  assert.equal(res.status, 409);
});

// case and whitespace tolerance
test('case/whitespace tolerance', async () => {
  const res = await fetch(base() + '/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: ' EMAIL@example.com ', password: creds.password })
  });
  assert.equal(res.status, 200);
});
