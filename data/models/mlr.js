/* 다중선형회귀 (T-Value 변수 선별) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "mlr",
  name: "다중선형회귀 (T-Value 변수 선별)",
  task: "Statistical Analysis",
  family: "Statistics",
  arch: "선형 모델",
  learn: "통계 모델",
  year: null,
  oneLine: "여러 변수의 선형 관계를 추정하고 t값으로 유의한 변수를 가려내는 분석",
  source: { org: "고전 통계", paper: null },
  purpose: "종속변수와 여러 독립변수의 선형 관계를 추정하고 계수의 유의성을 해석한다.",
  features: ["계수와 t값으로 변수의 영향을 해석할 수 있다", "다중공선성(VIF)을 점검해야 한다"],
  limits: ["선형 관계만 잡는다"],
  lineage: [
    { id: "anova", name: "ANOVA", rel: "같은 통계 분석 도구" }
  ],
  io: { input: "독립변수 여러 개와 종속변수 (연속형)", output: "계수, t값, p값, 결정계수(R²)" },
  code: `import statsmodels.api as sm

X = sm.add_constant(df[feature_cols])
res = sm.OLS(df["y"], X).fit()
print(res.summary())          # 계수, t값, p값, R², F 통계량`,
  trainTitle: "분석 과정",
  train: [
    "변수 후보 설계와 이상치·결측 처리",
    "상관 분석으로 비슷한 변수를 묶고 다중공선성(VIF) 점검",
    "OLS로 적합",
    "t값·p값으로 유의한 변수 선별",
    "잔차 진단(정규성, 등분산)과 다른 방법(ML 변수 중요도)과의 교차 확인"
  ],
  metrics: [
    { k: "R² / adjusted R²", v: "설명력" },
    { k: "t값 / p-value", v: "변수별 유의성" },
    { k: "VIF", v: "다중공선성 정도 (보통 10 이상이면 주의)" }
  ],
  apps: [
    { f: "변수 선별", t: "요인 분석" },
    { f: "요인 해석", t: "가격·광고 효과 추정" },
    { f: "기준 회귀 모델", t: "비교 기준" }
  ],
  usage: [
    {
      p: "mobis-dealer",
      when: "2022",
      role: "분석 설계와 변수 선별",
      why: "본사 청구량 중심 예측에 대리점 단계의 실수요·재고 신호가 빠져 있었다. 청구/판매 비율 편차(76~186%)가 커서 사업소 단위로 설계했다.",
      data: "대리점 실수요·재고 207만 건.",
      setup: "후보 48개 → 상관 그룹핑 → 다중선형회귀 T-Value로 17개 선별. ML 변수 중요도 1순위(사업소 단위 재고비율)와 일치해 교차 검증.",
      metrics: [["후보 변수", "48개 → 17개"], ["원데이터", "207만 건"]],
      learned: "직접 설계했지만 중요도가 0%인 변수는 결과대로 보고하고 제외했다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
