import { defineConfig, devices } from '@playwright/test';

// 아이폰 13 화면 크기로 검사. 로컬은 Chromium, CI 에서는 아이폰 Safari 와 같은 엔진인 WebKit 도 함께
const iphone = devices['iPhone 13'];

export default defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.js',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: { trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { ...iphone, browserName: 'chromium' } },
    ...(process.env.CI ? [{ name: 'webkit', use: { ...iphone, browserName: 'webkit' } }] : []),
  ],
});
