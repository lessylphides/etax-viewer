# 세금계산서 뷰어

국세청 홈택스가 메일로 보내는 전자세금계산서 첨부파일(`NTS_eTaxInvoice.html`)을 여는 단독 웹페이지입니다.
아이폰 메일·파일 앱에서는 이 첨부파일의 번호 입력칸이 뜨지 않아서 만들었습니다.

## 쓰는 방법

1. 메일에서 첨부파일을 길게 눌러 **파일에 저장**
2. 뷰어 페이지에서 **첨부파일 고르기**
3. 공급받는 사업자등록번호 입력 (기억해 두면 다음부터는 파일만 고르면 바로 열림)

요약(합계·품목·공급자·공급받는자), 원본 화면, 원본 XML 저장을 볼 수 있습니다.
사파리에서 **홈 화면에 추가**하면 앱처럼 쓸 수 있습니다.

## 안전

- 해독은 페이지 안에서 직접 합니다. 홈택스를 포함해 어떤 서버에도 접속하지 않습니다(페이지 CSP `connect-src 'none'`).
- 원본 화면은 스크립트를 막고 바깥 이미지(국세청 읽음 확인 이미지 포함)도 불러오지 않습니다.
- 번호는 "이 기기에 기억하기"를 켰을 때만 이 브라우저(localStorage)에 저장됩니다.

## 파일 형식 (실제 메일로 확인)

| 숨은 칸 | 내용 |
|---|---|
| `idCriHeader` | Base64 → 바이트마다 XOR `0x6B` → `이름:값` 줄. 암호 방식(1 AES, 2 SEED, 3 ARIA), `HashKey`, 첨부 이름 |
| `idCriPcContents` / `idCriMobileContents` | 세금계산서 화면 HTML 암호문 |
| `idCriAttachContentsN` | 첨부 암호문. 해독하면 Base64 가 한 번 더 나오고, 풀면 국세청 표준 XML |

- 열쇠 = `MD5(번호 숫자만)`, IV = 0 16바이트, CBC + PKCS#7
- `HashKey` 를 해독한 글자가 열쇠의 16진수 표기와 같으면 번호가 맞음
- 지금 국세청 파일은 SEED 를 씁니다. AES 는 브라우저 내장 기능으로 시도하고(실제 파일로는 확인 못 함), ARIA 는 지원하지 않습니다.

## 구조

```
site/            배포되는 정적 파일 (빌드 없음)
  index.html     화면
  app.js         화면 동작
  etax.js        해독(MD5·SEED)과 표준 XML 읽기
  style.css
tests/           단위 테스트(vitest)·화면 테스트(Playwright, 아이폰 13 크기)
```

## 개발

```sh
npm install
npm run serve        # http://localhost:8000 에서 보기
npm test             # MD5·SEED 표준 시험값, 가짜 보안메일 열기
npm run test:e2e     # 화면 테스트
```

테스트는 `tests/etaxSample.js` 가 만드는 가짜 보안메일만 씁니다(실제 사업자 정보 없음).

## 배포

`main` 에 올리면 `.github/workflows/pages.yml` 이 테스트 후 `site/` 를 GitHub Pages 로 올립니다.
처음 한 번은 저장소 Settings → Pages → Source 를 **GitHub Actions** 로 바꿔야 합니다.
