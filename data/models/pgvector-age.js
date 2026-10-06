/* pgvector + Apache AGE — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "pgvector-age",
  name: "pgvector + Apache AGE",
  task: "Retrieval & RAG",
  family: "LLM / RAG",
  arch: "벡터 + 그래프 DB",
  learn: "저장소 설계",
  year: null,
  oneLine: "PostgreSQL 하나에서 벡터 검색과 그래프 질의를 함께 쓰는 구성",
  source: { org: "pgvector, Apache AGE (오픈소스)", paper: null },
  purpose: "PostgreSQL 확장으로 벡터 유사도 검색(pgvector)과 그래프 질의(Apache AGE)를 한 데이터베이스에서 쓴다.",
  features: ["SQL, 벡터 검색, 그래프 질의(openCypher)를 함께 사용한다", "트랜잭션으로 데이터 일관성을 유지한다"],
  limits: ["대규모 그래프 순회 성능은 전용 그래프 DB보다 제한적일 수 있다"],
  lineage: [
    { name: "GraphRAG / MemGPT / Mem0 / Memory-R1 / MAGMA", rel: "선행 연구" }
  ],
  io: { input: "임베딩 벡터와 그래프 데이터 (엔티티와 관계)", output: "유사한 항목, 그래프 탐색 결과" },
  code: `-- 벡터 검색 (pgvector): 코사인 거리로 가장 가까운 5개
SELECT id, content FROM memory
ORDER BY embedding <=> $1 LIMIT 5;

-- 그래프 질의 (Apache AGE, openCypher)
SELECT * FROM cypher('memory_graph', $$
  MATCH (a:Entity)-[r]->(b:Entity)
  WHERE a.name = 'X' RETURN a, r, b
$$) AS (a agtype, r agtype, b agtype);`,
  trainTitle: "구축 과정",
  train: [
    "PostgreSQL에 pgvector, AGE 확장 설치",
    "벡터 열과 그래프 스키마 설계",
    "데이터를 임베딩해 적재하고 엔티티·관계를 그래프에 저장",
    "벡터 검색과 그래프 탐색을 SQL 하나로 결합",
    "인덱스(HNSW 등)와 쿼리 성능 조정"
  ],
  metrics: [
    { k: "Recall@K", v: "벡터 검색의 정답 포함률" },
    { k: "질의 지연 시간", v: "응답 속도" },
    { k: "동기화 일관성", v: "저장소 간 불일치 여부" }
  ],
  apps: [
    { f: "RAG의 지식 저장소", t: "벡터 + 그래프 하이브리드" },
    { f: "에이전트 메모리", t: "장기 기억 저장" },
    { f: "추천·관계 분석", t: "연결 관계 탐색" }
  ],
  usage: [
    {
      p: "grad-memrag",
      when: "2026 (진행 중)",
      role: "단독 수행",
      why: "기존 방식은 벡터·그래프·메모리 저장소가 분리돼 있어 동기화 비용이 든다.",
      data: null,
      setup: "추출된 사실을 ADD/UPDATE/DELETE/NOOP로 판정하고, 지수 시간 감쇠(effective_weight = raw_weight × exp(−λ · days_since_last_seen))를 적용해 최신 상태를 관리. push/recall/search/ingest 파이프라인 + REST API. 엔티티-관계-엔티티 트리플을 N-hop 탐색하고 FastAPI 비동기 + 커넥션 풀로 서빙.",
      metrics: [],
      learned: null,
      qual: null,
      env: "PostgreSQL, pgvector, Apache AGE, FastAPI",
      links: null
    }
  ]
});
