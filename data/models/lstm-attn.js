/* LSTM + Attention — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "lstm-attn",
  name: "LSTM + Attention",
  task: "Time-Series Forecasting",
  family: "DL",
  arch: "RNN (LSTM) + Attention",
  learn: "지도학습",
  year: 2014,
  oneLine: "KPI를 직접 학습하는 사용자 정의 손실을 쓴 LSTM + Attention 모델",
  source: {
    org: "LSTM: Hochreiter & Schmidhuber (1997), Attention: Bahdanau 외 (2014)",
    paper: "Neural Machine Translation by Jointly Learning to Align and Translate"
  },
  purpose: "LSTM 위에 어텐션을 얹어 예측에 중요한 시점에 더 큰 가중치를 준다.",
  features: ["어텐션으로 시점별 중요도를 확인할 수 있다", "목적에 맞는 사용자 정의 손실(Custom Loss)을 쓸 수 있다"],
  limits: ["시퀀스가 길어지면 학습 비용이 커진다"],
  lineage: [
    { id: "gru", name: "Conditional-GRU", rel: "같은 계열" },
    { id: "bilstm", name: "BiLSTM", rel: "같은 계열" }
  ],
  io: { input: "과거 N기간의 시퀀스", output: "향후 값 (사용자 정의 손실로 학습 가능)" },
  code: `import tensorflow as tf
L = tf.keras.layers

x_in = L.Input((n_steps, n_features))
h = L.LSTM(64, return_sequences=True)(x_in)
ctx = L.Attention()([h, h])                  # self-attention으로 시점별 가중
out = L.Dense(1, activation="relu")(L.GlobalAveragePooling1D()(ctx))  # 음수 예측 차단
model = tf.keras.Model(x_in, out)
model.compile(optimizer="adam", loss=custom_loss)   # 목적 지표에 맞춘 손실`,
  train: [
    "윈도우 시퀀스 생성과 스케일링",
    "LSTM 위에 어텐션 층 구성",
    "평가 지표에 맞는 사용자 정의 손실 설계",
    "검증 손실 기준 조기종료",
    "어텐션 가중치로 중요한 시점을 해석"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "절대 오차" },
    { k: "SMAPE 기반 KPI", v: "업무 지표에 맞춘 정확도" },
    { k: "어텐션 가중치", v: "모델이 주목한 시점" }
  ],
  apps: [
    { f: "수요예측", t: "중요한 과거 시점이 있는 시계열" },
    { f: "문서 분류·번역", t: "어텐션의 원래 용도" },
    { f: "설비 예측", t: "이상 징후 시점 파악" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "직접 작성한 코드 (lstm_attention_customloss, 479줄)",
      why: "운영 KPI와 학습 손실을 일치시키고, 음수 예측을 구조적으로 막으려 했다.",
      data: "서비스부품 수요.",
      setup: "LSTM + Attention + Custom Loss, 클러스터별 학습. KPI를 학습하는 Custom Loss와 ReLU로 음수 예측을 막는 구조.",
      metrics: [],
      learned: null,
      qual: null,
      env: "TensorFlow/Keras",
      links: null
    }
  ]
});
