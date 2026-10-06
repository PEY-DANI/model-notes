/* 프로젝트 목록. ctx: co(Career) / wt(Bootcamp) / gr(Education)
   org · team · period 가 프로젝트 카드 맨 윗줄에 "소속 · 개인/팀 N명 · 기간"으로 표시됩니다.
   team 이 null 이면 "작성 필요"로 표시됩니다. */
const PROJECTS = [
  {
    id: "mobis-ngios",
    ctx: "co",
    name: "현대모비스 서비스부품 글로벌 수요예측 시스템 (nGIOS)",
    org: "디에스이트레이드",
    period: "2022.03 – 2025.11",
    team: null,
    summary: "서비스부품 글로벌 수요예측 시스템의 예측 인자 발굴, 모델·로직 변경 검증, 데이터레이크 기반 예측 파이프라인 구축·운영. 단기·장기 예측을 시계열, ML, DL 3개 트랙으로 구성하고 품목별로 모델을 선정했다. 내수 예측 정확도 KPI 80% 달성에 기여했고, 시스템 전환 후 정확도 81.3%(내수 84.1%, 수출 77.6%)를 유지했다. 정확도 = 100 − SMAPE/2."
  },
  {
    id: "mobis-weather",
    ctx: "co",
    name: "기상 기반 후보정 복원·확장",
    org: "디에스이트레이드",
    period: "2024.07 – 2024.09",
    team: null,
    summary: "차세대 전환 때 누락된 기상 후보정 로직을 복원하고, 앞단 기상 예측 모델부터 개선했다. 법인 단위 보정을 창고 단위로 확장해 2,646개 부품 정확도를 가중평균 2.6%p(최대 5.78%p) 개선했다."
  },
  {
    id: "mobis-dealer",
    ctx: "co",
    name: "대리점 실수요 분석 및 재고 지표 도출",
    org: "디에스이트레이드",
    period: "2022",
    team: null,
    summary: "대리점 실수요·재고 데이터 207만 건에서 후보 변수 48개를 17개로 선별하고, 재고 지표를 본사 단기 모델의 입력 변수로 운영 반영했다."
  },
  {
    id: "mobis-transfer",
    ctx: "co",
    name: "연구팀 모델 운영 적용과 인수 기준 수립",
    org: "디에스이트레이드",
    period: "2024.08 – 2025",
    team: null,
    summary: "연구팀 모델을 PySpark·Airflow 운영 배치에 맞게 재설계해 첫 운영 반영을 만들고, 실측 기반 인수 기준으로 후속 모델의 설계를 바꿨다."
  },
  {
    id: "mirae-essay",
    ctx: "co",
    name: "자기소개서 평가 모델 개발",
    org: "미래기술",
    period: "2018.10 – 2019.01",
    team: null,
    summary: "협업 능력 항목의 평가 기준을 0·1·2점 클래스로 정량화해 훈련 데이터를 만들고 모델화했다. 인사 담당자 채점과 97% 이상 일치했고, 서류 평가 시간을 건당 3~5분에서 3초로 줄였다."
  },
  {
    id: "mirae-agri",
    ctx: "co",
    name: "농산물 유통 종합정보시스템 고도화",
    org: "미래기술",
    period: "2020.07 – 2021.02",
    team: null,
    summary: "6개 유통 플랫폼 데이터의 자동 수집·적재 파이프라인과 사전 기반 검색 시스템, 대시보드를 구축했다."
  },
  {
    id: "grad-gif",
    ctx: "gr",
    name: "G.I.F — Modular RAG 기반 기프티콘 이미지 검색 (Gifticon Image Finder)",
    org: "연세대 공학대학원",
    period: "2024.09 – 2024.12",
    team: "팀 4명",
    summary: "기프티콘 이미지를 읽어 검색하는 Modular RAG. 모듈 수 × 메트릭 수에 비례하는 평가 비용을 줄이기 위해 메트릭을 선별하고 모듈 단계별 고정 실험으로 최적 조합을 확정했다. 의미 유사도 0.85 → 0.88. AutoRAG로 평가를 자동화해 실험 시간을 12시간에서 15분으로 줄였다."
  },
  {
    id: "grad-memrag",
    ctx: "gr",
    name: "Memory-Aware GraphRAG",
    org: "연세대 공학대학원",
    period: "2026 (진행 중)",
    team: "개인",
    summary: "단일 PostgreSQL에 pgvector(벡터 검색)와 Apache AGE(그래프 질의)를 통합해, 저장소 분리에 따른 동기화 부담을 없앤 에이전트 장기 메모리 인프라를 설계했다."
  },
  {
    id: "wt-team",
    ctx: "wt",
    name: "패션 신상품 수요예측: 무신사 12주 리뷰 수 4구간 예측",
    org: "원티드 포텐업",
    period: "2026.09",
    team: "팀 2명",
    summary: "출시 전 정보만으로 등록 후 12주 동안 달리는 리뷰 수를 0 / 1~4 / 5~29 / 30+ 네 구간으로 예측한다. 무신사 상품 18,266개와 리뷰 약 14만 건을 직접 수집했다. 정형 트리 모델, 표 데이터 딥러닝, 사진 임베딩 결합까지 모델 16개를 같은 데이터와 평가 방식으로 비교했다."
  },
  {
    id: "wt-intel",
    ctx: "wt",
    name: "Wanted AI Agent Vision 분류대회 (Intel Image 6클래스)",
    org: "원티드 포텐업",
    period: "2026.09",
    team: "개인",
    summary: "buildings, forest, glacier, mountain, sea, street 6클래스 분류. 평가지표는 Accuracy. 사전학습 백본 3계열을 PyTorch Lightning으로 파인튜닝하고 TTA와 앙상블을 비교했다."
  },
  {
    id: "wt-yolo",
    ctx: "wt",
    name: "Object Detection 실습 (YOLO)",
    org: "원티드 포텐업",
    period: "2026.10",
    team: "개인",
    summary: "Roboflow로 직접 라벨링한 고양이/개 데이터셋으로 YOLO 사전학습 모델을 미세조정했다."
  },
  {
    id: "wt-seg",
    ctx: "wt",
    name: "Segmentation 실습 (YOLO26-seg · FastSAM · SAM 3)",
    org: "원티드 포텐업",
    period: "2026.10",
    team: "개인",
    summary: "사전학습 분할 모델 3종을 같은 방식(예측 → 마스크 추출 → 원본에 적용)으로 돌려 보고, 고정 클래스(YOLO26-seg), 후보 마스크 후 선택(FastSAM), 문구로 지정(SAM 3) 방식의 차이와 속도를 비교했다."
  }
];
