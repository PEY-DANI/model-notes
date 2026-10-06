/* IBM Watson Explorer (WEX) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "wex",
  name: "IBM Watson Explorer (WEX)",
  task: "Retrieval & RAG",
  family: "Commercial Solution",
  arch: "엔터프라이즈 검색",
  learn: "규칙·사전 기반",
  year: null,
  oneLine: "IBM의 엔터프라이즈 검색·콘텐츠 분석 솔루션",
  source: { org: "IBM Watson", paper: null },
  purpose: "여러 출처의 데이터를 수집해 검색할 수 있게 한다.",
  features: ["사전 기반 검색"],
  limits: [],
  lineage: [
    { id: "watson-nlc", name: "IBM Watson NLC", rel: "같은 Watson 제품군" }
  ],
  io: { input: "여러 출처의 문서·데이터", output: "검색 결과와 분석 결과" },
  trainTitle: "구축 과정",
  train: [
    "수집 대상(크롤러)과 색인할 필드 정의",
    "사전(용어·동의어)을 구축해 검색에 반영",
    "색인을 생성하고 검색 화면과 연결",
    "검색 품질을 확인하며 사전과 설정 조정",
    "대시보드·분석 화면에 연동"
  ],
  metrics: [
    { k: "검색 정확도 / 재현율", v: "원하는 문서를 찾는 정도" },
    { k: "색인 시간·갱신 주기", v: "운영 부담" },
    { k: "사용자 피드백", v: "검색 만족도" }
  ],
  apps: [
    { f: "엔터프라이즈 검색", t: "사내 문서 통합 검색" },
    { f: "콘텐츠 분석", t: "비정형 텍스트 분석" },
    { f: "유통·시장 정보", t: "여러 플랫폼 데이터 통합" }
  ],
  usage: [
    {
      p: "mirae-agri",
      when: "2020.07 – 2021.02",
      role: "파이프라인·검색·대시보드 구축",
      why: "유통 플랫폼마다 형식이 다른 데이터를 하나로 모아 검색하려 했다.",
      data: "6개 유통 플랫폼 데이터.",
      setup: "자동 수집·적재 파이프라인 + 사전 기반 검색 시스템 + 대시보드.",
      metrics: [["연동 플랫폼", "6개"]],
      learned: null,
      qual: null,
      env: null,
      links: null
    }
  ]
});
