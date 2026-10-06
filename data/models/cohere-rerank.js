/* Cohere Reranker — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "cohere-rerank",
  name: "Cohere Reranker",
  task: "Retrieval & RAG",
  family: "LLM / RAG",
  arch: "재순위(reranker)",
  learn: "사전학습 API",
  year: null,
  oneLine: "검색 결과를 질문과의 관련도로 다시 정렬하는 모델",
  source: { org: "Cohere", paper: null },
  purpose: "초기 검색 결과를 질문과의 관련도로 다시 정렬하는 재순위(reranker) 모델.",
  features: ["질문-문서 쌍을 함께 입력해 점수를 계산하는 cross-encoder 방식이다", "검색 결과의 순서에 따른 정보 손실 문제를 줄이는 데 쓰인다"],
  limits: ["API 호출 비용"],
  lineage: [
    { id: "bm25", name: "BM25", rel: "앞단 검색기" }
  ],
  io: { input: "질문과 후보 문서 목록", output: "문서별 관련도 점수와 재정렬 순서" },
  code: `import cohere

co = cohere.ClientV2()
res = co.rerank(
    model="rerank-v3.5",          # 모델 이름은 사용 시점의 최신 버전으로
    query=query, documents=docs, top_n=5)
for r in res.results:
    print(r.index, r.relevance_score)`,
  trainTitle: "적용 과정",
  train: [
    "1차 검색(벡터·BM25)으로 후보 문서를 넓게 추출",
    "질문과 후보 문서를 reranker에 전달",
    "관련도 점수로 재정렬하고 상위 N개 선택",
    "선택한 문서를 생성 모델의 문맥으로 사용",
    "다른 reranker(Cross Encoder, FlashRank 등)와 비교"
  ],
  metrics: [
    { k: "NDCG / MRR", v: "순위 품질" },
    { k: "Hit rate@K", v: "정답이 상위 K개에 들어온 비율" },
    { k: "지연 시간 / 비용", v: "호출 부담" }
  ],
  apps: [
    { f: "RAG 검색 품질 개선", t: "검색 후 재정렬" },
    { f: "검색 서비스", t: "결과 순위 개선" },
    { f: "질의응답", t: "근거 문서 선택" }
  ],
  usage: [
    {
      p: "grad-gif",
      when: "석사 1차 프로젝트",
      role: "4인 팀, 실험 담당",
      why: "Re-ranker로 'Lost in the Middle' 문제를 보완하려 했다.",
      data: "G.I.F 문서 색인.",
      setup: "Re-ranker 3종 비교 후 Cohere 채택. ranking 메트릭(mAP, mRR, NDCG)으로 검증.",
      metrics: [
        ["Semantic score", "0.88 (최종 조합)"],
        ["최종 개선", "0.85 → 0.88"],
        ["실험 시간", "12시간 → 15분 (AutoRAG)"]
      ],
      learned: "모듈별 최적 조합을 실험으로 확정하고, 평가 자동화로 반복 비용을 낮췄다.",
      qual: null,
      env: "AutoRAG",
      links: null
    }
  ]
});
