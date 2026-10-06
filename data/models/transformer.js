/* Transformer — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "transformer",
  name: "Transformer",
  task: "Time-Series Forecasting",
  family: "DL",
  arch: "Attention 기반",
  learn: "지도학습",
  year: 2017,
  oneLine: "어텐션만으로 시퀀스를 처리하는 모델 구조",
  source: { org: "Google (Vaswani 외)", paper: "Attention Is All You Need (NeurIPS 2017)" },
  purpose: "시퀀스의 모든 위치 간 관계를 어텐션으로 직접 계산해 긴 문맥을 처리한다.",
  features: ["병렬 처리", "긴 문맥 처리"],
  limits: ["연산량이 시퀀스 길이의 제곱으로 늘어난다"],
  lineage: [
    { id: "bilstm", name: "BiLSTM", rel: "다른 시퀀스 모델" },
    { id: "dinov3", name: "DINOv3", rel: "파생 (ViT)" },
    { id: "tabpfn", name: "TabPFN", rel: "파생" },
    { id: "swin", name: "Swin Transformer", rel: "파생" },
    { id: "segformer", name: "SegFormer", rel: "파생" },
    { id: "clip", name: "CLIP", rel: "파생" }
  ],
  io: { input: "토큰 또는 시점 임베딩 시퀀스", output: "시퀀스의 각 위치별 표현 (분류·예측·생성에 사용)" },
  code: `import torch.nn as nn

layer = nn.TransformerEncoderLayer(d_model=128, nhead=8, batch_first=True)
encoder = nn.TransformerEncoder(layer, num_layers=4)

# x: (배치, 길이, 128) + 위치 인코딩
h = encoder(x)                  # 모든 위치 간 self-attention
y = head(h.mean(dim=1))         # 풀링 후 예측 헤드`,
  train: [
    "입력을 임베딩하고 위치 정보를 더함",
    "인코더(필요하면 디코더) 층 구성",
    "손실 설계 (예: 시계열 예측은 MSE, 언어 모델은 교차 엔트로피)",
    "warmup과 학습률 스케줄로 학습",
    "추론 시간·메모리까지 함께 측정"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "시계열 예측 오차" },
    { k: "정확도 / perplexity", v: "분류·언어 모델 성능" },
    { k: "추론 시간 / 메모리", v: "운영 가능성" }
  ],
  apps: [
    { f: "자연어 처리", t: "번역, 요약, LLM" },
    { f: "컴퓨터 비전", t: "ViT 계열" },
    { f: "시계열 예측", t: "장기 의존성 처리" }
  ],
  usage: [
    {
      p: "mobis-transfer",
      when: "2024.08 – 2025",
      role: "인수 가능성 실측과 운영 요구사항 표준 제공 (모델 개발은 연구팀)",
      why: "인수 판정 기준이 없었다. 전체 수행 전에 최소 단위를 먼저 실측하는 방식을 도입했다.",
      data: "유럽 법인 데이터.",
      setup: "최소 단위 수행 시간을 실측해 전체 수행 시간을 추정. 데이터 처리·품질 관리·운영 3개 영역의 요구사항 표준과 실측치를 연구팀에 제공.",
      metrics: [["추정 수행 시간", "30시간 초과 (배치 윈도우의 2.5배)"], ["판정", "인수 불가"]],
      learned: "요구사항을 반영해 재설계(ReLU 음수 보정, Custom Loss)된 모델이 2025년 말 전체 법인에 운영 반영됐다.",
      qual: null,
      env: "PySpark, Airflow",
      links: null
    }
  ]
});
