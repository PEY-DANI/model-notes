/* Random Forest — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "randomforest",
  name: "Random Forest",
  task: "Tabular Prediction",
  family: "ML",
  arch: "트리 배깅",
  learn: "지도학습",
  year: 2001,
  oneLine: "데이터를 조금씩 다르게 뽑아 키운 여러 나무의 평균",
  source: { org: "Leo Breiman (UC Berkeley)", paper: "Random Forests (Machine Learning, 2001)" },
  purpose: "여러 결정나무의 예측을 평균해 분산을 줄이고 안정적인 예측을 낸다.",
  features: ["과적합에 강하다", "튜닝 부담이 적다", "확률 출력으로 순위를 매기기 좋다"],
  limits: ["boosting 계열보다 소수 구간을 덜 잡는 경향", "모델 크기가 크다"],
  lineage: [
    { name: "Decision Tree", rel: "기본 단위" },
    { id: "xgboost", name: "XGBoost", rel: "비교 대상 (boosting)" }
  ],
  io: { input: "표 형태 데이터 (수치형 피처, 범주형은 인코딩 필요)", output: "분류는 클래스 확률, 회귀는 예측값" },
  code: `from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=500, class_weight="balanced", n_jobs=-1, random_state=42)
model.fit(X_train, y_train)

proba = model.predict_proba(X_test)
importance = model.feature_importances_`,
  train: [
    "범주형 인코딩, 결측 처리",
    "train / test 분할 (또는 교차검증)",
    "n_estimators, max_depth, min_samples_leaf 설정",
    "필요하면 class_weight로 불균형 보정",
    "교차검증 또는 test로 평가"
  ],
  metrics: [
    { k: "정확도 / F1", v: "분류 성능" },
    { k: "AUC", v: "클래스 구분 능력" },
    { k: "OOB score", v: "학습에 쓰이지 않은 샘플로 얻는 내부 검증 점수" }
  ],
  apps: [
    { f: "기준 모델(baseline)", t: "빠르게 성능 하한선 확보" },
    { f: "의료·금융", t: "변수 중요도를 함께 보는 분류" },
    { f: "이상 탐지", t: "Isolation Forest 등 변형" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.17",
      role: "팀원 담당 (정형 비교 실험, 팀 비교표에 함께 수록)",
      why: "단순한 모델도 확인해 두려고 넣었다.",
      data: "LightGBM과 같은 마트·분할.",
      setup: "나무 500개",
      metrics: [["macro F1", "0.438"], ["5건 이상 확률 상위 100 중 적중", "80 (최고)"], ["30+ 재현율", "0.31"]],
      learned: "트리 5종이 0.43~0.44로 한 덩어리였다. 구간 판정보다 확률 순위로 쓸 때 안정적이었다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
