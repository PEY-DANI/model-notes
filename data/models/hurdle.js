/* Hurdle (2단계 모델) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "hurdle",
  name: "Hurdle (2단계 모델)",
  task: "Tabular Prediction",
  family: "ML",
  arch: "트리 2개 결합",
  learn: "지도학습",
  year: 1986,
  oneLine: "먼저 0인지 아닌지 가르고, 0이 아닌 것만 따로 예측하는 구조",
  source: {
    org: "Mullahy (1986) 등 계량경제학 hurdle model",
    paper: "Specification and testing of some modified count data models"
  },
  purpose: "0이 많은 데이터(zero-inflated)에서 0 여부 판정과 크기 예측을 분리해 다룬다.",
  features: ["1단계: 0인지 아닌지 분류", "2단계: 0이 아닌 것만 회귀 또는 구간 분류", "두 단계를 독립적으로 튜닝할 수 있다"],
  limits: ["1단계의 오분류가 2단계로 전파된다", "임계값 선택에 민감하다"],
  lineage: [
    { id: "lightgbm", name: "LightGBM", rel: "1·2단계 기반 모델" }
  ],
  io: { input: "표 형태 데이터", output: "0 여부 확률과 0이 아닌 경우의 예측 크기(또는 구간)" },
  code: `# 1단계: 0인지 아닌지
clf.fit(X_train, (y_train > 0))
p_nonzero = clf.predict_proba(X_test)[:, 1]

# 2단계: 0이 아닌 샘플만으로 크기 예측
mask = y_train > 0
reg.fit(X_train[mask], np.log1p(y_train[mask]))
size = np.expm1(reg.predict(X_test))

pred = np.where(p_nonzero < t0, 0, size)   # t0는 검증 세트에서 선택`,
  train: [
    "타깃을 '0 여부'와 '크기' 두 문제로 분리",
    "1단계 이진 분류기 학습",
    "0이 아닌 샘플만 모아 2단계 회귀(또는 구간 분류) 학습",
    "검증 세트에서 임계값(t0)과 구간 경계 선택",
    "두 단계의 결과를 합쳐 평가"
  ],
  metrics: [
    { k: "1단계 AUC / F1", v: "0 여부 분류 성능" },
    { k: "2단계 MAE / RMSE", v: "0이 아닌 샘플의 크기 오차" },
    { k: "전체 macro F1 / 정확도", v: "두 단계를 합친 최종 성능" }
  ],
  apps: [
    { f: "간헐수요 예측", t: "수요가 없는 기간이 많은 부품" },
    { f: "보험 청구", t: "청구 여부와 청구액" },
    { f: "카운트 데이터", t: "방문 횟수, 리뷰 수" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.16 – 09.17",
      role: "정형 파트 (대안 모델)",
      why: "0건이 73%인 분포에 흔히 쓰는 구조라 직접 분류의 대안으로 넣었다.",
      data: "LightGBM과 같은 마트·분할.",
      setup: "Hurdle C: 1단계 이진분류 + 2단계 log1p 회귀. 임계값은 검증 세트에서 macro F1 기준으로 선택.",
      metrics: [
        ["macro F1", "0.433"],
        ["1단계 테스트 AUC", "0.815"],
        ["30+ 정밀도", "0.281"],
        ["정확도 기준 조정 시 정확도", "0.729"],
        ["그때 30+ 정밀도", "0.417"]
      ],
      learned: "직접 분류와 macro F1 차이가 없었다. 0/1 경계는 리뷰 수 자체의 우연성(기대 1건인 상품도 37%는 실제 0건) 때문에 구조를 바꿔도 나아지지 않았다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
