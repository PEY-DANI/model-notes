/* Weibull 분포 적합 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "weibull",
  name: "Weibull 분포 적합",
  task: "Time-Series Forecasting",
  family: "Statistics",
  arch: "분포 적합",
  learn: "통계 모델",
  year: 1951,
  oneLine: "정비율·소요율 분포를 Weibull로 맞추는 장기 수명주기 예측",
  source: {
    org: "Waloddi Weibull (1951)",
    paper: "A Statistical Distribution Function of Wide Applicability"
  },
  purpose: "고장·수명 데이터를 모델링하는 확률분포. 시간에 따른 고장률의 증가·감소를 표현한다.",
  features: ["형상(shape)과 척도(scale) 모수로 고장률 형태를 표현한다", "적합도는 K-S, A-D 같은 검정으로 확인한다"],
  limits: ["분포 가정이 맞지 않으면 편향된다"],
  lineage: [
    { id: "clustering", name: "클러스터링 감모율", rel: "장기 예측 병행 모델" }
  ],
  io: { input: "수명·고장 시간 또는 발생률 데이터", output: "형상(shape)·척도(scale) 모수, 적합도 검정 결과" },
  code: `from scipy.stats import weibull_min, kstest

shape, loc, scale = weibull_min.fit(data, floc=0)       # 위치 모수는 0으로 고정
stat, p_value = kstest(data, "weibull_min", args=(shape, loc, scale))
# p_value > 유의수준이면 Weibull 분포를 따른다는 가정을 기각하지 못함`,
  trainTitle: "적합 과정",
  train: [
    "분석 단위별 데이터 정리 (경과 기간별 발생률 등)",
    "최대우도법 등으로 shape, scale 추정",
    "K-S, Anderson-Darling 검정으로 적합도 확인",
    "다른 분포(지수, 로그정규 등)와 비교해 분포 선택",
    "적합된 분포로 미래 값을 추정"
  ],
  metrics: [
    { k: "K-S / A-D 검정 p-value", v: "분포 적합도" },
    { k: "AIC / BIC", v: "분포 간 비교" },
    { k: "Q-Q plot", v: "시각적 적합 확인" }
  ],
  apps: [
    { f: "신뢰성 공학", t: "부품 수명과 고장률 분석" },
    { f: "부품 수요", t: "경과 연수별 정비율 모델" },
    { f: "생존 분석", t: "이탈까지의 시간" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 장기 예측 (운영·검증 참여, 모델 개발은 프로젝트 팀)",
      why: "EOP+15~22년 장기 예측에 수명 분포가 필요했다.",
      data: "정비율, 소요율.",
      setup: "Weibull fitting, K-S·A-D 검정. 검정 p-value > 0.1로 분포를 선택.",
      metrics: [],
      learned: null,
      qual: null,
      env: null,
      links: null
    }
  ]
});
