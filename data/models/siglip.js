/* SigLIP / FashionSigLIP — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "siglip",
  name: "SigLIP / FashionSigLIP",
  task: "Image Classification",
  family: "DL",
  arch: "ViT-B/16 (이미지-텍스트)",
  learn: "대조학습 사전학습",
  year: 2023,
  oneLine: "sigmoid 손실로 글과 그림을 짝지어 배운 이미지-텍스트 임베딩 모델과 그 패션 특화 버전",
  source: {
    org: "Google (Zhai 외), FashionSigLIP: Marqo (패션 도메인 학습 공개 모델)",
    paper: "Sigmoid Loss for Language Image Pre-Training (ICCV 2023)"
  },
  purpose: "이미지와 텍스트를 같은 공간의 벡터로 바꿔 분류, 검색, 유사도 계산에 쓴다.",
  features: [
    "CLIP의 softmax 대조 손실을 sigmoid 손실로 바꿔 학습한다",
    "FashionSigLIP은 패션 이미지·텍스트로 추가 학습된 공개 모델이다"
  ],
  limits: ["open_clip 등 별도 라이브러리와 가중치 다운로드가 필요하다", "세밀한 시각 속성은 도메인 미세조정이 필요할 수 있다"],
  lineage: [
    { id: "clip", name: "CLIP", rel: "전 단계 (softmax 대조학습)" },
    { id: "dinov3", name: "DINOv3", rel: "비교한 임베딩" }
  ],
  io: { input: "이미지, 그리고 텍스트", output: "이미지 임베딩과 텍스트 임베딩 (같은 공간)" },
  code: `import torch, open_clip

model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-16-SigLIP", pretrained="webli")
model.eval()

with torch.no_grad():
    feat = model.encode_image(preprocess(img).unsqueeze(0))
    feat = feat / feat.norm(dim=-1, keepdim=True)   # 정규화한 이미지 임베딩`,
  trainTitle: "적용 과정",
  train: [
    "사전학습 가중치 불러오기 (일반 SigLIP 또는 패션 특화 FashionSigLIP)",
    "이미지를 전처리하고 임베딩 추출",
    "임베딩을 정규화해 코사인 유사도로 이웃 검색·군집화"
  ],
  metrics: [
    { k: "zero-shot 정확도", v: "프롬프트만으로 낸 분류 성능" },
    { k: "Recall@K", v: "이미지-텍스트 검색 성능" },
    { k: "kNN 일치율 / 군집 순도", v: "임베딩 품질" }
  ],
  apps: [
    { f: "유사 상품 검색", t: "패션 이미지 임베딩 검색" },
    { f: "zero-shot 분류", t: "라벨 없는 분류" },
    { f: "멀티모달 검색", t: "텍스트로 이미지 찾기" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09 (09.15 이후)",
      role: "정형 파트: 사진 임베딩 추출, 군집, k-NN 피처 실험",
      why: "브랜드 안에서 상품을 가를 정보가 없다는 진단 뒤, 사진에서 '어떤 상품인가' 신호를 찾으려고 패션 특화 임베딩을 시도했다.",
      data: "상품 16,719개, 상품당 최대 5장.",
      setup: "FashionSigLIP과 SigLIP으로 임베딩을 뽑아 군집(k=2~8)을 만들고 (중간층 L4~L12 임베딩도 추출해 비교) 네 가지를 시험: 군집별 독립 모델, 군집 번호 피처, 군집별 이어 학습, 유사 상품 이웃 리뷰 피처.",
      metrics: [["군집별 독립 모델 순위 ρ", "0.465 (기준 0.479)"], ["군집 번호 피처", "차이 없음"], ["이웃 리뷰 피처", "차이 없음"]],
      learned: "효과가 없었던 이유는 두 가지였다. 임베딩이 담는 의류 종류 정보가 소분류와 중복됐고, 군집으로 학습 데이터를 나누면 히트 예시가 쪼개져 오히려 손해였다. 모델이 아니라 정보 중복과 표본 부족의 문제라고 정리했다.",
      qual: null,
      env: "open_clip, Hugging Face hub, 서버 GPU",
      links: null
    }
  ]
});
