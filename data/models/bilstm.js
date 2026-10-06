/* BiLSTM (연구팀 모델) — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "bilstm",
  name: "BiLSTM (연구팀 모델)",
  task: "Time-Series Forecasting",
  family: "DL",
  arch: "RNN (양방향 LSTM)",
  learn: "지도학습",
  year: 1997,
  oneLine: "과거와 미래 방향을 함께 읽는 양방향 LSTM",
  source: { org: "Schuster & Paliwal (1997)", paper: "Bidirectional recurrent neural networks" },
  purpose: "순방향과 역방향으로 시퀀스를 읽어 앞뒤 문맥을 함께 반영하는 LSTM.",
  features: ["두 방향의 은닉 상태를 결합한다"],
  limits: ["순차 처리라 병렬화가 어렵다", "미래 시점을 예측할 때는 역방향에 미래 정보가 들어가지 않도록 입력 설계에 주의해야 한다"],
  lineage: [
    { id: "lstm-attn", name: "LSTM + Attention", rel: "같은 계열" },
    { id: "transformer", name: "Transformer", rel: "다른 시퀀스 모델" }
  ],
  io: { input: "과거 시퀀스 (다변량)", output: "향후 값 또는 시퀀스 라벨" },
  code: `import tensorflow as tf
L = tf.keras.layers

model = tf.keras.Sequential([
    L.Input((n_steps, n_features)),
    L.Bidirectional(L.LSTM(64)),     # 순방향 + 역방향 은닉 상태 결합
    L.Dense(n_out)])
model.compile(optimizer="adam", loss="mse")`,
  trainTitle: "적용 과정",
  train: [
    "연구팀 모델(Python)을 PySpark·Airflow 운영 구조로 변환 (회사×창고 20개 병렬화, 데이터 균등 분할)",
    "전처리~후보정 4단계마다 원본과 변환 결과를 대조해 환경 차이(Python → PySpark)로 함수 결과가 달라지는 곳이 없는지 확인",
    "실제 운영 데이터로 3개월~1년치 예측을 수행해 파이프라인이 오류 없이 돌고 결과가 나오는지 실험",
    "결과가 의도대로인지 현업과 합의",
    "운영 반영 후 모니터링하며 확인"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "절대 오차" },
    { k: "SMAPE", v: "비율 오차" },
    { k: "학습·검증 곡선", v: "과적합 여부" }
  ],
  apps: [
    { f: "시계열 예측", t: "다변량 시퀀스" },
    { f: "자연어 처리", t: "개체명 인식, 품사 태깅" },
    { f: "음성 인식", t: "과거·미래 문맥 활용" }
  ],
  usage: [
    {
      p: "mobis-transfer",
      when: "2024.08 – 2024.09",
      role: "운영 이관과 검증 (모델 개발은 연구팀)",
      why: "연구팀 모델은 창고 1개 기준으로만 검증돼 있었고 PySpark·Airflow 운영 환경과 달랐다.",
      data: "인도 법인 창고별 수요.",
      setup: "전처리~후보정 4단계마다 원본과 변환 결과를 대조해 재현성 검증. 회사×창고 조합 20개 병렬화, 데이터 균등 분할로 수행 구조 재설계.",
      metrics: [["수행 시간", "9~9.5시간 (배치 윈도우 12시간)"], ["반영", "2024.09, 연구팀 모델의 첫 운영 반영"]],
      learned: "결측 보간 오류 등 원본 로직 결함을 운영 반영 전에 찾아 수정했다.",
      qual: null,
      env: "PySpark, Airflow",
      links: null
    }
  ]
});
