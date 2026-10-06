/* ANOVA — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "anova",
  name: "ANOVA",
  task: "Statistical Analysis",
  family: "Statistics",
  arch: "분산분석",
  learn: "통계 검정",
  year: 1925,
  oneLine: "집단 평균 차이가 우연이 아닌지 가르는 분산분석",
  source: { org: "Ronald Fisher (1925)", paper: null },
  purpose: "집단 간 평균 차이가 우연이 아닌지 집단 간 분산과 집단 내 분산을 비교해 검정한다.",
  features: ["F 검정으로 집단 간 차이를 판단한다", "공변량을 넣으면 추세 등을 통제할 수 있다"],
  limits: ["정규성·등분산 가정이 필요하다", "유의함이 효과의 크기를 뜻하지는 않는다"],
  lineage: [
    { id: "mlr", name: "다중선형회귀", rel: "같은 통계 분석 도구" }
  ],
  io: { input: "집단 변수(범주)와 연속형 결과 변수, 필요하면 공변량", output: "F 통계량, p-value, 집단 간 차이 유무" },
  code: `import statsmodels.formula.api as smf
from statsmodels.stats.anova import anova_lm

model = smf.ols("demand ~ C(season) + year", data=df).fit()   # year는 추세 통제용
table = anova_lm(model, typ=2)
print(table)          # C(season)의 F, p-value`,
  trainTitle: "분석 과정",
  train: [
    "집단 정의와 가설 설정 (귀무가설: 집단 평균이 같다)",
    "정규성·등분산 가정 점검",
    "필요하면 공변량으로 추세를 통제하고 ANOVA 수행",
    "유의하면 사후검정(Tukey 등)으로 어느 집단이 다른지 확인",
    "효과 크기(η²)까지 함께 보고"
  ],
  metrics: [
    { k: "F 통계량 / p-value", v: "집단 간 차이의 유의성" },
    { k: "효과 크기 (η²)", v: "차이의 크기" },
    { k: "사후검정 p-value", v: "집단 쌍별 차이" }
  ],
  apps: [
    { f: "계절 효과 검정", t: "월·계절별 평균 차이" },
    { f: "실험 분석", t: "A/B/C 처리 비교" },
    { f: "품질 관리", t: "공정·설비 간 차이" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "계절성 판별 피처 설계",
      why: "계절 플래그를 일괄로 달면 계절성이 없는 부품에도 노이즈가 들어간다.",
      data: "서비스부품 월별 수요.",
      setup: "연도별 추세를 통제한 분산분석으로 계절 효과가 유의한 부품만 판별, 결과를 유무 플래그가 아니라 계절별 쏠림 정도까지 담은 피처 세트로 구성.",
      metrics: [],
      learned: null,
      qual: null,
      env: null,
      links: null
    }
  ]
});
