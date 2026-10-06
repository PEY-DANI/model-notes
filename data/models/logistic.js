/* 로지스틱 회귀 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "logistic",
  name: "로지스틱 회귀",
  task: "Tabular Prediction",
  family: "ML",
  arch: "선형 모델",
  learn: "지도학습",
  year: 1958,
  oneLine: "입력의 가중합으로 확률을 내는 가장 단순한 분류 모델",
  source: { org: "David Cox (1958) 외", paper: "The regression analysis of binary sequences" },
  purpose: "가장 단순한 확률 분류기로, 비교 기준(baseline)으로 자주 쓴다.",
  features: ["해석이 쉽다", "학습이 빠르다"],
  limits: ["변수 간 상호작용과 비선형 관계를 잡지 못한다", "클래스 불균형에서는 임계값 조정이 필요하다"],
  lineage: [
    { id: "lightgbm", name: "LightGBM", rel: "비선형 대안" }
  ],
  io: { input: "표 형태 데이터 (수치형, 범주형은 인코딩)", output: "클래스별 확률" },
  code: `from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=1000, class_weight="balanced"))
model.fit(X_train, y_train)

proba = model.predict_proba(X_test)`,
  train: [
    "수치형 표준화, 범주형 원-핫 인코딩",
    "train / test 분할",
    "정규화 강도(C) 설정",
    "필요하면 class_weight로 불균형 보정",
    "정확도, F1, AUC로 평가"
  ],
  metrics: [
    { k: "정확도 / F1", v: "분류 성능" },
    { k: "ROC-AUC", v: "임계값과 무관한 구분 능력" },
    { k: "계수(odds ratio)", v: "변수 영향의 방향과 크기 해석" }
  ],
  apps: [
    { f: "의료", t: "발병 확률 예측" },
    { f: "마케팅", t: "구매·이탈 확률" },
    { f: "기준 모델", t: "복잡한 모델과 비교하는 하한선" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.17",
      role: "팀원 담당 (정형 비교 실험, 팀 비교표에 함께 수록)",
      why: "비선형이 얼마나 필요한지 보려고 넣었다.",
      data: "LightGBM과 같은 마트·분할.",
      setup: null,
      metrics: [["macro F1", "0.362"], ["30+ 재현율", "0.67"], ["30+ 정밀도", "0.13"]],
      learned: "30+를 많이 부르는 대신 대부분 틀렸다. 조합 효과를 못 잡는다는 점이 수치로 확인됐다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
