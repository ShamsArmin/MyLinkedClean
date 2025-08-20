import express from 'express';
import session from 'express-session';
import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { setupAuth, hashPassword, comparePasswords } from '../auth';

class MockStorage {
  users: any[] = [];
  sessionStore = new session.MemoryStore();

  async hashPassword(password: string) {
    return hashPassword(password);
  }
  async comparePasswords(supplied: string, stored: string) {
    return comparePasswords(supplied, stored);
  }
  async getUser(id: number) {
    return this.users.find(u => u.id === id);
  }
  async getUserByUsername(username: string) {
    const norm = username.trim().toLowerCase();
    return this.users.find(u => u.username === norm);
  }
  async getUserByEmail(email: string) {
    const norm = email.trim().toLowerCase();
    return this.users.find(u => u.email === norm);
  }
  async createUser(user: any) {
    const id = this.users.length + 1;
    const record = {
      id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      password: await this.hashPassword(user.password)
    };
    this.users.push(record);
    return record;
  }
}

let app: express.Express;
let store: MockStorage;

beforeEach(() => {
  app = express();
  app.use(express.json());
  store = new MockStorage();
  setupAuth(app, store as any);
});

describe('auth flow', () => {
  it('registers a new user', async () => {
    const res = await request(app).post('/api/register').send({
      username: 'testuser',
      password: 'secret',
      name: 'Test User',
      email: 'test@example.com'
    });
    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe('testuser');
  });

  it('prevents duplicate registration', async () => {
    await request(app).post('/api/register').send({
      username: 'dup',
      password: 'secret',
      name: 'Dup User',
      email: 'dup@example.com'
    });
    const res = await request(app).post('/api/register').send({
      username: 'dup',
      password: 'secret',
      name: 'Dup User',
      email: 'other@example.com'
    });
    expect(res.status).toBe(409);
  });

  it('logs in with correct credentials', async () => {
    await request(app).post('/api/register').send({
      username: 'loginuser',
      password: 'secret',
      name: 'Login User',
      email: 'login@example.com'
    });
    const res = await request(app).post('/api/login').send({
      username: 'loginuser',
      password: 'secret'
    });
    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('loginuser');
  });

  it('rejects wrong password', async () => {
    await request(app).post('/api/register').send({
      username: 'wrongpass',
      password: 'secret',
      name: 'Wrong Pass',
      email: 'wp@example.com'
    });
    const res = await request(app).post('/api/login').send({
      username: 'wrongpass',
      password: 'bad'
    });
    expect(res.status).toBe(401);
  });
});
