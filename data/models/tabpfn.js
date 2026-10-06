/* TabPFN-3.5 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "tabpfn",
  name: "TabPFN-3.5",
  task: "Tabular Prediction",
  family: "DL",
  arch: "Transformer (사전학습)",
  learn: "사전학습 + in-context",
  year: 2023,
  oneLine: "합성 데이터로 사전학습해 학습 없이 예측하는 표 데이터용 Transformer",
  source: {
    org: "Prior Labs (Hollmann 외)",
    paper: "TabPFN: A Transformer That Solves Small Tabular Classification Problems in a Second (ICLR 2023), TabPFN v2 (Nature 2025)"
  },
  purpose: "소규모 표 데이터에서 튜닝 없이 확률을 잘 낸다.",
  features: ["학습 데이터를 문맥(context)으로 넣어 한 번의 순전파로 예측한다", "하이퍼파라미터 튜닝이 거의 필요 없다", "확률 출력이 잘 보정되는 편이다"],
  limits: ["GPU가 필요하다", "입력 크기(행·열 수)에 제한이 있다", "범주·시간 구조는 입력 설계에 따라 성능이 달라진다"],
  lineage: [
    { id: "transformer", name: "Transformer", rel: "기반 구조" },
    { id: "lightgbm", name: "LightGBM", rel: "비교 대상" }
  ],
  io: { input: "표 형태 데이터 (학습 데이터 전체가 문맥으로 함께 입력됨)", output: "클래스별 확률 또는 회귀 예측값" },
  code: `from tabpfn import TabPFNClassifier

clf = TabPFNClassifier()          # 사전학습된 가중치를 불러옴
clf.fit(X_train, y_train)         # 파라미터 학습이 아니라 문맥으로 저장
proba = clf.predict_proba(X_test)`,
  trainTitle: "적용 과정",
  train: [
    "표 데이터를 정리 (결측·범주형은 라이브러리가 처리)",
    "행·열 수가 입력 제한 안인지 확인",
    "fit으로 학습 데이터를 문맥에 저장 (경사하강 학습 없음)",
    "predict_proba로 한 번에 예측",
    "GPU 사용 여부와 앙상블 설정을 조정"
  ],
  metrics: [
    { k: "log loss", v: "확률 예측의 정확도(낮을수록 좋음)" },
    { k: "정확도 / macro F1", v: "분류 성능" },
    { k: "순위 상관 / AUC", v: "순위 성능" }
  ],
  apps: [
    { f: "소규모 표 데이터", t: "튜닝 없이 빠르게 강한 기준선 확보" },
    { f: "의료·과학", t: "표본이 적은 정형 데이터" },
    { f: "부스팅 대안 비교", t: "확률 보정이 중요한 문제" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.26",
      role: "정형 파트: 서버 GPU 실험",
      why: "표 데이터 딥러닝 후보 중 가장 유력해서 부스팅과 같은 틀에서 비교했다.",
      data: "전체 16,620개, 시간순 5개 분기(2025Q2~2026Q2), 시험 10,141개(frame 6,856개). 학습 가중 strat_rev 0.5, 시드 3.",
      setup: "unified 규약 그대로. 카테고리 트렌드 피처(nv_category_ahead) 추가 전후 비교. GPU1 사용. 조건당 약 1분.",
      metrics: [
        ["frame 순위 ρ", "0.490 → 0.498 (+ahead)"],
        ["macro F1", "0.423 → 0.441"],
        ["LightGBM 현재 기준 +ahead", "ρ 0.492 / F1 0.423"],
        ["live 신규 상품 Δρ", "−0.005"]
      ],
      learned: "log loss는 15번 시험 모두 TabPFN, CatBoost, LightGBM 순이었지만 순위 ρ 차이는 흔들림 범위였다. 한 주만 등록된 live에서 LightGBM은 나빠지고 TabPFN은 거의 손해가 없었다. 전향 시험에서 확인되지 않은 피처는 기준에 넣지 않고 보류했다.",
      qual: "live 6월 등록분에서 한 브랜드(카디건)가 30+ 11개 중 7개를 차지해 결과를 흔들었다.",
      env: "서버 GPU1",
      links: null
    }
  ]
});
