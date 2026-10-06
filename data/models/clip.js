/* CLIP — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "clip",
  name: "CLIP",
  task: "Image Classification",
  family: "DL",
  arch: "ViT-B/16 (이미지-텍스트)",
  learn: "대조학습 사전학습",
  year: 2021,
  oneLine: "글과 그림을 짝지어 배운 이미지-텍스트 임베딩 모델",
  source: {
    org: "OpenAI (Radford 외)",
    paper: "Learning Transferable Visual Models From Natural Language Supervision (ICML 2021)"
  },
  purpose: "스타일·분위기 같은 의미 개념을 담은 임베딩을 만든다.",
  features: ["4억 쌍으로 학습", "512차원 벡터"],
  limits: ["일반 웹 이미지로 학습해 도메인 특화 이미지에서는 미세조정이 필요할 수 있다"],
  lineage: [
    { id: "dinov3", name: "DINOv3", rel: "비교한 임베딩" },
    { id: "transformer", name: "Transformer", rel: "기반 구조" }
  ],
  io: { input: "이미지, 그리고 텍스트(프롬프트)", output: "이미지 임베딩과 텍스트 임베딩 (같은 공간, 512차원)" },
  code: `import torch
from transformers import CLIPModel, CLIPProcessor

name = "openai/clip-vit-base-patch16"
model = CLIPModel.from_pretrained(name).eval()
proc = CLIPProcessor.from_pretrained(name)

inputs = proc(text=["a black hoodie", "a floral dress"], images=img,
              return_tensors="pt", padding=True)
with torch.no_grad():
    out = model(**inputs)
probs = out.logits_per_image.softmax(dim=1)   # 이미지-텍스트 유사도 기반 분류`,
  trainTitle: "적용 과정",
  train: [
    "사전학습된 CLIP 불러오기 (4억 이미지-텍스트 쌍으로 학습됨)",
    "이미지를 전처리해 임베딩 추출 (백본은 얼린 상태)",
    "임베딩을 MLP 입력으로 쓰거나 정형 피처와 결합해 비교"
  ],
  metrics: [
    { k: "zero-shot 정확도", v: "학습 없이 프롬프트만으로 낸 분류 성능" },
    { k: "linear probe 정확도", v: "얼린 임베딩 위 선형 분류" },
    { k: "Recall@K", v: "이미지-텍스트 검색 성능" }
  ],
  apps: [
    { f: "zero-shot 분류", t: "라벨 없이 프롬프트로 분류" },
    { f: "이미지-텍스트 검색", t: "텍스트로 이미지 찾기" },
    { f: "생성 모델의 조건 인코더", t: "텍스트-이미지 생성" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.17",
      role: "팀원 담당 (사진·딥러닝 결합 실험, 팀 비교표에 함께 수록)",
      why: "DINOv3가 '어떤 옷인가'만 담는다면 스타일 개념을 담은 임베딩이 더 나을지 확인하려고 넣었다.",
      data: "사진 임베딩 9,563개(512차원).",
      setup: "얼린 상태로 임베딩만 추출. 사진만, 열 붙이기, 확률 섞기, 신경망 결합 4가지로 비교.",
      metrics: [
        ["사진만 MLP macro F1", "0.323"],
        ["열 붙이기", "0.412"],
        ["확률 섞기", "0.428"],
        ["신경망 결합 F5", "0.408"]
      ],
      learned: "어떤 방식으로 붙여도 정형 단독(0.44)을 넘지 못했다. 사진의 역할은 예측 점수가 아니라 비슷한 상품 근거 제시로 정리했다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
