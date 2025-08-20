import type { Express, Request, Response } from 'express';
import fetch from 'node-fetch';
import { storage } from './storage';

const LOG = process.env.LOG_AUTH === '1' ? console.info : () => {};

export function registerAuthDiagnostics(app: Express) {
  if (process.env.AUTH_DIAGNOSTICS_ENABLED !== '1') return;

  app.post('/__auth/diagnostics', async (req: Request, res: Response) => {
    const token = process.env.AUTH_DIAGNOSTICS_TOKEN;
    if (token && req.get('authorization') !== `Bearer ${token}`) {
      return res.status(401).json({ message: 'unauthorized' });
    }

    const { email, username, password } = req.body || {};
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = username?.trim().toLowerCase();
    LOG('diagnostics start', { email: normalizedEmail, username: normalizedUsername });

    const report: any = {
      dbConnected: true,
      userFoundBefore: false,
      register: {},
      login: {},
      duplicate: {},
      cookieSet: false,
      jwtIssued: false,
      notes: [] as string[]
    };

    try {
      const existing = normalizedEmail
        ? await storage.getUserByEmail(normalizedEmail)
        : normalizedUsername
        ? await storage.getUserByUsername(normalizedUsername)
        : undefined;
      report.userFoundBefore = !!existing;
    } catch (err) {
      report.dbConnected = false;
      report.notes.push('db:err');
      return res.json(report);
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const body = {
      username: normalizedUsername,
      name: normalizedUsername || 'diag',
      password,
      email: normalizedEmail
    };

    const registerRes = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    report.register = {
      ok: registerRes.ok,
      status: registerRes.status,
      code: registerRes.ok ? 'created' : registerRes.status === 409 ? 'unique-violation' : 'error'
    };
    if (registerRes.headers.get('access-control-allow-origin')) report.notes.push('cors:ok');

    const loginRes = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: normalizedUsername ?? normalizedEmail, password })
    });
    const setCookie = loginRes.headers.get('set-cookie');
    report.cookieSet = !!setCookie;
    if (setCookie?.includes('SameSite=None')) report.notes.push('sameSite=None');
    report.login = {
      ok: loginRes.ok,
      status: loginRes.status,
      code: loginRes.ok ? 'cookie-set' : 'error'
    };
    if (loginRes.ok) report.notes.push('scrypt:compare=true');

    const dupRes = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    report.duplicate = {
      ok: dupRes.ok,
      status: dupRes.status,
      code: dupRes.status === 409 ? 'unique-violation' : dupRes.ok ? 'created' : 'error'
    };

    LOG('diagnostics end', report);
    res.json(report);
  });
}
