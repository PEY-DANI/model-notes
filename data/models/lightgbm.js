/* LightGBM — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "lightgbm",
  name: "LightGBM",
  task: "Tabular Prediction",
  family: "ML",
  arch: "트리 부스팅",
  learn: "지도학습",
  year: 2017,
  oneLine: "작은 결정나무를 순서대로 쌓아 앞 나무의 오차를 고치는 gradient boosting 구현체",
  source: {
    org: "Microsoft",
    paper: "LightGBM: A Highly Efficient Gradient Boosting Decision Tree (NeurIPS 2017)"
  },
  purpose: "표 형태 데이터에서 빠르게 높은 성능을 낸다. 잎(leaf) 단위로 트리를 키워 학습이 빠르다.",
  features: [
    "결측값과 범주형 변수를 직접 처리한다",
    "Tweedie, Huber, Poisson 등 다양한 목적함수를 지원한다",
    "학습 속도가 빠르다",
    "feature importance로 입력의 기여를 확인할 수 있다"
  ],
  limits: [
    "소수 클래스 사례가 적으면 재현율이 낮아지기 쉽다",
    "고유값이 많은 범주형 변수는 학습에 없던 범주에서 일반화가 어렵다",
    "이미지·텍스트 같은 비정형 입력은 별도 임베딩이 필요하다"
  ],
  lineage: [
    { id: "xgboost", name: "XGBoost", rel: "같은 계열" },
    { id: "catboost", name: "CatBoost", rel: "같은 계열" },
    { name: "Gradient Boosting (Friedman 2001)", rel: "원형 알고리즘" }
  ],
  io: { input: "표 형태 데이터 (행: 샘플, 열: 수치형·범주형 피처)", output: "회귀는 예측값, 분류는 클래스별 확률" },
  code: `import lightgbm as lgb

train = lgb.Dataset(X_train, y_train, categorical_feature=cat_cols)
valid = lgb.Dataset(X_valid, y_valid, reference=train)

params = {"objective": "multiclass", "num_class": 4,
          "learning_rate": 0.05, "num_leaves": 31}
model = lgb.train(params, train, num_boost_round=5000, valid_sets=[valid],
                  callbacks=[lgb.early_stopping(200)])

proba = model.predict(X_test)   # (샘플 수, 클래스 수)`,
  train: [
    "피처 설계, 결측·범주형 처리",
    "시간순 또는 층화 기준으로 train / valid / test 분할",
    "목적함수(objective)와 learning_rate, num_leaves 등 설정",
    "검증 점수가 더 오르지 않으면 멈추는 조기종료(early stopping)",
    "필요하면 train + valid로 반복 수를 맞춰 재학습한 뒤 test로 평가"
  ],
  metrics: [
    { k: "MAE / RMSE", v: "회귀의 평균 오차" },
    { k: "정확도 / macro F1", v: "분류 성능. macro F1은 클래스별 F1의 평균이라 드문 클래스도 같은 비중" },
    { k: "AUC / PR-AUC", v: "양성이 드문 이진 분류에서 순위 성능" },
    { k: "재현율 / 정밀도", v: "특정 클래스를 얼마나 놓치지 않고, 얼마나 정확히 찾는가" }
  ],
  apps: [
    { f: "수요예측", t: "품목별 수요량 예측 (Tweedie 손실로 0이 많은 수요 처리)" },
    { f: "마케팅", t: "이탈 예측, 구매 확률" },
    { f: "금융", t: "신용평가, 사기 탐지" },
    { f: "검색·추천", t: "랭킹 학습(LambdaRank)" }
  ],
  usage: [
    {
      p: "wt-team",
      when: "2026.09.15 – 09.29",
      role: "정형 파트 담당: 데이터마트, 피처 27개, 모델 실험",
      why: "표 데이터의 표준 모델이고 결측·범주형을 그대로 넣을 수 있다. 팀의 기준선(baseline)으로 삼았다.",
      data: "무신사 신상품. 초기 마트 10,000개(1y 5,000 + 2y 5,000), 최종 발표 기준 18,266개 수집(히트 상품은 층화 추출로 보강). 라벨은 등록 후 12주 리뷰 수를 4구간으로 나눈 것: 0건 72.8%, 1~4건 16.5%, 5~29건 8.4%, 30건 이상 2.4%.",
      setup: "피처 27개(카테고리, 시즌, 가격, 소재, 브랜드 리뷰 이력, 브랜드 마스터). learning_rate 0.05, num_leaves 31, subsample 0.8, colsample 0.8. 조기종료 200회, 드문 구간에 더 큰 가중치를 주는 balanced 가중치. 평가는 2025-05부터 2개월씩 7블록 시간순 CV.",
      metrics: [
        ["macro F1", "0.428"],
        ["30+ 재현율", "0.400"],
        ["30+ 정밀도", "0.225"],
        ["정확도", "0.635"],
        ["후속 기준 모델 순위 ρ", "0.479"],
        ["신규 상품 1,541개 ρ", "0.465"]
      ],
      learned: "무작위 층화 분할의 점수(0.481)는 미래 예측 성능이 아니고, 시간순 CV(0.428)가 실제에 가깝다. 정확도는 전부 0건으로 답해도 0.725라 주 지표에서 뺐다. 모델 종류보다 데이터(라벨의 우연성, 30+ 사례 부족)가 상한을 정했다. 브랜드 마스터 4개는 2026-09 수집값이라 시점 누수 한계가 있어 문서와 발표에 명시했다. 팀 비교 실험에서 브랜드 이름을 범주로 넣으면 시간순 평가에서 오히려 역효과였다(macro F1 0.408). 시험 시기의 브랜드 다수가 학습에 없었기 때문이다.",
      qual: "같은 브랜드의 이전 상품 이력이 없는 상품은 30+ 재현율 0.25(이력 있으면 0.44). 30+ 사례가 거의 상의에만 있어 다른 대분류에서는 못 맞힌다(원피스·스커트는 30+가 0개).",
      env: "Python 3.12.13, LightGBM 4.7.0, scikit-learn 1.9.1, Windows 11, Intel Core Ultra 9 185H. 실험 수행 시간 로그 보관.",
      links: null
    },
    {
      p: "mobis-ngios",
      when: "2022 – 2025",
      role: "nGIOS 단기 예측 ML 트랙 (운영·검증 참여, 모델 개발은 프로젝트 팀)",
      why: "수요가 0에 몰리고 꼬리가 긴 부품 수요에 Tweedie 손실이 맞는다. CatBoost와 KPI가 비슷했지만 학습 소요 시간이 LightGBM이 훨씬 짧아 LightGBM 중심으로 모델을 구축했다(예측모델 설계서).",
      data: "서비스부품 월별 수요. 36개월 학습으로 12개월 예측.",
      setup: "LightGBM + Tweedie loss. 재귀 예측(모델 1개)과 다중 예측(모델 12개) 중 학습·예측 시간과 KPI를 함께 보고 다중 예측 채택. demand lagging(window 36개월 × 24개). 부품별 과거 12개월 MAE가 가장 작은 모델을 자동 선택.",
      metrics: [["시스템 통합 KPI", "81.3%"], ["내수", "84.1%"], ["수출", "77.6%"]],
      learned: "XGBoost, CatBoost, LightGBM을 KPI와 학습 시간으로 함께 비교하고, 성능이 비슷하면 학습 시간으로 가르는 기준을 세웠다.",
      qual: null,
      env: "PySpark, Airflow, MLflow, Hadoop(HDP), Delta Lake → Iceberg",
      links: null
    }
  ]
});
