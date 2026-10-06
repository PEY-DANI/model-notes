#!/usr/bin/env node
/* 단일 HTML 묶음: node tools/bundle.js [출력경로]
   style.css, app.js, data/ 를 한 파일로 합칩니다 (기본 출력: dist/model-notes.html).
   파일 하나만 올릴 수 있는 곳(예: claude.ai 아티팩트)에 게시할 때 사용합니다. */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const read = f => fs.readFileSync(path.join(ROOT, f), "utf8");
const out = path.resolve(process.argv[2] || path.join(ROOT, "dist", "model-notes.html"));

const index = read("index.html");
const css = read("style.css");
let app = read("app.js");

const ids = new Function(read("data/models/index.js") + "\nreturn MODEL_IDS;")();
const data = [read("data/projects.js"), read("data/models/index.js"), ...ids.map(id => read(`data/models/${id}.js`))].join("\n");

/* boot() 대신 데이터를 직접 넣고 바로 시작 */
const s = app.indexOf("/* BOOT-START */"), e = app.indexOf("/* BOOT-END */");
if (s < 0 || e < 0) throw new Error("app.js 에 BOOT 표시가 없습니다");
const bootBlock = app.slice(s, e);
const buildIndexFn = /function buildIndex\(\)\{[\s\S]*?\n\}/.exec(bootBlock)[0];
app = app.slice(0, s) + "/* 데이터 (data/ 폴더에서 합침) */\n" + data + "\n" + buildIndexFn +
  '\naddEventListener("hashchange", route);\nroute();\n' + app.slice(e + "/* BOOT-END */".length);

if (/<\/script/i.test(app)) throw new Error("합친 스크립트에 </script 문자열이 있습니다");

const html = index
  .replace('<link rel="stylesheet" href="style.css">', "<style>\n" + css + "\n</style>")
  .replace('<script src="app.js"></script>', "<script>\n" + app + "\n</script>");

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`${out} (${Math.round(html.length / 1024)}KB)`);
