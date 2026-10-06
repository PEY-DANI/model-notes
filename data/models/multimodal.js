/* 멀티모달 신경망 (사진 + 정형) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "multimodal",
  name: "멀티모달 신경망 (사진 + 정형)",
  task: "Tabular Prediction",
  family: "DL",
  arch: "2가지 신경망 결합",
  learn: "지도학습 / 파인튜닝",
  year: 2026,
  oneLine: "사진 가지와 정형 가지를 이어 붙여 한꺼번에 학습하는 신경망",
  source: { org: "일반 구조 (멀티모달 late fusion)", paper: null },
  purpose: "서로 다른 입력 양식(이미지, 표 등)을 각각의 가지로 처리한 뒤 결합해 예측한다.",
  features: ["양식별 인코더(가지)를 두고 마지막 층에서 결합한다", "사전학습 백본을 얼리거나 일부만 파인튜닝할 수 있다"],
  limits: ["데이터가 적으면 파인튜닝 시 과적합하기 쉽다", "양식 간 정보가 겹치면 결합 이득이 작다"],
  lineage: [
    { id: "dinov3", name: "DINOv3", rel: "사진 백본" },
    { id: "mlp", name: "MLP", rel: "정형 가지" }
  ],
  io: { input: "양식별 입력 (이미지 임베딩 벡터 + 정형 피처 벡터)", output: "클래스별 점수 또는 회귀 예측값" },
  code: `class Fusion(nn.Module):
    def __init__(self, d_img, d_tab, n_classes):
        super().__init__()
        self.img = nn.Sequential(nn.Linear(d_img, 128), nn.ReLU())
        self.tab = nn.Sequential(nn.Linear(d_tab, 128), nn.ReLU())
        self.head = nn.Linear(256, n_classes)

    def forward(self, img_vec, tab_vec):
        z = torch.cat([self.img(img_vec), self.tab(tab_vec)], dim=1)
        return self.head(z)`,
  trainTitle: "적용 과정",
  train: [
    "양식별 입력 준비 (이미지는 백본으로 임베딩 추출)",
    "가지(branch)별 인코더와 결합 층 설계",
    "백본을 얼릴지, 일부 블록만 풀어 파인튜닝할지 결정",
    "공통 손실로 가지들을 함께 학습",
    "각 가지만 쓴 모델과 비교해 결합 효과 확인"
  ],
  metrics: [
    { k: "macro F1 / 정확도", v: "분류 성능" },
    { k: "단일 양식 모델 대비 증감", v: "결합의 추가 가치" },
    { k: "학습·검증 곡선", v: "과적합 여부" }
  ],
  apps: [
    { f: "이미지 + 메타데이터", t: "상품 사진 + 속성 기반 예측" },
    { f: "의료", t: "영상 + 임상 정보" },
    { f: "추천", t: "콘텐츠 + 사용자 정보" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.17, 09.28",
      role: "팀원 담당 (사진·딥러닝 결합 실험, 팀 비교표에 함께 수록)",
      why: "사진을 열로 붙이거나 확률로 섞는 방식과 달리 사진 정보를 라벨로 직접 학습해 보려고 넣었다.",
      data: "최신 3블록(시험 2,803개).",
      setup: "F3: 얼린 DINOv3 + 정형 가지. F4: DINOv3 마지막 2블록 파인튜닝(학습 파라미터 14.2M), 대표 사진 1장, seed 1, 8에폭, 서버 GPU 75분.",
      metrics: [
        ["F3 macro F1", "0.429"],
        ["정형 MLP 짝", "0.406"],
        ["사진의 값어치 F3 − MLP", "+0.023"],
        ["F4 파인튜닝", "0.387"],
        ["LightGBM (같은 블록)", "0.458"]
      ],
      learned: "F4 첫 실행(0.396, 8분)은 블록이 풀리지 않아 사실상 얼린 모델이었다. 실행 시간이 짧다는 점이 단서였고, 코드를 고쳐 재실행해 결론(F4 < F3)을 실제로 확인했다.",
      qual: null,
      env: "서버 GPU",
      links: null
    }
  ]
});
