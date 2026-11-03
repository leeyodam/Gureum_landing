# 구름 (GUREUM) Landing

공개용 랜딩 페이지입니다. GitHub Pages로 정적 호스팅합니다.

## 로컬 미리보기

```bash
cd landing
python -m http.server 5173
```

브라우저에서 `http://localhost:5173` 을 여세요.

## GitHub Pages

저장소: [leeyodam/Gureum_landing](https://github.com/leeyodam/Gureum_landing)

- Source: `main` / `/ (root)`
- URL: https://gureum.yodams.com/
- DNS: `gureum.yodams.com` CNAME `leeyodam.github.io`

## 브랜드 에셋

| 파일 | 용도 |
|------|------|
| `assets/logo.png` | 네비·파비콘 원본 |
| `assets/icon-1024.png` | 마케팅 |
| `assets/splash.png` | 스플래시 |
| `assets/favicon-*.png` | 파비콘 |
| `assets/og.png` | SNS 미리보기 |

다운로드 버튼은 스토어 URL이 준비되면 `index.html`의 `#download` 섹션에서 교체하세요.

## 검색·답변 엔진

공개 URL은 https://gureum.yodams.com/ 이고, 이 주소의 본문은 한국어입니다.

| 파일 | 역할 |
|------|------|
| `robots.txt` | 검색·생성형 크롤러 허용, 사이트맵 위치 |
| `sitemap.xml` | 언어별 주소 |
| `llms.txt` | 인용하기 쉬운 제품 사실 |

다른 언어는 쿼리로 구분합니다.

- English: `?lang=en`
- Español: `?lang=es`
- 日本語: `?lang=ja`
- 中文: `?lang=zh`
