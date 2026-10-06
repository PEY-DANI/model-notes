/* Poisson Regressor / MLPR — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "poisson-mlpr",
  name: "Poisson Regressor / MLPR",
  task: "Time-Series Forecasting",
  family: "ML",
  arch: "GLM / 신경망",
  learn: "지도학습",
  year: null,
  oneLine: "기상 예측 개선에 추가한 Poisson 회귀와 MLP 회귀",
  source: { org: "Poisson GLM: Nelder & Wedderburn (1972), MLPR: scikit-learn MLPRegressor", paper: null },
  purpose: "카운트형 타깃에 쓰는 Poisson 회귀(GLM)와 MLP 회귀.",
  features: ["Poisson 회귀는 음이 아닌 정수 타깃에 맞는 분포를 가정한다", "MLP 회귀는 비선형 관계를 학습한다"],
  limits: ["Poisson 회귀는 과산포(평균보다 큰 분산) 데이터에서 분산을 과소추정한다"],
  lineage: [
    { id: "expsmooth", name: "지수평활", rel: "기존 기상 예측 계열" }
  ],
  io: { input: "표 형태 피처", output: "음이 아닌 예측값 (Poisson 회귀는 기댓값, MLP 회귀는 연속값)" },
  code: `from sklearn.linear_model import PoissonRegressor
from sklearn.neural_network import MLPRegressor

pois = PoissonRegressor(alpha=1e-3, max_iter=1000).fit(X_train, y_train)
mlp = MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=500,
                   early_stopping=True, random_state=42).fit(X_train, y_train)

pred = (pois.predict(X_test) + mlp.predict(X_test)) / 2   # 단순 평균 앙상블 예시`,
  train: [
    "타깃의 분포 확인 (카운트·음이 아닌 값)",
    "피처 스케일링",
    "Poisson 회귀의 규제 강도, MLP의 은닉층·조기종료 설정",
    "검증 세트에서 MAE로 비교",
    "필요하면 모델 결과를 평균·중앙값으로 결합"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "절대 오차" },
    { k: "Poisson deviance", v: "카운트 타깃의 적합도" },
    { k: "실제값 대비 비교", v: "관측치와의 차이" }
  ],
  apps: [
    { f: "카운트 예측", t: "방문·고장·주문 건수" },
    { f: "기상 변수 예측", t: "강수량 등" },
    { f: "보험", t: "청구 건수" }
  ],
  usage: [
    {
      p: "mobis-weather",
      when: "2024.07 – 2024.09",
      role: "기상 예측 모델 보강과 후보정 확장",
      why: "해외 법인이 기상 보정값을 창고 발주에 못 쓴다고 요청했다. 확인해 보니 전환 때 후보정 로직이 누락돼 있었다. 보정 로직보다 기상 예측 모델부터 개선하는 쪽이 맞다고 판단했다.",
      data: "본사·해외 법인 12개 대상 2,646개 부품.",
      setup: "Poisson Regressor, MLPR 추가. 법인 단위 보정을 창고 단위로 확장. 개선 결과는 소규모 대상(2~5개 부품)이 아닌 전체 대상 기준으로 보고. TBATS는 수행 시간 대비 효과가 불확실해 제외했다.",
      metrics: [["정확도 가중평균", "+2.6%p"], ["최대", "+5.78%p"], ["대상", "2,646개 부품"]],
      learned: "소규모 대상의 정확도 하락에 피드백이 몰려, 개선 결과를 전체 대상 기준으로 보고하는 방식으로 바꿨다.",
      qual: null,
      env: "월배치 정식 반영",
      links: null
    }
  ]
});
