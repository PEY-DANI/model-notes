/* Conditional-GRU — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "gru",
  name: "Conditional-GRU",
  task: "Time-Series Forecasting",
  family: "DL",
  arch: "RNN (GRU)",
  learn: "지도학습 / 전이학습",
  year: 2014,
  oneLine: "조건 변수를 함께 받는 GRU 기반 수요 예측 모델",
  source: {
    org: "Cho 외 (GRU 원 논문)",
    paper: "Learning Phrase Representations using RNN Encoder-Decoder (EMNLP 2014)"
  },
  purpose: "게이트로 장기 의존성을 학습하는 순환 신경망. 시계열 예측에 쓴다.",
  features: ["LSTM보다 파라미터가 적고 학습이 빠르다", "외생(조건) 변수를 함께 입력하는 구조로 확장할 수 있다"],
  limits: ["긴 시퀀스에서는 어텐션 모델보다 병렬화가 어렵다"],
  lineage: [
    { id: "lstm-attn", name: "LSTM + Attention", rel: "같은 계열" },
    { id: "bilstm", name: "BiLSTM", rel: "같은 계열" }
  ],
  io: { input: "과거 N기간의 시퀀스 (수요 + 조건 변수)", output: "향후 M기간 예측값" },
  code: `import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Input((36, n_features)),   # 과거 36개월
    tf.keras.layers.GRU(64),
    tf.keras.layers.Dense(12)])                # 향후 12개월
model.compile(optimizer="adam", loss=tf.keras.losses.Huber())
model.fit(X_train, y_train, validation_data=(X_val, y_val), epochs=50)`,
  train: [
    "슬라이딩 윈도우로 (입력 시퀀스, 목표 시퀀스) 쌍 생성",
    "스케일링 (역변환용 스케일러 보관)",
    "손실함수(MSE, Huber 등)와 옵티마이저 설정",
    "검증 손실 기준 조기종료",
    "원 스케일로 역변환해 평가"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "절대 오차" },
    { k: "SMAPE", v: "비율 오차" },
    { k: "학습·검증 loss 곡선", v: "과적합 여부" }
  ],
  apps: [
    { f: "수요예측", t: "다변량 시계열" },
    { f: "센서·설비 예측", t: "시계열 회귀" },
    { f: "텍스트·음성", t: "순차 데이터 처리" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 단기 예측 DL 트랙 (운영·검증 참여, 모델 개발은 프로젝트 팀)",
      why: "MLP, FCN, LSTM, GRU, ResNet, 1D-CNN을 성능과 학습 시간으로 비교해 GRU와 1D-CNN을 채택했다(예측모델 설계서).",
      data: "서비스부품 월별 수요.",
      setup: "Conditional-GRU + Huber loss, Many-to-Many, 전이학습. 출력은 3개월 × 4구간.",
      metrics: [["후보 6종 KPI", "약 76% 안팎 (모델 간 차이 거의 없음)"]],
      learned: "모델 종류별 성능 차이가 크지 않아 추가 피처 엔지니어링이 필요하다는 결론을 설계서에 남겼다.",
      qual: null,
      env: "TensorFlow/Keras",
      links: null
    }
  ]
});
