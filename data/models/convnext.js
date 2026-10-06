/* ConvNeXt — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "convnext",
  name: "ConvNeXt",
  task: "Image Classification",
  family: "DL",
  arch: "CNN (현대화)",
  learn: "사전학습 + 파인튜닝",
  year: 2022,
  oneLine: "Transformer의 설계 요소를 취해 현대화한 CNN",
  source: { org: "Meta AI / UC Berkeley (Zhuang Liu 외)", paper: "A ConvNet for the 2020s (CVPR 2022)" },
  purpose: "사전학습 가중치를 파인튜닝해 분류 정확도를 높인다.",
  features: ["Tiny/Small/Base 크기 선택", "in22k 사전학습 후 in1k 파인튜닝 가중치 사용 가능"],
  limits: ["모델 크기(Tiny → Base)가 커질수록 메모리와 연산이 크게 늘어난다"],
  lineage: [
    { id: "resnet", name: "ResNet", rel: "전 단계 CNN" },
    { id: "swin", name: "Swin Transformer", rel: "비교 대상" }
  ],
  io: { input: "이미지 (224×224 RGB)", output: "클래스 점수" },
  code: `import timm

model = timm.create_model("convnext_small.fb_in22k_ft_in1k",
                          pretrained=True, num_classes=6)
# PyTorch Lightning 등으로 학습 후 추론
logits = model(x)`,
  train: [
    "timm으로 사전학습 가중치와 함께 모델 생성 (num_classes로 헤드 교체)",
    "데이터 증강과 정규화 설정",
    "작은 학습률(예: 1e-4)과 weight decay로 파인튜닝",
    "검증 정확도 기준 최고 체크포인트 저장",
    "TTA나 앙상블로 추가 개선 시도"
  ],
  metrics: [
    { k: "Accuracy", v: "전체 정확도" },
    { k: "클래스별 precision / recall / F1", v: "클래스별 성능" },
    { k: "혼동행렬", v: "혼동되는 클래스 확인" }
  ],
  apps: [
    { f: "이미지 분류", t: "전이학습 백본" },
    { f: "탐지·분할의 백본", t: "특징 추출기" },
    { f: "대회·실무 분류 과제", t: "강한 기준 모델" }
  ],
  usage: [
    {
      p: "wt-intel",
      when: "2026.09",
      role: "개인 과제",
      why: "파인튜닝 효율이 좋은 현대 CNN으로 시작했다. 크기(Tiny/Small)와 seed를 바꿔 비교했다.",
      data: "Intel Image Classification 6클래스, 균형 분포(불균형 비율 1.15). 최종 평가 seg_test 3,000장.",
      setup: "timm convnext_small.fb_in22k_ft_in1k, lr 1e-4, weight decay 1e-4, PyTorch Lightning + TensorBoard, 증강, TTA(좌우 반전).",
      metrics: [
        ["Small val", "0.9591"],
        ["Small test", "0.9563"],
        ["Tiny test", "0.9497"],
        ["seed 42 / 1234 test", "0.9543 / 0.9517"],
        ["5모델 앙상블+TTA test", "0.9560"],
        ["val 기준 선택 조합 test", "0.9530"]
      ],
      learned: "train 안에 중복 15쌍이 있고 그중 10쌍은 라벨이 서로 달랐다(buildings↔street, glacier↔mountain). 양쪽 모두 제거했고, 라벨 노이즈 때문에 94~96%에서 더 오르지 않는다는 점을 확인했다. 5모델 앙상블과 TTA의 이득은 거의 없었고, 검증 0.9634로 고른 2개 조합이 테스트 0.9530으로 오히려 낮아 검증 기준 선택이 과적합될 수 있음을 확인했다.",
      qual: "glacier와 mountain이 가장 많이 혼동됐다(F1 0.92 안팎).",
      env: "PyTorch Lightning, timm, TensorBoard",
      links: null
    }
  ]
});
