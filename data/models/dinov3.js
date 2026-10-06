/* DINOv3 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "dinov3",
  name: "DINOv3",
  task: "Image Classification",
  family: "DL",
  arch: "ViT-B/16",
  learn: "자기지도 사전학습 + 파인튜닝",
  year: 2025,
  oneLine: "라벨 없이 대규모 이미지로 스스로 학습한 범용 비전 백본",
  source: { org: "Meta AI", paper: "DINOv3 (2025), 전신: DINOv2 (Oquab 외, 2023)" },
  purpose: "이미지를 벡터(임베딩)로 바꿔 분류, 유사 이미지 검색, 전이학습의 백본으로 쓴다.",
  features: ["17억 장으로 자기지도 학습한 범용 특징", "얼려서 쓰거나 일부만 풀어 파인튜닝할 수 있다", "패치 토큰 평균으로 임베딩을 만든다"],
  limits: ["공개 가중치가 gated라 접근 동의가 필요하다", "자기지도 특징은 도메인 라벨 정보를 직접 담지 않아, 목적에 맞는 헤드나 파인튜닝이 필요하다"],
  lineage: [
    { id: "resnet", name: "ResNet", rel: "비교한 CNN" },
    { id: "vgg16", name: "VGG16", rel: "비교한 CNN" },
    { id: "clip", name: "CLIP", rel: "비교한 임베딩" },
    { id: "transformer", name: "Transformer", rel: "기반 구조 (ViT)" }
  ],
  io: { input: "이미지 (RGB)", output: "토큰별 특징 벡터. 평균하면 이미지 임베딩(768차원)" },
  code: `import torch
from transformers import AutoImageProcessor, AutoModel

name = "facebook/dinov3-vitb16-pretrain-lvd1689m"
proc = AutoImageProcessor.from_pretrained(name)
model = AutoModel.from_pretrained(name).eval()

inputs = proc(images=img, return_tensors="pt")
with torch.no_grad():
    tokens = model(**inputs).last_hidden_state   # (1, 토큰 수, 768)
embedding = tokens.mean(dim=1)                   # 토큰 평균 = 이미지 임베딩`,
  train: [
    "사전학습 가중치 불러오기 (접근 동의가 필요한 gated 모델)",
    "백본을 얼리고 임베딩만 추출 (frozen)",
    "임베딩 위에 선형 층 또는 작은 MLP 헤드 학습",
    "필요하면 마지막 블록만 풀어 파인튜닝 (낮은 학습률)",
    "분류 정확도, 이웃 검색 일치율 등으로 평가"
  ],
  metrics: [
    { k: "Top-1 / Top-5 정확도", v: "분류 성능" },
    { k: "kNN 일치율", v: "임베딩 공간에서 가까운 이웃이 같은 클래스인 비율" },
    { k: "linear probe 정확도", v: "얼린 임베딩 위 선형 분류 성능" }
  ],
  apps: [
    { f: "유사 이미지 검색", t: "임베딩 거리로 이웃 찾기" },
    { f: "분류의 백본", t: "전이학습" },
    { f: "분할·깊이 추정", t: "dense feature 활용" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.14 – 09.15",
      role: "팀원 담당 (이미지 파트): 백본 비교",
      why: "09-14 회의에서 VGG16, ResNet50, DINOv3를 같은 조건으로 비교하기로 정했다.",
      data: "상품 10,000개, 대표 이미지 1장. 라벨은 누적 판매 50개 넘김(양성 약 20%). 등록일 순 64/16/20% 시간 분할.",
      setup: "백본 3 × 사진 2(원본/옷만) × seed 2 × 학습 방식 3(frozen/head/partial) = 36가지. AdamW, 백본 lr 1e-5, 조기종료.",
      metrics: [
        ["PR-AUC frozen", "0.471"],
        ["partial", "0.477~0.480"],
        ["ResNet50", "0.427"],
        ["VGG16", "0.371"],
        ["정형만(B1)", "0.544"]
      ],
      learned: "DINOv3만 모든 구간에서 기준선을 넘었다. 사진은 '어떤 옷인가'는 담지만 '얼마나 팔리나'는 거의 담지 못했다(이미지만으로 로그 판매량 회귀는 어느 백본도 기준선을 넘지 못함). 파인튜닝 효과는 +0.01~0.02로 작았다. 이미지를 정형 옆에 그냥 붙이면 정형만보다 나빠졌다(검증 0.696 → 0.606).",
      qual: null,
      env: "서버 GPU, 12묶음 합계 약 70분",
      links: null
    },
    {
      p: "wt-team",
      when: "2026.09.15",
      role: "팀원 담당 (이미지 파트): 카테고리 모델 garment_full",
      why: "판매 예측은 포기하고 사진에서 '무슨 옷인가'를 맞히는 모델을 만들어 데모의 카테고리 판별과 유사 상품 검색에 쓰려고 했다.",
      data: "사진 35,301장(원본·옷만 같은 장수), 상품 9,793개, 세부 카테고리 45종. 상품 단위 80/10/10 분할.",
      setup: "DINOv3 ViT-B/16 + Linear(768→45). AdamW, weight decay 0.05, lr 헤드 1e-3 / 백본 1e-5, label smoothing 0.1, 혼합 정밀도, batch 32, 조기종료.",
      metrics: [
        ["상품 단위 정확도 (45종)", "68%"],
        ["top-5 안에 정답", "94%"],
        ["17묶음 정확도", "85%"],
        ["이웃 5개 일치율", "0.45 → 0.65"]
      ],
      learned: "옷만 남긴 가공 사진이 원본보다 일관되게 +0.02~0.04 좋았다. 틀리는 건 대부분 길이 구분(미디/맥시/미니 원피스, 숏/경량 패딩)이라 사진보다 카테고리 정의의 문제였다.",
      qual: "오분류 상위는 길이 구분(미디·맥시·미니, 미디·롱 스커트, 숏·경량 패딩). 옷 종류 자체는 잘 본다.",
      env: "RTX 서버 GPU",
      links: null
    }
  ]
});
