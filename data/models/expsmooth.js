/* 지수평활 (SES / DES / TES) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "expsmooth",
  name: "지수평활 (SES / DES / TES)",
  task: "Time-Series Forecasting",
  family: "Statistics",
  arch: "지수평활",
  learn: "통계 모델",
  year: 1960,
  oneLine: "최근 값에 더 큰 가중치를 주는 평활 기반 시계열 예측 (수준 / 추세 / 계절)",
  source: { org: "Brown (1956), Holt (1957), Winters (1960)", paper: null },
  purpose: "시계열의 수준·추세·계절 성분을 지수 가중으로 평활해 예측한다.",
  features: ["SES는 수준, DES는 수준+추세, TES는 수준+추세+계절", "계산이 가볍다", "대량 품목에 일괄 적용하기 쉽다"],
  limits: ["외생 변수(날씨, 이벤트)를 반영하지 못한다", "간헐수요에는 부적합해 Croston을 따로 쓴다"],
  lineage: [
    { id: "croston", name: "Croston", rel: "간헐수요용 변형" },
    { name: "ARIMA/SARIMA", rel: "비교 모델" }
  ],
  io: { input: "단변량 시계열 (월별 수요 등)", output: "향후 N기간 예측값" },
  code: `from statsmodels.tsa.holtwinters import ExponentialSmoothing

model = ExponentialSmoothing(
    y, trend="add", seasonal="add", seasonal_periods=12).fit()
forecast = model.forecast(12)`,
  train: [
    "시계열 정리 (결측·이상치 처리, 주기 확인)",
    "모델 선택: SES(수준), DES(수준+추세), TES(수준+추세+계절)",
    "평활 계수(alpha, beta, gamma)를 오차 최소화로 추정",
    "마지막 구간으로 검증 (롤링 예측)",
    "품목별로 오차가 가장 작은 모델을 선택"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "절대 오차" },
    { k: "MAPE / SMAPE", v: "비율 오차. SMAPE는 0 근처 값에서도 안정적" },
    { k: "bias", v: "과대·과소 예측 경향" }
  ],
  apps: [
    { f: "수요예측", t: "계절성·추세가 있는 품목" },
    { f: "재고관리", t: "발주량 산정" },
    { f: "재무·운영 지표", t: "단기 추세 예측" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 단기 예측 시계열 트랙 (직접 구현)",
      why: "품목별 수요 패턴(계절성·간헐 수요·추세)에 맞는 모델을 실험으로 비교·선정했다.",
      data: "서비스부품 월별 수요, 36개월 학습으로 12개월 예측.",
      setup: "Bucket Split, 부품별 과거 12개월 MAE 최소 모델 자동 선택(ML, DL 트랙과 함께).",
      metrics: [["프로젝트 KPI", "내수 84.1% / 수출 77.6%"]],
      learned: null,
      qual: null,
      env: "PySpark, Airflow, MLflow",
      links: null
    }
  ]
});
