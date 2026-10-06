/* YOLO — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "yolo",
  name: "YOLO",
  task: "Object Detection",
  family: "DL",
  arch: "CNN (one-stage)",
  learn: "사전학습 + 파인튜닝",
  year: 2016,
  oneLine: "이미지에서 여러 객체를 위치와 함께 한 번에 찾는 실시간 탐지 모델",
  source: {
    org: "Joseph Redmon 외 (원 논문), Ultralytics (현재 유지보수)",
    paper: "You Only Look Once: Unified, Real-Time Object Detection (CVPR 2016)"
  },
  purpose: "이미지 한 장을 한 번만 신경망에 통과시켜 객체의 위치(박스)와 종류를 동시에 예측한다.",
  features: [
    "one-stage 구조라 속도가 빠르다",
    "COCO 사전학습 가중치(예: yolo26n.pt)를 바로 쓸 수 있다",
    "ultralytics 라이브러리 한 줄로 예측·학습·평가",
    "n/s/m/l/x 크기 선택"
  ],
  limits: [
    "작은 객체, 겹친 객체에 약하다",
    "학습한 클래스 밖은 못 찾는다",
    "박스 단위라 윤곽(segmentation)은 얻지 못한다",
    "라벨 품질과 데이터 양에 크게 좌우된다"
  ],
  lineage: [
    { name: "R-CNN / Faster R-CNN", rel: "비교 대상 (two-stage)" },
    { name: "SSD", rel: "동시대 one-stage" },
    { name: "RT-DETR", rel: "후속 접근 (Transformer)" }
  ],
  io: { input: "이미지 파일, 넘파이 배열 이미지, 동영상 등", output: "객체 번호(클래스), 좌표, 신뢰도(confidence)" },
  code: `from ultralytics import YOLO

model = YOLO("yolo26n.pt")      # COCO 사전학습 가중치
results = model("sample.jpg")   # results: 리스트 (이미지당 result 1개)

for result in results:
    result.names                # {0: 'cat', 1: 'dog'}
    result.boxes.data           # tensor: (x1, y1, x2, y2, conf, cls_idx)`,
  trainTitle: "적용 과정",
  train: [
    "학습 데이터 준비 (Roboflow로 라벨링)",
    "폴더 구조: train / valid / test 각각에 images, labels(객체번호 + 비율 좌표 txt)",
    "data.yaml 작성: 경로, nc(객체 종류 수), names",
    "model.train() 실행 후 IoU, mAP로 성능 판단"
  ],
  metrics: [
    { k: "IoU", v: "정답 박스와 예측 박스가 겹치는 정도 (교집합 / 합집합)" },
    { k: "mAP", v: "클래스별 정밀도-재현율 곡선 면적의 평균. 탐지 모델의 대표 지표" }
  ],
  apps: [
    { f: "스마트팜", t: "식물의 병든 정도 판별" },
    { f: "교통", t: "신호 위반, 보행자 감지, 차량 추적" },
    { f: "안전", t: "피플카운팅과 밀집도, 안전모 착용 확인, 폭력 행동 감지, 불법 현수막 탐지" }
  ],
  usage: [
    {
      p: "wt-yolo",
      when: "2026.10.02",
      role: "개인 실습",
      why: "Object Detection 수업에서 사전학습 모델을 내 데이터로 미세조정하는 전체 흐름(라벨링 → 학습 → 평가)을 익히려고 했다.",
      data: "Roboflow에서 직접 만든 고양이/개 2클래스 데이터셋. 학습 18장, 검증 5장, 테스트 3장(총 26장).",
      setup: "yolo26n.pt에서 시작, epochs 100, batch 16, imgsz 640, pretrained.",
      metrics: [
        ["mAP50 (최고, 81에폭)", "0.765"],
        ["mAP50-95", "0.320"],
        ["precision", "0.793"],
        ["recall", "0.694"],
        ["마지막 에폭 mAP50", "0.752"]
      ],
      learned: "데이터가 26장뿐이라 검증 loss(box 1.57, cls 2.37)가 학습 loss(1.10, 1.02)보다 훨씬 높다. 데이터를 늘리고 증강을 넣는 것이 다음 단계다.",
      qual: "혼동행렬과 검증 예측 이미지는 학습 결과 폴더에 있음. 대표 오탐/미탐 사례 정리 필요.",
      env: "ultralytics, Windows, 학습 약 352초(100에폭)",
      links: null
    }
  ]
});
