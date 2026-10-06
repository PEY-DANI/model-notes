/* SAM 3 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "sam3",
  name: "SAM 3",
  task: "Image Segmentation",
  family: "DL",
  arch: "Transformer (프롬프트 기반 분할)",
  learn: "대규모 사전학습",
  year: 2025,
  oneLine: "'a person' 같은 문구로 같은 개념의 모든 대상을 한 번에 분할하는 Meta의 SAM 계열 모델",
  source: {
    org: "Meta (facebook/sam3)",
    paper: "SAM 3: Segment Anything with Concepts (Meta, 2025)"
  },
  purpose: "점·박스 같은 시각적 조건에 더해, 짧은 문구나 시각적 예시로 지정한 개념의 여러 대상을 이미지·영상에서 분할한다.",
  features: [
    "SAM 계열: 학습한 모델을 새 사진에 추가 학습 없이 적용한다 (zero-shot)",
    "텍스트 프롬프트로 같은 개념의 대상을 모두 찾는다 (예: 'yellow school bus'로 버스 여러 대)",
    "오픈 어휘(Open-Vocabulary): 고정된 클래스 목록에 묶이지 않고 임의의 문구를 쓴다",
    "공식 설명 기준 27만 개 고유 개념을 포함한 SA-Co 벤치마크로 평가",
    "이미지와 영상에서 탐지·분할·추적을 다룬다"
  ],
  limits: [
    "27만 개 개념을 포함한다는 것은 모든 문구를 정확히 분할한다는 뜻이 아니다. 실제 입력 문구로 결과를 확인해야 한다",
    "모든 대상을 빠짐없이 찾는다는 보장은 없다",
    "가중치(sam3.pt, 약 3.45GB)를 Hugging Face에서 직접 받아야 하고, 접근 승인과 토큰이 필요하다",
    "무겁다 (실습 GPU RTX 4070 Laptop 8GB에서 FP16으로 실행, 한 장 약 250ms)"
  ],
  lineage: [
    { id: "fastsam", name: "FastSAM", rel: "경량 대안 (후보 마스크 생성 후 선택)" },
    { id: "clip", name: "CLIP", rel: "문구와 이미지를 연결하는 비슷한 발상" },
    { id: "yolo-seg", name: "YOLO26-seg", rel: "고정 클래스 분할과 비교" }
  ],
  io: { input: "이미지 + 텍스트 문구(예: \"a person\"), 점·박스 등 시각적 조건", output: "개념에 맞는 대상별 마스크·박스·신뢰도" },
  code: `from ultralytics.models.sam import SAM3SemanticPredictor

overrides = {
    "conf": 0.25,
    "task": "segment",
    "mode": "predict",
    "model": "models/sam3.pt",
    "quantize": 16,      # FP16으로 더 빠르게
    "save": True,
}
predictor = SAM3SemanticPredictor(overrides=overrides)

predictor.set_image("images/test_image.jpg")   # 이미지는 한 번 설정하고
results = predictor(text=["a person"])          # 여러 문구로 질의 가능

result = results[0]
result.masks.data      # (대상 수, H, W) bool 마스크
result.boxes.conf      # 대상별 신뢰도`,
  trainTitle: "적용 과정",
  train: [
    "SAM3SemanticPredictor를 설정(conf, FP16)으로 만들고 이미지를 한 번 set_image",
    "predictor(text=[...])로 문구를 넣어 대상별 마스크·신뢰도 받기"
  ],
  metrics: [
    { k: "마스크 IoU", v: "정답 영역과 예측 영역의 겹침 (TP/(TP+FP+FN))" },
    { k: "마스크 AP / mAP", v: "개별 물체 분할 성능. COCO 방식은 IoU 0.5~0.95 평균" },
    { k: "신뢰도(conf)", v: "결과별 모델 점수. 정답 확률로 해석하지 않고 후보를 고르거나 비교할 때 사용" }
  ],
  apps: [
    { f: "상품 이미지 편집", t: "문구로 지정한 상품 영역 추출 → 배경 교체" },
    { f: "영상 분석", t: "문구로 지정한 대상의 탐지·분할·추적" },
    { f: "데이터 라벨링", t: "문구로 대상 마스크를 자동 생성해 라벨링 시간 단축" }
  ],
  usage: [
    {
      p: "wt-seg",
      when: "2026.10",
      role: "개인 실습",
      why: "점·박스가 아니라 문구('a person')로 같은 개념의 대상을 모두 찾는 방식을 써 보려고 했다.",
      data: "images/test_image.jpg (FastSAM과 같은 이미지)",
      setup: "Hugging Face에서 sam3.pt(3.45GB)를 다운로드. SAM3SemanticPredictor, conf 0.25, FP16(quantize 16), 문구 \"a person\".",
      metrics: [
        ["검출", "a person 6개"],
        ["추론 속도", "253.3ms (전처리 3.6ms, 후처리 29.9ms)"],
        ["입력 크기", "644×644 (최대 stride 14의 배수로 자동 조정)"]
      ],
      learned: "FastSAM이 같은 이미지에서 29개의 이름 없는 마스크를 낸 것과 달리, 문구로 원하는 대상(사람 6명)만 골라 나왔다. 대신 모델이 크고 느리다(약 250ms vs 약 110ms). 모델을 받으려면 접근 승인과 토큰이 필요했고, 라이브러리를 설치하다 torch가 다른 버전으로 새로 설치되는 문제는 pyproject.toml에서 CUDA 인덱스(cu126)를 지정해 해결했다.",
      qual: "문구 하나(\"a person\")만 시도했고, 6명이 실제 사람 수와 맞는지는 전수 확인하지 않음. 다른 문구 비교 정리 필요.",
      env: "RTX 4070 Laptop (8GB), Python 3.14, torch 2.14.1+cu126, ultralytics 8.4.171. 준비: Hugging Face에서 facebook/sam3 접근 승인 → 토큰 발급(.env) → sam3.pt 다운로드. 다른 라이브러리 설치로 torch가 덮어써지지 않도록 pyproject.toml에서 PyTorch CUDA 인덱스(cu126)를 지정하고 uv add로 재설치.",
      links: null
    }
  ]
});
