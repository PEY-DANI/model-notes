/* Swin Transformer — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "swin",
  name: "Swin Transformer",
  task: "Image Classification",
  family: "DL",
  arch: "ViT (shifted window)",
  learn: "사전학습 + 파인튜닝",
  year: 2021,
  oneLine: "이동 윈도우 어텐션을 쓰는 계층형 비전 Transformer",
  source: {
    org: "Microsoft Research Asia (Ze Liu 외)",
    paper: "Swin Transformer: Hierarchical Vision Transformer using Shifted Windows (ICCV 2021)"
  },
  purpose: "이동 윈도우 어텐션으로 고해상도 입력에서도 효율적인 비전 Transformer 백본.",
  features: ["윈도우 단위 어텐션으로 계산량을 줄인다", "계층적 특징 맵"],
  limits: ["입력 해상도와 윈도우 크기에 맞춰야 한다"],
  lineage: [
    { id: "convnext", name: "ConvNeXt", rel: "비교 대상" },
    { id: "transformer", name: "Transformer", rel: "기반 구조" }
  ],
  io: { input: "이미지 (224×224 RGB)", output: "클래스 점수" },
  code: `import timm

model = timm.create_model("swin_tiny_patch4_window7_224.ms_in22k",
                          pretrained=True, num_classes=6)
logits = model(x)`,
  train: [
    "timm으로 사전학습 모델 생성 (헤드 교체)",
    "입력 크기를 224로 맞춤 (윈도우 크기와 정합)",
    "작은 학습률로 파인튜닝",
    "검증 정확도로 체크포인트 선택",
    "test로 평가"
  ],
  metrics: [
    { k: "Accuracy", v: "전체 정확도" },
    { k: "클래스별 F1", v: "클래스별 성능" },
    { k: "mIoU / mAP", v: "분할·탐지에 쓸 때의 지표" }
  ],
  apps: [
    { f: "이미지 분류", t: "비전 Transformer 백본" },
    { f: "객체 탐지·분할", t: "백본" },
    { f: "의료 영상", t: "고해상도 분석" }
  ],
  usage: [
    {
      p: "wt-intel",
      when: "2026.09",
      role: "개인 과제",
      why: "다른 계열 백본을 앙상블에 넣으려고 선택했다.",
      data: "ConvNeXt와 같음.",
      setup: "swin_tiny_patch4_window7_224.ms_in22k, lr 1e-4.",
      metrics: [["val", "0.9577"], ["test", "0.9553"]],
      learned: "ConvNeXt-Small과 거의 같은 점수였다.",
      qual: null,
      env: "PyTorch Lightning, timm",
      links: null
    }
  ]
});
