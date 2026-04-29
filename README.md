# 암벽등반 개인 사이트

Astro + Decap CMS + Netlify + Pagefind로 만드는 위키/로그 통합 사이트.

## 특징

- **위키와 로그의 교차 참조**: 암장 위키 페이지에는 해당 암장 방문 로그가 자동으로, 기술 페이지에는 그 기술을 쓴 세션이 자동으로 리스트업됩니다.
- **웹에서 직접 편집**: 로컬 개발 환경 없이 `/admin` 페이지에서 폼으로 글 작성, GitHub에 자동 커밋.
- **전체 검색**: Pagefind가 빌드 타임에 인덱스를 만들어서 서버 없이도 위키·로그 통합 검색.
- **완전 무료**: GitHub + Netlify 무료 플랜으로 개인 사용에 충분.

## 폴더 구조

```
src/
├── content/
│   ├── config.ts              # 콘텐츠 스키마 (중요!)
│   ├── wiki/
│   │   ├── climbing-all/      # 암벽등반의 모든 것
│   │   │   ├── 01-getting-started/
│   │   │   ├── 02-disciplines/
│   │   │   ├── 03-gear/
│   │   │   ├── 04-techniques/
│   │   │   ├── 05-safety/
│   │   │   ├── 06-crags/
│   │   │   └── 07-community/
│   │   └── multi-ridge/       # 멀티릿지의 모든 것
│   └── logs/
│       └── 2026/              # 연도별 세션 로그
├── layouts/
├── pages/
└── components/
public/
├── admin/                     # Decap CMS 관리 페이지
└── uploads/                   # 업로드 이미지 저장소
```

## 초기 설정 (최초 1회)

### 1. 로컬에 받기

```bash
# 압축 해제 후
cd climbing-site
npm install
npm run dev     # http://localhost:4321
```

### 2. GitHub에 올리기

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<사용자명>/climbing-site.git
git push -u origin main
```

### 3. Netlify 연결

1. [netlify.com](https://netlify.com) 로그인 → "Add new site" → "Import from Git"
2. GitHub 리포지토리 선택
3. 빌드 설정은 `netlify.toml`이 이미 있으므로 그대로 두고 Deploy

배포가 끝나면 `https://<랜덤이름>.netlify.app` 주소가 나옵니다.
Netlify 대시보드 "Domain settings"에서 서브도메인을 바꿀 수 있어요.

### 4. Netlify Identity 활성화 (CMS 로그인용)

Netlify 사이트 대시보드에서:

1. **Identity** 탭 → "Enable Identity"
2. **Identity → Settings** → "Registration preferences"를 **Invite only**로 변경
3. **Identity → Services** → "Git Gateway" 활성화
4. **Identity → Invite users** → 본인 이메일 초대 → 메일로 받은 링크로 비밀번호 설정

### 5. CMS 확인

`https://<사이트주소>/admin/` 접속 → 로그인 → 완료!
이제 웹에서 폼으로 위키/로그 작성이 가능합니다.

## 콘텐츠 작성 방법

### 두 가지 방식

1. **웹에서 (쉬움)**: `/admin/` 접속 → 폼 입력 → "Publish"
   → 자동으로 GitHub에 커밋 → Netlify가 자동 재배포

2. **로컬에서 (파워 유저)**: `src/content/` 아래 마크다운 직접 편집
   → `git push` → 자동 재배포

### 위키 문서를 만들 때

**필수**: `type` 필드가 교차 참조의 기반입니다.
- `crag` (암장): `location`, `rock_type`, `disciplines` 등 채우기
- `technique` (기술): `difficulty_level`, `common_on` 채우기
- `gear` (장비): `gear_category`, `brand` 채우기
- `guide` (일반 가이드): `tags`만 있어도 OK

### 등반로그를 쓸 때

`crag` 필드에 **위키 암장 문서의 slug**를 넣으세요.
예: `src/content/wiki/climbing-all/06-crags/seonunsan.md` → `crag: seonunsan`

루트별 `techniques_used`에 **위키 기술 문서의 slug**를 넣으면
기술 위키 페이지에서 해당 로그가 자동으로 리스트업됩니다.

## 교차 참조가 작동하는 원리

- 위키 `crag` 페이지 빌드 시: `logs` 중 `data.crag === 현재 암장 slug`인 것들을 자동 수집 → "관련 등반 기록" 섹션에 표시
- 위키 `technique` 페이지 빌드 시: `logs` 중 `routes[].techniques_used`에 현재 기술이 포함된 것들을 수집 → 동일

파일 시스템 기반이라 DB 없이 순수 정적 사이트로 동작합니다.

## 검색 동작 원리

`npm run build` 실행 시 `pagefind`가 `dist/` 폴더의 모든 HTML을 스캔해서
`/pagefind/` 폴더에 인덱스를 만듭니다. `data-pagefind-body` 속성이 붙은
영역(위키 article, 로그 article)이 인덱싱 대상입니다.

사용자가 검색창에 입력하면 브라우저에서 그 인덱스를 fetch해서 즉시 결과
표시 — 서버 필요 없음.

## 자주 하는 작업

```bash
npm run dev       # 로컬 개발 서버
npm run build     # 프로덕션 빌드 (검색 인덱스 포함)
npm run preview   # 빌드 결과 미리보기
```

## 디자인 커스터마이징

### 히어로 이미지 교체 (가장 먼저 할 일)

홈화면의 메인 사진을 본인 등반 사진으로 바꾸려면:

1. 1920×1280 정도의 큰 사진을 `public/hero.jpg`로 저장
2. `src/pages/index.astro` 파일에서 `.hero-placeholder` 부분을 찾아 아래로 교체:

```css
.hero-placeholder {
  width: 100%;
  height: 100%;
  background-image: url('/hero.jpg');
  background-size: cover;
  background-position: center;
}
```

지금은 플레이스홀더로 산 실루엣이 그려져 있습니다.

### 컬러 조정

`src/layouts/BaseLayout.astro`의 `:root` 부분에서 전체 테마색을 바꿀 수 있습니다.

- `--ochre`: 포인트 컬러 (기본: 번트 오커 `#a85a2a`). 강조되는 모든 요소에 쓰임
- `--moss`: 완등 표시 등에 쓰이는 초록 (기본: `#4a5d3a`)
- `--paper`: 본문 배경 (기본: 크림빛 종이색 `#f4efe1`)
- `--ink`: 본문 텍스트 (기본: 먹색 `#1a1815`)

다크모드는 시스템 설정에 따라 자동 전환됩니다.

### 폰트 조정

기본 조합:
- 제목: **Fraunces** (세리프, 알파인 저널 느낌)
- 본문: **Inter** (깔끔한 산세리프)
- 숫자/메타: **JetBrains Mono** (모노스페이스)

폰트를 바꾸려면 `BaseLayout.astro`의 Google Fonts 링크와 `font-family` 값을 교체하세요.
한글 세리프는 Noto Serif KR이 이미 폴백으로 적용되어 있습니다.

### 브랜드명

기본 브랜드명은 "Summit Log"입니다. 변경하려면:
- `BaseLayout.astro`의 `<title>` 태그, `.brand` 텍스트, footer
- 좌측 상단 다이아몬드 마크(`.brand-mark`) 색상도 `--ochre`에 연동됨

## 다음 단계 아이디어

- **지도 연동**: `location.lat/lng` 필드가 이미 있으니 Leaflet/MapLibre로 암장 지도 추가
- **난이도 필터**: 로그 전체에서 "5.11대만 보기" 등 클라이언트 필터
- **통계 대시보드**: 연도별 세션 수, 완등 루트 분포 등
- **사진 갤러리**: `astro:assets`로 이미지 최적화 + 라이트박스

## 구조 확장 팁

- 위키에서 **루트**(route)를 개별 문서로 만들고 싶다면 `06-crags/<암장명>/routes/<루트명>.md` 형태로 만들고
  스키마의 `route` 타입을 활용하세요. 그러면 루트마다 "이 루트의 완등/시도 기록" 섹션이 자동 생성됩니다.
- 로그의 `routes[].name`을 위키 루트 문서 slug와 일치시키면 됩니다.

---

막히는 부분이 있으면 각 공식 문서를 참고하세요:
- Astro: https://docs.astro.build
- Decap CMS: https://decapcms.org/docs/
- Pagefind: https://pagefind.app
- Netlify: https://docs.netlify.com
