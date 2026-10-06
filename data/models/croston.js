/* Croston — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "croston",
  name: "Croston",
  task: "Time-Series Forecasting",
  family: "Statistics",
  arch: "간헐수요 분해",
  learn: "통계 모델",
  year: 1972,
  oneLine: "수요 크기와 수요 발생 간격을 따로 평활하는 간헐수요 예측법",
  source: { org: "J. D. Croston (1972)", paper: "Forecasting and stock control for intermittent demands" },
  purpose: "0이 많은 간헐수요 부품의 예측을 안정화한다.",
  features: ["수요 크기와 발생 간격을 분리해 평활한다"],
  limits: ["수요 발생 시점의 불확실성을 잘 표현하지 못한다", "편향이 있다는 지적이 있어 변형(SBA 등)이 따로 있다"],
  lineage: [
    { id: "expsmooth", name: "지수평활", rel: "기반" },
    { id: "pomdp", name: "POMDP", rel: "0 예측 대안 접근" }
  ],
  io: { input: "간헐적인 시계열 (0이 많은 수요)", output: "기간당 평균 수요율 예측값 (단일 값)" },
  code: `def croston(y, alpha=0.1):
    z = p = None          # z: 수요 크기, p: 수요 발생 간격
    q = 1                 # 마지막 수요 이후 경과 기간
    forecast = []
    for x in y:
        if x > 0:
            if z is None:
                z, p = x, q
            else:
                z += alpha * (x - z)
                p += alpha * (q - p)
            q = 1
        else:
            q += 1
        forecast.append(z / p if z else 0)
    return forecast`,
  train: [
    "수요가 발생한 시점만 골라 크기와 발생 간격을 분리",
    "각각을 지수평활로 갱신",
    "예측값 = 평활된 수요 크기 / 평활된 발생 간격",
    "SBA 등 편향 보정 변형과 비교",
    "간헐성 지표(ADI, CV²)로 적용 대상 판별"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "절대 오차" },
    { k: "MASE", v: "단순 예측 대비 상대 오차 (0이 많은 데이터에 적합)" },
    { k: "서비스 수준 / 재고 비용", v: "재고 의사결정 기준 성과" }
  ],
  apps: [
    { f: "서비스부품 수요", t: "간헐적으로 발생하는 부품" },
    { f: "재고 정책", t: "안전재고 산정" },
    { f: "희소 이벤트 카운트", t: "드문 발생량 예측" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 단기 예측 시계열 트랙 (직접 구현)",
      why: "간헐수요 부품이 전체 예측 대상의 67% 이상이라 별도 모델이 필요했다.",
      data: "서비스부품 월별 수요.",
      setup: null,
      metrics: [],
      learned: null,
      qual: null,
      env: null,
      links: null
    }
  ]
});
