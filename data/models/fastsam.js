/* FastSAM — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "fastsam",
  name: "FastSAM",
  task: "Image Segmentation",
  family: "DL",
  arch: "CNN (YOLOv8-seg 기반)",
  learn: "사전학습",
  year: 2023,
  oneLine: "이미지 속 후보 마스크를 먼저 모두 만들고, 조건에 맞는 영역을 고르는 범용 분할 모델",
  source: {
    org: "Chinese Academy of Sciences 연구진 (원 논문), Ultralytics (라이브러리 제공)",
    paper: "Fast Segment Anything (2023)"
  },
  purpose: "클래스를 정해 두지 않고 이미지 속 여러 대상의 마스크를 만든 뒤, 점·박스·텍스트 조건으로 원하는 영역을 선택한다.",
  features: [
    "YOLOv8-seg 기반이라 SAM보다 가볍고 실시간 용도에 맞다",
    "2단계로 동작한다: ① 이미지에서 후보 마스크 생성 ② 조건(점·박스·텍스트)에 맞는 영역 선택",
    "텍스트 선택에는 CLIP을 활용한다 (후보 영역과 입력 문구가 얼마나 맞는지 비교)",
    "커스텀 학습 없이 범용적으로 쓴다 (zero-shot)"
  ],
  limits: [
    "기본 분할은 모든 대상을 하나의 클래스('object')로 다룬다. 상품명·동물 이름이 자동으로 붙지 않는다",
    "후보 마스크에 원하는 영역이 없으면 선택 단계에서 해결되지 않는다 (경계가 부정확할 수 있음)",
    "SAM보다 수십 배 빠르다고 해서 모든 장비에서 실시간으로 동작하는 것은 아니다. 모델 크기·장비·해상도까지 포함한 실제 시간을 확인해야 한다",
    "작은 물체와 복잡한 경계의 품질은 따로 확인해야 한다"
  ],
  lineage: [
    { id: "yolo-seg", name: "YOLO26-seg", rel: "같은 분할 계열 (YOLOv8-seg 기반)" },
    { id: "clip", name: "CLIP", rel: "텍스트 선택에 사용" },
    { id: "sam3", name: "SAM 3", rel: "비교 대상 (원래 SAM 계열)" }
  ],
  io: { input: "이미지 (+ 선택 조건: 점, 박스, 텍스트)", output: "후보 마스크(masks), 박스·신뢰도(boxes). 클래스는 'object' 하나" },
  code: `from ultralytics import FastSAM

model = FastSAM("models/FastSAM-s.pt")
results = model("images/test_image.jpg", conf=0.7)   # 신뢰도 0.7 이상만

# 텍스트 프롬프트 (CLIP 설치 필요)
# results = model(img_path, texts="a photo of person", conf=0.5)

result = results[0]
result.masks.data        # (객체 수, H, W) 후보 마스크
result.boxes.conf        # 마스크별 신뢰도`,
  trainTitle: "적용 과정",
  train: [
    "ultralytics로 사전학습 가중치(FastSAM-s.pt) 불러오기",
    "이미지를 넣어 후보 마스크 생성, conf로 신뢰도 낮은 후보 걸러내기",
    "텍스트로 고르려면 Ultralytics CLIP을 설치하고 texts 인자로 문구 전달",
    "result.masks, result.boxes로 마스크·신뢰도 확인"
  ],
  metrics: [
    { k: "마스크 IoU", v: "정답 영역과 예측 영역의 겹침 (TP/(TP+FP+FN))" },
    { k: "마스크 AP", v: "개별 물체를 얼마나 잘 찾고 나눴는지. COCO 방식은 IoU 0.5~0.95 평균" },
    { k: "추론 속도", v: "모델 크기·장비·해상도·선택 처리까지 포함해 직접 측정" }
  ],
  apps: [
    { f: "상품 이미지 편집", t: "여러 상품 중 클릭한 상품만 마스크로 선택" },
    { f: "범용 객체 분할", t: "학습 없이 이미지 속 모든 영역을 후보로 분리" },
    { f: "실시간 처리", t: "속도가 중요한 서비스에서 SAM 대신 사용" }
  ],
  usage: [
    {
      p: "wt-seg",
      when: "2026.10",
      role: "개인 실습",
      why: "기업은 커스텀 학습 없이 범용적으로 탐지하는 모델을 원한다는 점에서 SAM 계열을 알아보고, 실시간 용도의 FastSAM을 써 보려고 했다.",
      data: "images/test_image.jpg (1280×720)",
      setup: "FastSAM-s.pt 사전학습 모델, conf=0.7. 텍스트 프롬프트 추론은 Ultralytics CLIP을 따로 설치해(uv pip install git+https://github.com/ultralytics/CLIP.git) texts='a photo of person', conf=0.5로 실행해 봤다.",
      metrics: [
        ["검출", "object 29개 (conf 0.7 이상)"],
        ["추론 속도", "111.7ms (전처리 1.3ms, 후처리 12.1ms)"],
        ["텍스트 프롬프트 (conf 0.5)", "1개 선택, conf 0.89 (후처리 약 2.8초)"]
      ],
      learned: "클래스가 'object' 하나뿐이라 어떤 물체인지는 알려주지 않는다. 마스크를 하나씩 확인하며 원하는 영역을 골라야 한다. 텍스트 프롬프트는 '객체 중에 person처럼 보이는 것을 골라 달라'는 뜻이라, 이 경우에도 클래스별 객체 탐지는 되지 않는다. 실제로 'a photo of person'은 사람 6명 전부가 아니라 문구와 가장 잘 맞는 1명(맨 왼쪽 아이)만 골랐다. 여러 명을 모두 찾으려면 SAM 3처럼 문구로 개념 전체를 분할하는 모델이 맞다. 실시간 탐지에는 FastSAM, 정확한 성능이 중요한 경우에는 Meta의 SAM이 더 적합하다고 정리했다.",
      qual: "텍스트 프롬프트로 고른 1명은 눈으로 확인함(사람이 맞음). 다른 문구로는 시도하지 않음. 마스크 품질(경계, 작은 물체)에 대한 정리 필요.",
      env: "ultralytics",
      links: null
    }
  ]
});
