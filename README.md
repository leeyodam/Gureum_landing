# 구름 (GUREUM) Landing

공개용 랜딩 페이지입니다. GitHub Pages로 정적 호스팅할 수 있습니다.

앱 저장소는 private으로 유지하고, 이 `landing/` 폴더만 별도 public 저장소로 올리면 됩니다.

## 로컬 미리보기

```bash
cd landing
python -m http.server 5173
```

브라우저에서 `http://localhost:5173` 을 여세요.

## GitHub Pages

1. 이 폴더 내용으로 public 저장소를 만듭니다. (`index.html`이 루트에 있어야 합니다.)
2. Settings → Pages → Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)` 저장

또는 이 monorepo에서 Pages Source를 `/landing`으로 지정할 수 있습니다.

## 브랜드 에셋

| 파일 | 용도 |
|------|------|
| `assets/logo.png` | 네비·파비콘 원본 |
| `assets/icon-1024.png` | 히어로·마케팅 |
| `assets/splash.png` | 로딩 화면 프리뷰 |
| `assets/favicon-*.png` | 파비콘 |
| `assets/og.png` | SNS 미리보기 |

다운로드 버튼 링크는 스토어/배포 URL이 준비되면 `index.html`의 `#download` 섹션에서 교체하세요.
