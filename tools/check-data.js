#!/usr/bin/env node
/* 데이터 점검: node tools/check-data.js
   - 모델 id 목록(data/models/index.js)과 실제 파일이 일치하는지
   - 필수 필드, 프로젝트 참조(usage[].p), 계통 링크(lineage[].id) 등
   오류가 있으면 종료 코드 1, 경고는 종료 코드에 영향 없음. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const errors = [], warns = [];
const err = m => errors.push(m), warn = m => warns.push(m);

/* 데이터 파일을 화면 코드와 같은 방식으로 실행 */
const ctx = { MODELS: [] };
ctx.registerModel = m => ctx.MODELS.push(m);
vm.createContext(ctx);
const run = (f) => {
  try { vm.runInContext(read(f), ctx, { filename: f }); }
  catch (e) { err(`${f}: 실행 오류 — ${e.message}`); }
};
run("data/projects.js");
run("data/models/index.js");

const ids = vm.runInContext("typeof MODEL_IDS==='undefined'?null:MODEL_IDS", ctx);
if (!ids) { err("data/models/index.js: MODEL_IDS 가 없습니다"); finish(); }

const files = fs.readdirSync(path.join(ROOT, "data/models")).filter(f => f.endsWith(".js") && f !== "index.js").map(f => f.slice(0, -3));
for (const id of ids) { if (!files.includes(id)) err(`index.js 에 있는 "${id}" 의 파일(data/models/${id}.js)이 없습니다`); }
for (const f of files) { if (!ids.includes(f)) err(`data/models/${f}.js 가 index.js 의 MODEL_IDS 에 없습니다 (화면에 나오지 않음)`); }
const dupIds = ids.filter((x, i) => ids.indexOf(x) !== i);
dupIds.forEach(d => err(`MODEL_IDS 에 "${d}" 가 중복됩니다`));

for (const id of ids) if (files.includes(id)) run(`data/models/${id}.js`);

const PROJECTS = vm.runInContext("typeof PROJECTS==='undefined'?[]:PROJECTS", ctx);
const projIds = new Set(PROJECTS.map(p => p.id));
const CTXS = ["co", "wt", "gr"];
const appSrc = read("app.js");
const knownTasks = Object.keys(JSON.parse(/const ART_BY_TASK=(\{[^;]*\});/.exec(appSrc)[1]));

/* 프로젝트 */
const pSeen = new Set();
for (const p of PROJECTS) {
  if (pSeen.has(p.id)) err(`프로젝트 id "${p.id}" 중복`);
  pSeen.add(p.id);
  if (!CTXS.includes(p.ctx)) err(`프로젝트 ${p.id}: ctx 는 ${CTXS.join("/")} 중 하나여야 합니다 (현재 ${p.ctx})`);
  for (const k of ["name", "org", "period", "summary"]) if (!p[k]) err(`프로젝트 ${p.id}: ${k} 가 비어 있습니다`);
  if (!("team" in p)) err(`프로젝트 ${p.id}: team 필드가 없습니다 ("개인" / "팀 N명" / null)`);
  else if (p.team === null) warn(`프로젝트 ${p.id}: 개인/팀 구분과 인원이 아직 없습니다 (작성 필요)`);
  else if (!/^(개인|팀 \d+명)$/.test(p.team)) warn(`프로젝트 ${p.id}: team 은 "개인" 또는 "팀 N명" 형식을 권장합니다 (현재 "${p.team}")`);
}

/* 모델 */
const REQUIRED = ["id", "name", "task", "family", "arch", "learn", "oneLine", "source", "purpose", "features", "limits", "lineage", "usage"];
const USAGE_KEYS = ["when", "role", "why", "data", "setup", "metrics", "learned", "qual", "env", "links"];
const models = ctx.MODELS;
const mIds = new Set(models.map(m => m.id));
let nullCount = 0;
for (const m of models) {
  const where = `모델 ${m.id}`;
  for (const k of REQUIRED) if (m[k] === undefined || m[k] === null || m[k] === "") err(`${where}: ${k} 가 비어 있습니다`);
  if (m.source && !m.source.org) err(`${where}: source.org 가 비어 있습니다`);
  if (!files.includes(m.id)) err(`${where}: 파일 이름과 id 가 다릅니다`);
  if (m.task && !knownTasks.includes(m.task)) warn(`${where}: task "${m.task}" 는 일러스트 매핑에 없어 기본 모양이 쓰입니다`);
  for (const l of m.lineage || []) {
    if (l.id && !mIds.has(l.id)) err(`${where}: lineage id "${l.id}" 에 해당하는 모델이 없습니다`);
    if (!l.name || !l.rel) err(`${where}: lineage 항목에 name/rel 이 필요합니다`);
  }
  if (!Array.isArray(m.usage) || !m.usage.length) err(`${where}: usage(경험 카드)가 하나 이상 필요합니다`);
  for (const [i, u] of (m.usage || []).entries()) {
    if (!projIds.has(u.p)) err(`${where}: usage[${i}].p "${u.p}" 프로젝트가 data/projects.js 에 없습니다`);
    for (const k of USAGE_KEYS) {
      if (!(k in u)) err(`${where}: usage[${i}] 에 ${k} 가 없습니다 (없으면 null)`);
      else if (u[k] === null || (Array.isArray(u[k]) && !u[k].length)) nullCount++;
    }
  }
}
if (models.length !== ids.length) err(`MODEL_IDS ${ids.length}개 중 ${models.length}개만 불러왔습니다`);

finish();

function finish() {
  warns.forEach(w => console.log("경고:", w));
  errors.forEach(e => console.log("오류:", e));
  console.log(`\n모델 ${models ? models.length : 0}개, 프로젝트 ${typeof PROJECTS !== "undefined" ? PROJECTS.length : 0}개 점검 — 오류 ${errors.length}, 경고 ${warns.length}, 비어 있는(작성 필요) 경험 카드 칸 ${typeof nullCount !== "undefined" ? nullCount : 0}개`);
  process.exit(errors.length ? 1 : 0);
}
