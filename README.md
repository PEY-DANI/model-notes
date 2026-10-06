# model-notes

회사, 대학원, 원티드 과정에서 사용한 모델을 과제별로 정리한 페이지입니다.

- 페이지: https://pey-dani.github.io/model-notes/
- 디자인 결정 사항: [design-decisions.md](design-decisions.md)

## 구조

```
index.html            껍데기 (스타일·스크립트 불러오기)
style.css             디자인
app.js                화면 코드, 일러스트 생성
data/
  projects.js         프로젝트 목록
  models/
    index.js          모델 id 목록 (카드 순서)
    <id>.js           모델 1개 = 파일 1개 (요약 + 경험 카드)
tools/
  check-data.js       데이터 점검
  bundle.js           파일 하나로 합치기 (아티팩트 등 단일 파일 게시용)
```

외부 라이브러리 없이 동작하고, 글꼴만 Google Fonts를 씁니다.
데이터 파일은 `fetch` 대신 `<script>`로 불러오기 때문에 `index.html`을 더블클릭해서 열어도 동작합니다.

## 데이터 수정

| 하고 싶은 일 | 고칠 곳 |
|---|---|
| 경험 카드 채우기, 모델 요약 고치기 | `data/models/<id>.js` |
| 프로젝트 추가·수정 | `data/projects.js` |
| 모델 추가 | `data/models/<id>.js` 를 만들고 `data/models/index.js` 의 `MODEL_IDS` 에 id 추가 |
| 카드 순서 바꾸기 | `data/models/index.js` 의 순서 |
| 디자인 | `style.css` |

- 모델 요약(`purpose`, `features`, `limits` 등)은 **일반적인 설명**만, 직접 겪은 내용은 `usage`(경험 카드)에 씁니다.
- 아직 채우지 못한 칸은 `null`로 두면 화면에 "작성 필요"로 표시됩니다.
- 프로젝트의 `ctx`는 `co`(Career) / `wt`(Bootcamp) / `gr`(Education), `team`은 `"개인"` · `"팀 N명"` · `null` 중 하나입니다.

## 점검과 배포

```bash
node tools/check-data.js     # 오류가 있으면 종료 코드 1
node tools/bundle.js         # dist/model-notes.html 생성 (단일 파일)
```

- 수정 후 `node tools/check-data.js` 로 점검하고 커밋·푸시하면 GitHub Pages에 1~2분 뒤 반영됩니다.
- `dist/` 는 커밋하지 않습니다(.gitignore).
