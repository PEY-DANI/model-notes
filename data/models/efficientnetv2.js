/* EfficientNetV2 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "efficientnetv2",
  name: "EfficientNetV2",
  task: "Image Classification",
  family: "DL",
  arch: "CNN",
  learn: "사전학습 + 파인튜닝",
  year: 2021,
  oneLine: "학습 속도와 파라미터 효율을 함께 높인 CNN",
  source: {
    org: "Google (Mingxing Tan, Quoc Le)",
    paper: "EfficientNetV2: Smaller Models and Faster Training (ICML 2021)"
  },
  purpose: "학습 속도와 파라미터 효율을 높인 CNN 백본.",
  features: [
    "Fused-MBConv로 학습이 빠르다",
    "해상도를 점진적으로 키우는 progressive learning을 쓴다",
    "in21k 사전학습 가중치가 공개되어 있다"
  ],
  limits: ["대형 모델 대비 최고 정확도는 낮은 편이다", "입력 해상도와 증강 설정에 민감하다"],
  lineage: [
    { id: "resnet", name: "ResNet", rel: "CNN 계보" },
    { id: "convnext", name: "ConvNeXt", rel: "비교 대상" }
  ],
  io: { input: "이미지 (224~300 해상도 RGB)", output: "클래스 점수" },
  code: `import timm

model = timm.create_model("tf_efficientnetv2_s.in21k_ft_in1k",
                          pretrained=True, num_classes=6)
logits = model(x)`,
  train: [
    "timm으로 사전학습 모델 생성 (헤드 교체)",
    "해상도와 증강 설정 (progressive learning에서는 해상도를 점차 키움)",
    "작은 학습률로 파인튜닝",
    "검증 정확도로 체크포인트 선택",
    "test로 평가"
  ],
  metrics: [
    { k: "Accuracy", v: "전체 정확도" },
    { k: "클래스별 F1", v: "클래스별 성능" },
    { k: "FLOPs / 파라미터 수", v: "효율성" }
  ],
  apps: [
    { f: "모바일·엣지 분류", t: "가벼운 모델이 필요한 환경" },
    { f: "이미지 분류", t: "전이학습" },
    { f: "앙상블 멤버", t: "서로 다른 구조와의 조합" }
  ],
  usage: [
    {
      p: "wt-intel",
      when: "2026.09",
      role: "개인 과제",
      why: "서로 다른 계열 백본 조합을 보려고 선택했다.",
      data: "ConvNeXt와 같음.",
      setup: "tf_efficientnetv2_s.in21k_ft_in1k, 해상도 300 변형 포함.",
      metrics: [["val", "0.9496"], ["test", "0.9463"]],
      learned: "세 계열 중 가장 낮았다.",
      qual: null,
      env: "PyTorch Lightning, timm",
      links: null
    }
  ]
});
