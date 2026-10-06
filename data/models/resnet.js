/* ResNet — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "resnet",
  name: "ResNet",
  task: "Image Classification",
  family: "DL",
  arch: "CNN (잔차 연결)",
  learn: "지도 사전학습",
  year: 2015,
  oneLine: "잔차 연결로 깊은 CNN을 학습 가능하게 만든 표준 백본",
  source: {
    org: "Microsoft Research (Kaiming He 외)",
    paper: "Deep Residual Learning for Image Recognition (CVPR 2016)"
  },
  purpose: "잔차 연결(skip connection)로 깊은 네트워크를 안정적으로 학습시키는 표준 CNN 백본.",
  features: ["ResNet18/34/50 등 다양한 깊이", "전이학습의 기본 선택", "벡터 길이 2,048(ResNet50)"],
  limits: ["최신 ViT 계열보다 특징 품질이 낮다"],
  lineage: [
    { id: "vgg16", name: "VGG16", rel: "전 단계" },
    { id: "convnext", name: "ConvNeXt", rel: "현대화한 후속 CNN" }
  ],
  io: { input: "이미지 (224×224 RGB, ImageNet 정규화)", output: "클래스 점수, 또는 특징 벡터(ResNet50은 2,048차원)" },
  code: `import torch.nn as nn
from torchvision import models

model = models.resnet34(weights="IMAGENET1K_V1")
for p in model.parameters():
    p.requires_grad = False                        # 백본을 얼림
model.fc = nn.Linear(model.fc.in_features, n_classes)  # fc만 교체해 학습`,
  train: [
    "사전학습 가중치 불러오기",
    "fc 층을 내 클래스 수에 맞게 교체",
    "백본을 얼리고 fc만 학습 (Freeze + FC 교체)",
    "필요하면 layer4 등 뒤쪽 블록을 풀어 낮은 학습률로 파인튜닝",
    "검증 정확도로 모델 선택, test로 최종 평가"
  ],
  metrics: [
    { k: "Top-1 정확도", v: "분류 성능" },
    { k: "혼동행렬", v: "클래스별 오분류 패턴" },
    { k: "학습·검증 곡선", v: "과적합 여부" }
  ],
  apps: [
    { f: "이미지 분류", t: "표준 백본" },
    { f: "얼굴 인식·임베딩", t: "특징 추출" },
    { f: "다른 모델의 백본", t: "탐지·분할 모델의 특징 추출기" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.14 – 09.15",
      role: "팀원 담당 (이미지 파트)",
      why: "회의에서 정한 비교 후보(표준형).",
      data: "백본 비교와 같은 데이터.",
      setup: "ResNet50. partial은 layer4만 학습.",
      metrics: [["PR-AUC", "0.427 (1년치에서는 기준선 아래)"]],
      learned: "DINOv3보다 낮고 VGG16보다 높은 중간 수준이었다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
