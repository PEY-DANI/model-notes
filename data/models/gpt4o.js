/* gpt-4o — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "gpt4o",
  name: "gpt-4o",
  task: "OCR & Multimodal",
  family: "LLM / RAG",
  arch: "멀티모달 LLM",
  learn: "사전학습 API",
  year: 2024,
  oneLine: "텍스트와 이미지를 함께 이해하는 OpenAI의 멀티모달 모델",
  source: { org: "OpenAI", paper: null },
  purpose: "텍스트와 이미지를 함께 입력받아 이해하고 텍스트를 생성하는 멀티모달 모델.",
  features: ["이미지 입력 지원", "한국어 처리"],
  limits: ["API 비용과 응답 지연"],
  lineage: [
    { id: "gpt4o-mini", name: "gpt-4o-mini", rel: "경량 버전" }
  ],
  io: { input: "텍스트와 이미지", output: "생성된 텍스트" },
  code: `from openai import OpenAI
import base64

client = OpenAI()
b64 = base64.b64encode(open("image.png", "rb").read()).decode()
resp = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": [
        {"type": "text", "text": "이미지의 글자를 그대로 읽어줘."},
        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}]}])
print(resp.choices[0].message.content)`,
  trainTitle: "적용 과정",
  train: [
    "작업을 정의하고 프롬프트 설계",
    "입력(이미지)을 인코딩해 API로 전달",
    "출력 형식(JSON 등)을 지정",
    "정답 데이터로 결과를 정량 평가",
    "비용·지연을 고려해 모델 선택"
  ],
  metrics: [
    { k: "Cosine similarity / CER", v: "OCR 결과와 정답의 유사도, 문자 오류율" },
    { k: "Faithfulness", v: "답변이 근거와 일치하는 정도" },
    { k: "지연 시간 / 비용", v: "호출당 운영 비용" }
  ],
  apps: [
    { f: "OCR·문서 이해", t: "이미지 속 글자 읽기" },
    { f: "이미지 설명·키워드 추출", t: "검색 색인 생성" },
    { f: "멀티모달 에이전트", t: "화면·이미지 이해" }
  ],
  usage: [
    {
      p: "grad-gif",
      when: "석사 1차 프로젝트",
      role: "4인 팀, 실험 담당",
      why: "기프티콘 이미지 속 글자와 개념을 텍스트로 바꿔야 검색할 수 있다.",
      data: "기프티콘 이미지, 평가용 QA 100개. OCR 정답(ground truth)은 수작업으로 만들어 cosine similarity로 비교.",
      setup: "OCR 후보 4종(gpt-4o, Pororo, Upstage, easyOCR) 비교. 이미지에서 keyword를 추출해 metadata + page_content document로 만들어 FAISS에 적재. LangChain 5개 노드 그래프(Agent, Retrieve, Generate, Web Search, Query Rewrite).",
      metrics: [["OCR cosine similarity", "0.924 (채택)"]],
      learned: "후보를 같은 정답 기준으로 수치 비교해 채택했다.",
      qual: null,
      env: "LangChain",
      links: null
    }
  ]
});
