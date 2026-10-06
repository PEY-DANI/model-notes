/* 클러스터링 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "clustering",
  name: "클러스터링",
  task: "Time-Series Forecasting",
  family: "ML",
  arch: "비지도 군집",
  learn: "비지도학습",
  year: null,
  oneLine: "감모 패턴이 비슷한 부품을 군집으로 묶어 패턴 풀로 예측",
  source: { org: "일반 기법", paper: null },
  purpose: "비슷한 개체를 군집으로 묶어 군집 단위로 패턴을 공유하거나 분석한다.",
  features: ["k-means, 계층적 군집 등 방법과 거리 함수를 고를 수 있다", "군집 수 선택(엘보, 실루엣 등)이 결과를 좌우한다"],
  limits: ["군집 수와 기준 선택에 민감하다"],
  lineage: [
    { id: "weibull", name: "Weibull", rel: "병행 모델" }
  ],
  io: { input: "개체별 특징 벡터 (표준화한 값)", output: "개체별 군집 번호" },
  code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

best = None
for k in range(2, 11):
    labels = KMeans(n_clusters=k, n_init=10, random_state=42).fit_predict(X)
    score = silhouette_score(X, labels)
    if best is None or score > best[1]:
        best = (k, score, labels)
k, score, labels = best`,
  train: [
    "특징 설계와 표준화",
    "군집 방법 선택 (k-means, 계층적 군집 등)",
    "군집 수 후보를 돌리며 실루엣 점수·엘보로 비교",
    "군집별 프로필을 확인해 해석",
    "군집 번호를 피처나 분할 기준으로 활용"
  ],
  metrics: [
    { k: "실루엣 점수", v: "군집 내 응집도와 군집 간 분리도" },
    { k: "관성(inertia) / 엘보", v: "군집 수 선택 기준" },
    { k: "군집별 크기 균형", v: "한쪽으로 쏠렸는지 확인" }
  ],
  apps: [
    { f: "고객·상품 세분화", t: "비슷한 개체 그룹화" },
    { f: "시계열 패턴 그룹화", t: "패턴이 비슷한 품목 묶기" },
    { f: "이상 탐지", t: "어느 군집에도 속하지 않는 개체" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 장기 예측 감모율 모델 (직접 구현)",
      why: "부품별 이력 길이가 달라 패턴을 공유할 방법이 필요했다.",
      data: "서비스부품 장기 수요.",
      setup: "등차감소(WM), 클러스터링 패턴 풀(CL), 속성 기반(ATTB) 3종 중 하나.",
      metrics: [],
      learned: null,
      qual: null,
      env: null,
      links: null
    }
  ]
});
