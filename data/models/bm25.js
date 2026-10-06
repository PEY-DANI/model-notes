/* BM25 — 모델 요약(일반 설명)은 위쪽 필드, 직접 겪은 내용은 usage(경험 카드)에 씁니다. 값이 null 이면 "작성 필요"로 표시됩니다. */
registerModel({
  id: "bm25",
  name: "BM25",
  task: "Retrieval & RAG",
  family: "LLM / RAG",
  arch: "희소 검색",
  learn: "통계 기반 랭킹",
  year: 1994,
  oneLine: "단어 빈도와 문서 길이로 점수를 매기는 검색 알고리즘",
  source: { org: "Robertson, Spärck Jones 외 (Okapi BM25)", paper: null },
  purpose: "단어 빈도(TF), 역문서 빈도(IDF), 문서 길이로 질의와 문서의 관련도를 점수화하는 검색 알고리즘.",
  features: ["tokenizer(형태소 분석기 등)에 따라 성능이 달라진다", "벡터 검색과 결합한 하이브리드 검색에 자주 쓰인다"],
  limits: ["의미 유사도는 못 잡는다"],
  lineage: [
    { id: "gpt4o-mini", name: "벡터 검색 (FAISS)", rel: "병행 (5:5)" }
  ],
  io: { input: "질의 문장과 문서 집합", output: "문서별 관련도 점수" },
  code: `from kiwipiepy import Kiwi
from rank_bm25 import BM25Okapi

kiwi = Kiwi()
tok = lambda s: [t.form for t in kiwi.tokenize(s)]   # 한국어 형태소 분석

bm25 = BM25Okapi([tok(d) for d in docs])
scores = bm25.get_scores(tok("검색 질의"))
top = sorted(range(len(docs)), key=lambda i: -scores[i])[:5]`,
  trainTitle: "구축 과정",
  train: [
    "문서를 tokenizer로 분리 (한국어는 형태소 분석기)",
    "단어별 문서 빈도(IDF) 계산",
    "질의 단어의 TF, IDF, 문서 길이로 점수 계산",
    "k1, b 파라미터 조정",
    "벡터 검색과 가중 결합(하이브리드)"
  ],
  metrics: [
    { k: "Hit rate / Recall@K", v: "정답 문서가 상위 K개에 들어온 비율" },
    { k: "MRR / NDCG", v: "정답의 순위 품질" },
    { k: "mAP", v: "평균 정밀도" }
  ],
  apps: [
    { f: "키워드 검색", t: "정확한 용어 일치" },
    { f: "하이브리드 검색", t: "벡터 검색과 결합" },
    { f: "RAG의 1차 검색기", t: "후보 문서 추출" }
  ],
  usage: [
    {
      p: "grad-gif",
      when: "석사 1차 프로젝트",
      role: "4인 팀, 실험 담당",
      why: "타깃 데이터가 한글이라는 점을 실험으로 확인하고 한국어 형태소 분석기를 BM25 tokenizer로 적용했다.",
      data: "G.I.F 문서 색인.",
      setup: "FAISS + BM25(KIWI) = 5:5.",
      metrics: [["Semantic score", "0.87"], ["Rouge", "0.81"]],
      learned: "한국어 형태소 분석이 검색 정확도를 높였다.",
      qual: null,
      env: null,
      links: null
    }
  ]
});
