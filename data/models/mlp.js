/* MLP (다층 퍼셉트론) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "mlp",
  name: "MLP (다층 퍼셉트론)",
  task: "Tabular Prediction",
  family: "DL",
  arch: "완전연결 신경망",
  learn: "지도학습",
  year: 1986,
  oneLine: "입력을 여러 층의 완전연결 층에 통과시키는 기본 신경망",
  source: {
    org: "Rumelhart, Hinton, Williams 외",
    paper: "Learning representations by back-propagating errors (Nature, 1986)"
  },
  purpose: "정형 데이터에 쓰는 기본 신경망. 다른 양식(이미지 등)의 가지와 결합하는 구조의 기본 단위가 된다.",
  features: ["범주형은 임베딩으로 넣는다", "이미지 임베딩과 쉽게 결합된다"],
  limits: ["데이터가 적으면 트리 계열보다 성능이 낮은 경향이 있다", "학습 구간의 분포 변화에 민감하다"],
  lineage: [
    { id: "lightgbm", name: "LightGBM", rel: "비교 대상" },
    { id: "multimodal", name: "멀티모달 신경망", rel: "확장" }
  ],
  io: { input: "수치 벡터 (범주형은 임베딩이나 원-핫으로 변환)", output: "클래스별 점수(logit) 또는 회귀 예측값" },
  code: `import torch, torch.nn as nn

model = nn.Sequential(
    nn.Linear(n_features, 128), nn.ReLU(),
    nn.Linear(128, 64), nn.ReLU(),
    nn.Linear(64, n_classes))
loss_fn = nn.CrossEntropyLoss(weight=class_weights)
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)

for xb, yb in loader:
    opt.zero_grad()
    loss_fn(model(xb), yb).backward()
    opt.step()`,
  train: [
    "수치형 표준화, 범주형 임베딩 설계",
    "DataLoader 구성",
    "손실함수와 옵티마이저 설정",
    "에폭 반복, 검증 점수로 조기종료",
    "test로 평가"
  ],
  metrics: [
    { k: "정확도 / macro F1", v: "분류 성능" },
    { k: "MAE / RMSE", v: "회귀 오차" },
    { k: "학습·검증 loss 곡선", v: "과적합 여부 확인" }
  ],
  apps: [
    { f: "정형 예측", t: "트리 모델과 비교하는 신경망 기준 모델" },
    { f: "멀티모달 모델", t: "표 데이터 가지(branch)" },
    { f: "임베딩 위 분류 헤드", t: "이미지·텍스트 벡터 분류" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.17",
      role: "팀원 담당 (정형 비교 실험, 팀 비교표에 함께 수록)",
      why: "멀티모달 신경망과 같은 정형 가지를 써서 사진의 값어치를 공정하게 재려는 짝으로 넣었다.",
      data: "LightGBM과 같은 마트·분할. 브랜드 이름 임베딩 포함.",
      setup: "2층(128 → 64), 검증 macro F1 기준 조기종료 20에폭, balanced 손실.",
      metrics: [["macro F1 (시간순)", "0.386"], ["macro F1 (무작위 분할)", "0.470"]],
      learned: "무작위 분할에서는 LightGBM과 같은데 시간순으로 나누면 0.08 떨어진다. 브랜드 임베딩을 빼고 재실행해도 방향이 없어, 브랜드 탓이 아니라 이 규모에서 신경망이 원래 낮다고 정리했다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
