/* VGG16 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "vgg16",
  name: "VGG16",
  task: "Image Classification",
  family: "DL",
  arch: "CNN",
  learn: "지도 사전학습",
  year: 2014,
  oneLine: "3×3 합성곱을 깊게 쌓은 고전 CNN",
  source: {
    org: "Oxford VGG (Simonyan, Zisserman)",
    paper: "Very Deep Convolutional Networks for Large-Scale Image Recognition (ICLR 2015)"
  },
  purpose: "3×3 합성곱을 깊게 쌓은 구조의 대표적인 기본 CNN 백본.",
  features: ["구조가 단순하다", "벡터 길이 4,096"],
  limits: ["크고 느리다", "최신 백본보다 특징 품질이 낮다"],
  lineage: [
    { id: "resnet", name: "ResNet", rel: "후속 (잔차 연결)" }
  ],
  io: { input: "이미지 (224×224 RGB, ImageNet 정규화)", output: "ImageNet 1000클래스 점수, 또는 특징 벡터(4,096차원)" },
  code: `import torch.nn as nn
from torchvision import models

model = models.vgg16(weights="IMAGENET1K_V1")
for p in model.features.parameters():
    p.requires_grad = False                       # 합성곱 층은 얼림
model.classifier[6] = nn.Linear(4096, n_classes)  # 마지막 층만 교체`,
  train: [
    "사전학습 가중치 불러오기",
    "마지막 분류 층을 내 클래스 수에 맞게 교체",
    "특징 추출 층을 얼리고 분류 층만 학습",
    "필요하면 마지막 합성곱 블록까지 풀어 파인튜닝",
    "검증 정확도 기준으로 최고 체크포인트 저장"
  ],
  metrics: [
    { k: "Top-1 정확도", v: "분류 성능" },
    { k: "검증 loss / 정확도 곡선", v: "과적합 여부" },
    { k: "파라미터 수 (약 1.38억)", v: "모델 크기" }
  ],
  apps: [
    { f: "전이학습 입문", t: "소규모 이미지 분류" },
    { f: "스타일 전이", t: "중간 층 특징 활용" },
    { f: "특징 추출기", t: "고전적인 비교 기준" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.14 – 09.15",
      role: "팀원 담당 (이미지 파트)",
      why: "회의에서 정한 비교 후보(오래된 기본형).",
      data: "백본 비교와 같은 데이터.",
      setup: "partial은 마지막 합성곱 블록(features[24:])만 학습.",
      metrics: [["PR-AUC", "0.371 (기준선 0.356과 같은 수준)"]],
      learned: "사실상 쓸모가 없다는 결론이었다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
