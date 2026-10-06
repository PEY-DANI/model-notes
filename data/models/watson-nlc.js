/* IBM Watson NLC — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "watson-nlc",
  name: "IBM Watson NLC",
  task: "Text Classification",
  family: "Commercial Solution",
  arch: "클라우드 API",
  learn: "지도학습 (API)",
  year: null,
  oneLine: "IBM의 자연어 분류 API. 문장을 정의한 클래스로 분류한다",
  source: { org: "IBM Watson", paper: null },
  purpose: "문장을 사전에 정의한 클래스로 분류하는 IBM의 자연어 분류 API.",
  features: ["학습 데이터와 클래스 정의만으로 분류기를 만들 수 있다"],
  limits: ["내부 구조를 조정할 수 없는 블랙박스 API"],
  lineage: [
    { id: "wex", name: "IBM Watson Explorer (WEX)", rel: "같은 Watson 제품군" }
  ],
  io: { input: "텍스트(문장)", output: "클래스별 신뢰도(confidence)" },
  trainTitle: "구축 과정",
  train: [
    "분류 기준을 클래스로 정의하고 정의서 작성",
    "클래스별 예시 문장으로 학습 데이터(CSV) 구성",
    "API로 분류기 학습 요청",
    "테스트 문장으로 성능 확인",
    "오분류를 정의서와 데이터에 반영해 반복 개선"
  ],
  metrics: [
    { k: "정확도", v: "정답 클래스와 일치한 비율" },
    { k: "클래스별 신뢰도", v: "예측 확신도" },
    { k: "사람 평가자와의 일치율", v: "업무 기준과의 일치" }
  ],
  apps: [
    { f: "문의 분류", t: "고객 문의 라우팅" },
    { f: "문서 분류", t: "서류 평가 기준 적용" },
    { f: "의도 분류", t: "챗봇" }
  ],
  usage: [
    {
      p: "mirae-essay",
      when: "2018.10 – 2019.01",
      role: "4개 채점 항목 중 협업 능력 항목 전담",
      why: "서류 평가 기준(협업 능력)을 자동화해 평가 시간을 줄이는 것이 목적이었다.",
      data: "자기소개서 문장. 평가 기준을 0·1·2점 클래스 정의서로 정량화해 훈련 데이터를 만들었다. 한 달간 인사 담당자 피드백을 매일 반영.",
      setup: "IBM Watson NLC로 클래스 분류. 매주 실험 결과와 다음 계획을 인사 담당자에게 발표.",
      metrics: [["인사 담당자 채점 대비 정확도", "97% 이상 (초기 94.39%)"], ["평가 시간", "건당 3~5분 → 3초"]],
      learned: "모델보다 평가 기준의 정의와 라벨 품질이 정확도를 정했다. 인사 담당자에게 매주 결과를 공유해 모델에 대한 신뢰를 확보했다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
