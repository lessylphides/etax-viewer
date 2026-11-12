// site/icon.svg 로 아이폰 홈 화면 아이콘(PNG)을 만듦: npm run icons
// 아이폰은 모서리를 직접 둥글게 깎으므로 PNG 는 둥근 모서리 없이 꽉 채움
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const svg = (await readFile(new URL('../site/icon.svg', import.meta.url), 'utf8'))
  .replace('rx="112" ', '');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 180, height: 180 } });
await page.setContent(`<style>*{margin:0}svg{display:block;width:180px;height:180px}</style>${svg}`);
await page.screenshot({ path: new URL('../site/apple-touch-icon.png', import.meta.url).pathname });
await browser.close();
