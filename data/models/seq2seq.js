/* Seq2Seq Reconstructor-Predictor — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "seq2seq",
  name: "Seq2Seq Reconstructor-Predictor",
  task: "Time-Series Forecasting",
  family: "DL",
  arch: "LSTM 인코더-디코더",
  learn: "지도학습",
  year: 2014,
  oneLine: "2층 LSTM 인코더와 이중 디코더로 복원과 예측을 동시에 학습하는 장기 예측 모델",
  source: {
    org: "Google (Sutskever 외)",
    paper: "Sequence to Sequence Learning with Neural Networks (NeurIPS 2014)"
  },
  purpose: "인코더가 입력 시퀀스를 요약하고 디코더가 출력 시퀀스를 생성하는 구조.",
  features: ["입력과 출력의 길이가 달라도 된다", "디코더를 여러 개 두는 변형(복원 + 예측 등)이 가능하다"],
  limits: ["어텐션이 없으면 긴 입력에서 정보 병목이 생긴다"],
  lineage: [
    { id: "lstm-attn", name: "LSTM + Attention", rel: "같은 계열" }
  ],
  io: { input: "입력 시퀀스 (과거 구간)", output: "출력 시퀀스 (향후 구간)" },
  code: `import tensorflow as tf
L = tf.keras.layers

enc_in = L.Input((n_in, n_features))
_, h, c = L.LSTM(64, return_state=True)(enc_in)        # 인코더: 입력을 상태로 요약
dec = L.RepeatVector(n_out)(h)
dec = L.LSTM(64, return_sequences=True)(dec, initial_state=[h, c])
out = L.TimeDistributed(L.Dense(1))(dec)               # 디코더: 출력 시퀀스 생성
model = tf.keras.Model(enc_in, out)
model.compile(optimizer="adam", loss="mse")`,
  trainTitle: "적용 과정",
  train: [
    "장기 예측 후보 모델(산학 모델)로 비교",
    "실제 운영 데이터로 예측을 수행해 파이프라인이 오류 없이 돌고 결과가 나오는지 확인",
    "결과가 의도대로인지 현업과 합의",
    "운영 반영 후 모니터링하며 확인"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "시점별 오차" },
    { k: "SMAPE", v: "비율 오차" },
    { k: "복원 오차", v: "복원 디코더를 둔 경우 입력 재구성 품질" }
  ],
  apps: [
    { f: "다단계 시계열 예측", t: "여러 시점을 한 번에 예측" },
    { f: "기계 번역", t: "원래의 용도" },
    { f: "이상 탐지", t: "복원 오차 기반" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 장기 예측 DL 트랙 (산학 모델, 운영·검증 참여)",
      why: "장기 예측 후보 모델 비교.",
      data: "서비스부품 장기 수요.",
      setup: "2-layer LSTM Encoder, Dual Decoder. 복원과 예측 손실을 MSE 0.95:0.05로 가중 합산.",
      metrics: [],
      learned: null,
      qual: null,
      env: null,
      links: null
    }
  ]
});
