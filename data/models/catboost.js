/* CatBoost — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "catboost",
  name: "CatBoost",
  task: "Tabular Prediction",
  family: "ML",
  arch: "트리 부스팅",
  learn: "지도학습",
  year: 2018,
  oneLine: "범주형 변수 처리에 강한 gradient boosting",
  source: { org: "Yandex", paper: "CatBoost: unbiased boosting with categorical features (NeurIPS 2018)" },
  purpose: "범주형 변수가 많은 표 데이터에서 별도 인코딩 없이 안정적인 성능을 낸다.",
  features: [
    "범주형을 원본 그대로 넣는다 (ordered target statistics)",
    "기본 설정으로도 성능이 안정적이다",
    "대칭 트리 구조로 과적합에 강하다"
  ],
  limits: ["다른 GBM 구현체보다 학습이 느린 편이다", "범주형 처리(ordered target statistics) 때문에 메모리와 시간 비용이 크다"],
  lineage: [
    { id: "lightgbm", name: "LightGBM", rel: "같은 계열" },
    { id: "xgboost", name: "XGBoost", rel: "같은 계열" }
  ],
  io: { input: "표 형태 데이터 (범주형 열을 원본 문자열 그대로 사용 가능)", output: "회귀는 예측값, 분류는 클래스별 확률" },
  code: `from catboost import CatBoostClassifier

model = CatBoostClassifier(
    iterations=5000, learning_rate=0.05, depth=6,
    cat_features=cat_cols,          # 범주형 열 이름 또는 인덱스
    early_stopping_rounds=200, verbose=200)
model.fit(X_train, y_train, eval_set=(X_valid, y_valid))

proba = model.predict_proba(X_test)`,
  train: [
    "범주형 열을 지정 (별도 인코딩 불필요)",
    "train / valid / test 분할",
    "depth, learning_rate, l2_leaf_reg 설정",
    "검증 세트로 조기종료",
    "test로 평가"
  ],
  metrics: [
    { k: "정확도 / macro F1", v: "분류 성능" },
    { k: "AUC / log loss", v: "확률 예측 품질" },
    { k: "MAE / RMSE", v: "회귀 오차" }
  ],
  apps: [
    { f: "범주형이 많은 표 데이터", t: "고객·상품 속성 기반 예측" },
    { f: "추천·랭킹", t: "CatBoostRanker" },
    { f: "금융·통신", t: "이탈 예측, 위험 평가" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.16 – 09.17",
      role: "정형 파트 (비교 모델)",
      why: "범주형 직접 처리가 강점이라 카테고리·시즌 피처에 유리할지 확인하려고 넣었다.",
      data: "LightGBM과 같은 마트·분할.",
      setup: "learning_rate 0.05, depth 6, l2_leaf_reg 3.0, balanced 가중치.",
      metrics: [["macro F1 (오류 수정 후)", "0.439"], ["보고했다가 철회한 값", "0.490"], ["블록 평균 순위", "2.71"]],
      learned: "분류에서만 가중치 없는 손실로 조기종료하고 있던 설정 오류를 직접 발견해 고쳤고, 먼저 보고한 'CatBoost 1위'를 철회했다. 수정 후에는 시간순 평가에서 뒤처졌다. 학습 시간은 같은 조합에서 XGBoost 4~5초, CatBoost 98~238초였다.",
      qual: null,
      env: "CatBoost 1.2.10",
      links: null
    }
  ]
});
