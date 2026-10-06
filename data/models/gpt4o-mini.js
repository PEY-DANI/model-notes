/* gpt-4o-mini + text-embedding-3-small — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "gpt4o-mini",
  name: "gpt-4o-mini + text-embedding-3-small",
  task: "Retrieval & RAG",
  family: "LLM / RAG",
  arch: "LLM + 임베딩",
  learn: "사전학습 API",
  year: 2024,
  oneLine: "생성용 경량 LLM과 임베딩 모델 조합 (벡터 DB는 FAISS)",
  source: { org: "OpenAI", paper: null },
  purpose: "RAG의 생성과 임베딩을 맡는다.",
  features: ["비용 대비 성능이 좋다"],
  limits: ["임베딩 검색은 정확한 키워드 일치에 약할 수 있다", "API 호출 비용과 지연이 있다"],
  lineage: [
    { id: "gpt4o", name: "gpt-4o", rel: "상위 모델" },
    { id: "bm25", name: "BM25", rel: "병행 검색기" }
  ],
  io: { input: "질문과 검색된 문맥(텍스트)", output: "생성된 답변. 임베딩 모델은 텍스트를 벡터로 변환" },
  code: `from openai import OpenAI

client = OpenAI()
emb = client.embeddings.create(
    model="text-embedding-3-small", input=["검색할 문장"]).data[0].embedding

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "system", "content": "주어진 문맥으로만 답하세요."},
              {"role": "user", "content": f"문맥: {context}\\n질문: {question}"}])`,
  trainTitle: "적용 과정",
  train: [
    "문서를 청크로 나누고 임베딩 생성",
    "벡터 DB(FAISS 등)에 적재",
    "질문을 임베딩해 유사한 청크 검색",
    "검색된 문맥을 프롬프트에 넣어 답변 생성",
    "검색과 생성 지표로 평가하고 모듈별로 조정"
  ],
  metrics: [
    { k: "Faithfulness", v: "답변이 문맥에 근거한 정도" },
    { k: "Semantic score", v: "정답과의 의미 유사도" },
    { k: "Meteor / Rouge", v: "정답과의 문장 겹침" }
  ],
  apps: [
    { f: "RAG 챗봇", t: "문서 기반 질의응답" },
    { f: "요약·분류", t: "저비용 대량 처리" },
    { f: "의미 검색", t: "임베딩 기반 검색" }
  ],
  usage: [
    {
      p: "grad-gif",
      when: "석사 1차 프로젝트",
      role: "4인 팀, 실험 담당",
      why: "LLM·임베딩 3사(OpenAI, Claude, Upstage)와 벡터 DB 3종(FAISS, Chroma, Pinecone)을 후보로 같은 조건에서 비교했다.",
      data: "AutoRAG로 자동 생성한 평가 QA 100개(4분).",
      setup: "모듈 단계별 고정 실험. 벡터 DB 파라미터 mmr, k=4, fetch_k=10.",
      metrics: [
        ["Semantic score", "0.85"],
        ["Faithfulness", "0.9833"],
        ["Meteor", "0.88 → 0.91 (mmr)"],
        ["Rouge", "0.78"]
      ],
      learned: "평가 비용이 모듈 수 × 메트릭 수에 비례한다는 점을 정리하고, 메트릭을 선별한 뒤 모듈을 한 단계씩 고정하며 실험했다.",
      qual: null,
      env: "AutoRAG, LangChain, FAISS",
      links: null
    }
  ]
});
