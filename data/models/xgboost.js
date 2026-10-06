/* XGBoost — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "xgboost",
  name: "XGBoost",
  task: "Tabular Prediction",
  family: "ML",
  arch: "트리 부스팅",
  learn: "지도학습",
  year: 2016,
  oneLine: "정규화가 강한 gradient boosting. 나무를 깊이 단위로 키운다",
  source: {
    org: "Tianqi Chen, Carlos Guestrin (U. Washington)",
    paper: "XGBoost: A Scalable Tree Boosting System (KDD 2016)"
  },
  purpose: "정형 데이터에서 높은 예측 성능을 낸다.",
  features: [
    "L1/L2 정규화로 과적합을 억제한다",
    "결측 자동 처리, 범주형 직접 처리(enable_categorical)",
    "feature importance 제공"
  ],
  limits: ["하이퍼파라미터 튜닝이 필요하다", "이미지·텍스트 같은 비정형 데이터에는 부적합"],
  lineage: [
    { id: "lightgbm", name: "LightGBM", rel: "같은 계열" },
    { id: "randomforest", name: "Random Forest", rel: "비교 대상 (bagging)" },
    { name: "Gradient Boosting", rel: "원형 알고리즘" }
  ],
  io: { input: "표 형태 데이터 (수치형, 범주형 피처)", output: "회귀는 예측값, 분류는 클래스별 확률" },
  code: `import xgboost as xgb

model = xgb.XGBClassifier(
    n_estimators=5000, learning_rate=0.05, max_depth=6,
    subsample=0.8, colsample_bytree=0.8,
    tree_method="hist", enable_categorical=True,
    early_stopping_rounds=200)
model.fit(X_train, y_train, eval_set=[(X_valid, y_valid)])

proba = model.predict_proba(X_test)`,
  train: [
    "피처 정리, 범주형은 category 타입으로 변환",
    "train / valid / test 분할",
    "max_depth, learning_rate, subsample, 정규화(reg_lambda) 설정",
    "검증 점수 기준 조기종료",
    "test로 최종 평가"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "회귀의 평균 오차" },
    { k: "정확도 / macro F1", v: "분류 성능" },
    { k: "AUC / log loss", v: "확률 예측의 순위와 보정 정도" }
  ],
  apps: [
    { f: "금융", t: "신용평가, 사기 탐지" },
    { f: "수요·판매 예측", t: "정형 피처 기반 예측" },
    { f: "Kaggle 등 정형 데이터 대회", t: "표준 선택지" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.15 – 09.29",
      role: "정형 파트 (비교 모델)",
      why: "LightGBM과 같은 계열의 비교 대상. 모델 종류가 성능을 가르는지 확인하려고 넣었다.",
      data: "LightGBM과 같은 마트와 같은 분할(7블록 시간순 CV, 시험 6,817개).",
      setup: "learning_rate 0.05, max_depth 6, min_child_weight 1.0, subsample 0.8, colsample 0.8, reg_lambda 1.0, hist, 범주형 직접 처리, balanced 가중치.",
      metrics: [
        ["macro F1", "0.441"],
        ["30+ 재현율", "0.40"],
        ["30+ 정밀도", "0.27"],
        ["블록 평균 순위", "1.57 (LightGBM 1.71)"]
      ],
      learned: "LightGBM과 신뢰구간이 겹쳐 사실상 같은 점수였다. 같은 피처를 쓰는 한 모델 종류는 답이 아니라는 결론에 이르렀다.",
      qual: null,
      env: "XGBoost 3.4.1",
      links: null
    }
  ]
});
