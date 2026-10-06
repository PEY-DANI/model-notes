/* 1D-CNN (재귀 예측) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "cnn1d",
  name: "1D-CNN (재귀 예측)",
  task: "Time-Series Forecasting",
  family: "DL",
  arch: "CNN",
  learn: "지도학습",
  year: null,
  oneLine: "시계열에 1차원 합성곱을 적용하고 예측값을 다시 입력으로 쓰는 장기 예측 모델",
  source: { org: "일반 기법 (LeCun 합성곱의 시계열 적용)", paper: null },
  purpose: "1차원 합성곱으로 시계열의 국소 패턴을 추출해 예측한다.",
  features: ["필터 크기로 보는 구간 길이를 조절한다", "순환 구조가 없어 학습 병렬화가 쉽다", "예측값을 다시 입력하는 재귀 예측으로 장기 예측에 쓸 수 있다"],
  limits: ["재귀 예측은 오차가 누적된다"],
  lineage: [
    { id: "lstm-attn", name: "LSTM + Attention", rel: "비교 대상" }
  ],
  io: { input: "다변량 시계열 (시점 × 피처)", output: "향후 값 또는 클래스" },
  code: `import tensorflow as tf

model = tf.keras.Sequential([
    tf.keras.layers.Input((window, n_features)),
    tf.keras.layers.Conv1D(64, kernel_size=3, activation="relu"),
    tf.keras.layers.Conv1D(64, kernel_size=3, activation="relu"),
    tf.keras.layers.GlobalAveragePooling1D(),
    tf.keras.layers.Dense(1)])
model.compile(optimizer="adam", loss="mse")`,
  train: [
    "슬라이딩 윈도우로 입력-목표 쌍 생성",
    "스케일링",
    "Conv1D 층과 풀링 층 구성 (커널 크기로 보는 구간 결정)",
    "K-fold 또는 시간순 검증",
    "재귀 예측 시 예측값을 다시 입력에 붙여 반복"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "절대 오차" },
    { k: "SMAPE", v: "비율 오차" },
    { k: "K-fold 평균 점수", v: "분할에 따른 안정성" }
  ],
  apps: [
    { f: "시계열 예측", t: "국소 패턴 중심 데이터" },
    { f: "센서 신호 분류", t: "진동·심전도" },
    { f: "텍스트 분류", t: "문자·단어 수준 합성곱" }
  ],
  usage: [
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 장기 예측 ML 트랙 (운영·검증 참여, 모델 개발은 프로젝트 팀)",
      why: "MLP, FCN, LSTM, GRU, ResNet, 1D-CNN을 성능과 학습 시간으로 비교해 GRU와 1D-CNN을 채택했다(예측모델 설계서).",
      data: "서비스부품 장기 수요.",
      setup: "1D-CNN + 재귀 예측, 5-fold CV. 장기(EOP+15~22년) 예측.",
      metrics: [["후보 6종 KPI", "약 76% 안팎 (모델 간 차이 거의 없음)"]],
      learned: "모델 종류별 성능 차이가 크지 않아 추가 피처 엔지니어링이 필요하다는 결론을 설계서에 남겼다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
