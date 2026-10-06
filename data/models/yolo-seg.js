/* YOLO26-seg — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "yolo-seg",
  name: "YOLO26-seg",
  task: "Image Segmentation",
  family: "DL",
  arch: "CNN (one-stage, 인스턴스 분할)",
  learn: "사전학습 (COCO)",
  year: 2026,
  oneLine: "객체 탐지와 함께 개체별 픽셀 마스크를 한 번에 내는 실시간 분할 모델",
  source: {
    org: "Ultralytics",
    paper: null
  },
  purpose: "이미지를 한 번 통과시켜 객체의 박스·클래스와 함께 개체마다 별도의 마스크(인스턴스 분할)를 예측한다.",
  features: [
    "탐지 모델(YOLO)과 같은 사용법에 마스크 출력이 더해진다",
    "COCO 80클래스 사전학습 가중치(yolo26n-seg.pt)를 바로 쓸 수 있다",
    "같은 종류의 물체도 사람 1·사람 2처럼 따로 나눈다"
  ],
  limits: [
    "학습한 클래스(COCO 80개) 밖의 대상은 분할하지 못한다",
    "마스크가 모델 입력 크기(예: 640×480)라 원본에 쓰려면 리사이즈가 필요하다",
    "머리카락처럼 가는 부분, 가려진 물체, 배경과 비슷한 색의 경계는 틀리기 쉽다"
  ],
  lineage: [
    { id: "yolo", name: "YOLO", rel: "기반 (탐지 모델에 마스크 출력 추가)" },
    { id: "fastsam", name: "FastSAM", rel: "같은 분할 계열 (YOLOv8-seg 기반)" }
  ],
  io: { input: "이미지 파일, URL, 넘파이 배열 등", output: "마스크(masks), 박스·클래스·신뢰도(boxes), 클래스 이름(names)" },
  code: `from ultralytics import YOLO

model = YOLO("models/yolo26n-seg.pt")
results = model("bus.jpg")        # 이미지당 result 1개인 리스트
result = results[0]

result.masks.data                 # (객체 수, 640, 480) 마스크 (입력 크기 기준)
result.boxes.data                 # (x1, y1, x2, y2, conf, cls_idx)
result.names                      # {0: 'person', ...}

# 마스크는 원본에 바로 쓸 수 없으므로 원본 크기로 리사이즈해서 알파 채널로 적용
mask = result.masks.data[0].cpu().numpy()`,
  trainTitle: "적용 과정",
  train: [
    "ultralytics로 사전학습 가중치(yolo26n-seg.pt) 불러오기",
    "이미지를 넣어 예측: results 리스트에서 이미지당 result 1개",
    "result.masks, result.boxes, result.names로 마스크·박스·클래스 확인",
    "마스크(640×480)를 원본 크기로 리사이즈해 알파 채널로 적용하고, 박스 좌표로 crop해 객체만 추출"
  ],
  metrics: [
    { k: "마스크 IoU", v: "정답 영역과 예측 영역의 교집합 / 합집합 (픽셀 단위). TP/(TP+FP+FN)" },
    { k: "mIoU", v: "클래스별 IoU의 평균. 의미 분할에서 여러 종류의 영역을 얼마나 잘 나눴는지" },
    { k: "마스크 AP", v: "마스크 IoU 기준에서 Precision·Recall을 종합한 값. COCO 방식은 IoU 0.5~0.95(0.05 간격) 평균" },
    { k: "PQ", v: "통합 분할 지표. SQ(영역 IoU) × RQ(대응·놓침 관계)" }
  ],
  apps: [
    { f: "상품 이미지 편집", t: "상품 마스크로 배경 제거·교체" },
    { f: "도로·차량 분석", t: "도로·보행자·차량 영역 추출" },
    { f: "로봇 물체 집기", t: "집을 대상의 영역과 좌표 확인" }
  ],
  usage: [
    {
      p: "wt-seg",
      when: "2026.10",
      role: "개인 실습",
      why: "Segmentation 수업에서 분할 결과(마스크)가 어떤 모양으로 나오는지, 그리고 마스크로 객체만 오려내는 방법을 익히려고 했다.",
      data: "Ultralytics 예제 이미지 bus.jpg (4 persons, 1 bus 검출).",
      setup: "yolo26n-seg.pt 사전학습 모델을 그대로 추론. 마스크(640×480)를 원본 크기(1080×810)로 리사이즈해 알파 채널로 적용하고, 박스 좌표로 crop해 객체만 남겼다.",
      metrics: [
        ["검출", "person 4 + bus 1"],
        ["추론 속도", "74.0ms (전처리 2.6ms, 후처리 3.5ms)"]
      ],
      learned: "마스크가 모델 입력 크기라 원본에 바로 적용할 수 없다. 리사이즈할 때 보간을 NEAREST로 해 경계를 유지했다. 박스는 위치와 크기만 주고 마스크가 물체의 실제 모양을 준다.",
      qual: "학습 없이 사전학습 모델을 한 장에 돌려 본 결과만 확인함. 다른 이미지에서의 오분할 사례 정리 필요.",
      env: "ultralytics",
      links: null
    }
  ]
});
