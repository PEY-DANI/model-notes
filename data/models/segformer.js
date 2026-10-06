/* SegFormer-B2 (의류 분할) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "segformer",
  name: "SegFormer-B2 (의류 분할)",
  task: "Image Segmentation",
  family: "DL",
  arch: "Transformer (분할)",
  learn: "지도 사전학습",
  year: 2021,
  oneLine: "사람 사진에서 옷 픽셀을 클래스별로 분할하는 모델 (ATR 18클래스)",
  source: {
    org: "NVIDIA (원 논문), mattmdjaga/segformer_b2_clothes (공개 모델)",
    paper: "SegFormer: Simple and Efficient Design for Semantic Segmentation with Transformers (NeurIPS 2021)"
  },
  purpose: "이미지의 각 픽셀을 클래스로 분류하는 시맨틱 분할 모델. 의류 분할 가중치(ATR 18클래스)가 공개되어 있다.",
  features: ["계층적 Transformer 인코더와 가벼운 MLP 디코더로 구성된다", "위치 임베딩이 없어 입력 해상도 변화에 비교적 강하다"],
  limits: ["학습 분포 밖의 이미지(사람이 없는 제품 컷 등)에서는 성능이 떨어질 수 있다"],
  lineage: [
    { id: "transformer", name: "Transformer", rel: "기반 구조" }
  ],
  io: { input: "이미지 (RGB)", output: "픽셀별 클래스 확률 (분할 마스크, 해상도는 입력의 1/4)" },
  code: `import torch
from transformers import SegformerImageProcessor, AutoModelForSemanticSegmentation

name = "mattmdjaga/segformer_b2_clothes"
proc = SegformerImageProcessor.from_pretrained(name)
model = AutoModelForSemanticSegmentation.from_pretrained(name).eval()

inputs = proc(images=img, return_tensors="pt")
with torch.no_grad():
    logits = model(**inputs).logits                      # (1, 클래스 수, H/4, W/4)
up = torch.nn.functional.interpolate(
    logits, size=img.size[::-1], mode="bilinear")        # 원본 크기로 복원
mask = up.argmax(dim=1)[0]                               # 픽셀별 클래스`,
  trainTitle: "적용 과정",
  train: [
    "공개된 의류 분할 가중치(segformer_b2_clothes) 불러오기",
    "이미지를 전처리해 클래스별 확률(logits) 얻기",
    "원본 크기로 복원한 뒤 픽셀별 argmax로 마스크 만들기",
    "상품 카테고리에 맞는 클래스만 남기고 작은 조각 제거"
  ],
  metrics: [
    { k: "mIoU", v: "클래스별 IoU의 평균. 분할의 대표 지표" },
    { k: "픽셀 정확도", v: "맞게 분류한 픽셀의 비율" },
    { k: "클래스별 IoU", v: "클래스별 분할 품질" }
  ],
  apps: [
    { f: "의류·패션", t: "착장 사진에서 옷 영역 추출" },
    { f: "자율주행", t: "도로·차선·보행자 분할" },
    { f: "의료 영상", t: "장기·병변 분할" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.14",
      role: "팀원 담당 (이미지 파트): 전처리",
      why: "대표 이미지 71%가 모델 착장 컷이라 사진에 사람·배경·다른 옷이 섞여 '이 사진'의 특징이 들어간다. 옷만 남긴 버전을 따로 만들어 비교하려고 했다.",
      data: "이미지 38,351장(1회차 21,240 + 2회차 17,111).",
      setup: "사람 픽셀 1% 미만이면 원본 복사(copy), 사람이 있으면 분할(segment), 옷이 안 잡히면 원본 복사 + 표시(fallback). 20개로 먼저 눈으로 확인한 뒤 전량 처리. 상품 카테고리에 따라 남길 클래스를 정하고(상의·아우터는 upper-clothes 등), 가장 큰 덩어리의 25% 미만 조각은 버렸다.",
      metrics: [
        ["copy", "37~38%"],
        ["segment", "62~63%"],
        ["fallback", "29장"],
        ["처리 시간", "19분 + 16분 (RTX 4070)"]
      ],
      learned: "20개를 먼저 돌려 보고 사람이 없는 제품 컷에서 분할기가 틀린다는 걸 발견해 기준을 '사람이 있는가' 하나로 정했다. 옷만 남긴 사진은 카테고리 인식에서는 더 좋았고 판매 예측에서는 더 낮았다.",
      qual: "옷 클래스를 대체한 1,295장(3.4%)은 카테고리와 다른 클래스를 남긴 것. 긴 셔츠를 dress로 본 경우가 대부분이지만 전수 확인은 하지 않았다. 가방이 옷을 가리면 가방 일부가, 목걸이·넥타이·벨트처럼 옷 위에 걸친 것은 그대로 남는다.",
      env: "RTX 4070",
      links: null
    }
  ]
});
