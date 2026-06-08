import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("home route sends anonymous users to login", () => {
  const home = read("src/app/page.tsx");

  assert.match(home, /redirect\("\/auth\/login"\)/);
});

test("middleware protects private routes with auth cookie", () => {
  const middleware = read("src/middleware.ts");

  assert.match(middleware, /smart_interview_token/);
  assert.match(middleware, /\/auth\/login/);
  assert.match(middleware, /\/dashboard/);
});

test("login form calls backend auth and persists token", () => {
  const login = read("src/app/auth/login/page.tsx");

  assert.match(login, /apiFetch<AuthResponse>\("\/auth\/login"/);
  assert.match(login, /setAuthToken\(result\.access_token\)/);
  assert.match(login, /router\.replace\("\/dashboard"\)/);
});
