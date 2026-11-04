# 구름 (GUREUM) Landing

공개용 랜딩 페이지입니다. GitHub Pages로 정적 호스팅합니다.

## 언어별 페이지

한국어가 원문이고, 나머지 언어는 각자 주소를 가진 정적 페이지입니다. 처음 받는 HTML에 그 언어의 본문이 들어 있어서, 자바스크립트를 실행하지 않는 수집기도 내용을 읽습니다.

| 언어 | 주소 | `html lang` |
|------|------|-------------|
| 한국어 | `/` | `ko` |
| English | `/en/` | `en` |
| Español | `/es/` | `es` |
| 日本語 | `/ja/` | `ja` |
| 中文 | `/zh/` | `zh-Hans` |

옛 주소인 `/?lang=en` 같은 링크는 `script.js`가 해당 언어 페이지로 보냅니다.

## 문구 수정

문구의 원본은 `i18n.js` 하나입니다. `index.html`은 한국어 페이지이면서 동시에 구조 템플릿이고, `tools/build_pages.js`가 사전을 넣어 5개 언어 페이지를 다시 씁니다.

```bash
node tools/build_pages.js
```

페이지를 직접 고치지 말고 `i18n.js`를 고친 뒤 위 명령을 실행하세요. HTML 기본값, 메타 태그, hreflang, canonical, OG, 구조화 데이터가 함께 갱신됩니다.

`index.html`의 마크업 구조를 바꾸면(섹션 추가, `data-i18n` 키 추가) 빌드를 다시 돌려 나머지 언어 페이지에도 반영해야 합니다.

## 로컬 미리보기

```bash
cd landing
python -m http.server 5173
```

브라우저에서 `http://localhost:5173` 을 여세요. `/en/`, `/ja/` 처럼 하위 경로도 함께 확인하세요.

## GitHub Pages

저장소: [leeyodam/Gureum_landing](https://github.com/leeyodam/Gureum_landing)

- Source: `main` / `/ (root)`
- URL: https://gureum.yodams.com/
- DNS: `gureum.yodams.com` CNAME `leeyodam.github.io`
- Search Console: URL 접두어 `https://gureum.yodams.com/`
- Analytics: `analytics.js` (신호·광고 개인화 끔). 전환은 `download_click`. 그 외 `section_view`, `section_click`, `scroll_depth`, `language_change`, `faq_open`, `outbound_click`, `notify_click`

`.nojekyll`이 있어서 GitHub Pages가 Jekyll을 거치지 않고 파일을 그대로 올립니다.

## 브랜드 에셋

| 파일 | 용도 |
|------|------|
| `assets/logo.png` | 네비·파비콘 원본 |
| `assets/icon-1024.png` | 마케팅 |
| `assets/splash.png` | 스플래시 |
| `assets/favicon-*.png` | 파비콘 |
| `assets/og.png` | SNS 미리보기 |

다운로드 버튼은 스토어 URL이 준비되면 `index.html`의 `#download` 섹션에서 교체하고 빌드를 다시 돌리세요.

## 검색·답변 엔진

| 파일 | 역할 |
|------|------|
| `robots.txt` | 검색·생성형 크롤러 허용, 사이트맵 위치 |
| `sitemap.xml` | 언어별 주소와 hreflang |
| `llms.txt` | 인용하기 쉬운 제품 사실 |

`404.html`은 `noindex`입니다.
