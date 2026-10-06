/* POMDP — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "pomdp",
  name: "POMDP",
  task: "Probabilistic Decision-Making",
  family: "ML",
  arch: "확률 모델",
  learn: "확률 모델 / 규칙",
  year: 1998,
  oneLine: "부분 관측 마르코프 결정 과정. 간헐수요의 발생 여부를 상태 전이로 모델링",
  source: {
    org: "Åström (1965), Kaelbling 외 (1998)",
    paper: "Planning and acting in partially observable stochastic domains"
  },
  purpose: "관측이 불완전한 환경에서 상태 전이와 행동에 따른 결과를 확률적으로 모델링하는 의사결정 모델.",
  features: ["상태, 행동, 관측, 전이확률, 보상으로 구성된다", "상태를 직접 볼 수 없을 때 믿음(belief)을 갱신한다"],
  limits: ["상태·관측 공간이 커지면 정확한 해를 구하기 어렵다"],
  lineage: [
    { id: "croston", name: "Croston", rel: "간헐수요 대안" }
  ],
  io: { input: "상태 전이 확률 T, 관측 확률 O, 보상 R, 현재 믿음(belief)", output: "믿음 갱신 결과와 최적 행동" },
  code: `import numpy as np

def update_belief(b, a, o, T, O):
    # b: 상태 믿음 (S,), T[a]: (S, S) 전이, O[a]: (S, 관측 수) 관측 확률
    b_new = O[a][:, o] * (b @ T[a])      # 예측 후 관측으로 보정
    return b_new / b_new.sum()           # 정규화`,
  trainTitle: "구성 과정",
  train: [
    "상태, 행동, 관측의 집합 정의",
    "상태 전이 확률과 관측 확률 추정 (데이터에서 통계적으로 추정)",
    "행동별 보상 설계",
    "믿음을 갱신하며 정책 계산 (근사 해법: point-based value iteration 등)",
    "시뮬레이션이나 과거 데이터로 정책 평가"
  ],
  metrics: [
    { k: "누적 보상", v: "정책이 얻은 총 보상" },
    { k: "상태 추정 정확도", v: "믿음이 실제 상태와 맞는 정도" },
    { k: "계산 시간", v: "상태 공간 크기에 따른 해결 비용" }
  ],
  apps: [
    { f: "로봇 내비게이션", t: "센서가 불완전한 환경" },
    { f: "의료 의사결정", t: "관측 불가능한 질병 상태" },
    { f: "대화 시스템", t: "사용자 의도 추정" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "직접 작성한 코드 (model_zero_pred_ds_v1.py 260줄, POMDP.py, controller.py)",
      why: "간헐수요 부품의 0 예측을 별도 모듈로 분리하려고 했다.",
      data: "서비스부품 수요.",
      setup: "상태전이를 Logistic Regression 기반으로 추정, 24개월 발생 플래그 생성. 상태전이행렬을 액션(Promote / No Action)에 따라 조정하고, 수요 예측값 × 0 예측 플래그를 결합하는 controller로 연결.",
      metrics: [],
      learned: null,
      qual: null,
      env: null,
      links: null
    }
  ]
});
