/* Model Notes 화면 코드. 데이터는 data/ 폴더에 있습니다(README 참고). */
const CTX = {co:"Career", wt:"Bootcamp", gr:"Education"};
const MODELS = [];                       // data/models/*.js 가 registerModel() 로 채웁니다
function registerModel(m){ MODELS.push(m); }
let byId, projById, ART_KIND;            // buildIndex() 에서 계산
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const val = v => (v===null||v===undefined||v==="") ? '<span class="todo">작성 필요</span>' : esc(v);
const CTX_RANK = {co:0, gr:1, wt:2};   /* 여러 소속에서 쓴 모델의 대표 색: Career > Education > Bootcamp */
const ctxOf = m => [...new Set(m.usage.map(u=>projById[u.p].ctx))].sort((a,b)=>CTX_RANK[a]-CTX_RANK[b]);
const app = document.getElementById("app");
const state = {q:"", task:"All", family:"All", ctx:"All", tab:"models"};

function themeBtn(){ return `<button class="themebtn" id="themeBtn" type="button">테마 전환</button>`; }
function bindTheme(){
  const b=document.getElementById("themeBtn"); if(!b) return;
  b.onclick=()=>{ const r=document.documentElement;
    const dark = r.dataset.theme==="dark";
    r.dataset.theme = dark ? "light" : "dark"; };
}
const ctxBadge = k => `<span class="badge ${k}">${CTX[k]}</span>`;

function header(){
  return `<header class="top">${themeBtn()}<span class="label">Model Notes</span>
    <h1>사용한 모델 기록</h1>
    <p>Career(회사), Bootcamp(원티드 과정), Education(대학원)에서 사용한 모델을 과제별로 정리했습니다. 각 모델 요약은 일반적인 설명이고, 직접 겪은 내용(언제, 어떤 데이터로, 어떤 결과)은 경험 카드에 기록합니다.</p>
    <div class="stats"><span><b>${MODELS.length}</b> 모델</span><span><b>${PROJECTS.length}</b> 프로젝트</span><span><b>${new Set(MODELS.map(m=>m.task)).size}</b> 과제 유형</span></div>
    <div class="tabs" role="tablist">
      <button class="tab" role="tab" type="button" data-tab="models" aria-selected="${state.tab==="models"}">모델별</button>
      <button class="tab" role="tab" type="button" data-tab="projects" aria-selected="${state.tab==="projects"}">프로젝트별</button>
    </div></header>`;
}
function bindTabs(){
  app.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;route();});
}

const ART_PAL={
 mint:{a:["#f0fffb","#7fdcc6"],b:["#bff3e6","#4fbfa8"],c:["#8fe3d0","#3aa08f"],t:["#f4fffc","#bff3e6"],l:["#a6ecdc","#62cdb8"],r:["#6fcfbb","#3d9c8d"],s:["#ffffff","#d4faf1","#8be3cf","#4fb8a6"],h:["#9fe6d4","#ecfffb","#72d5c0"],deep:"#4bb3a2",mid:"#79d4c1",shadow:"#1f6f68"},
 blue:{a:["#f1f6ff","#9fc0ff"],b:["#cfe0ff","#6f9cf3"],c:["#a6c4fb","#5b86e0"],t:["#f6f9ff","#d3e2ff"],l:["#bdd3ff","#7ca5f4"],r:["#86aaf0","#5379d6"],s:["#ffffff","#dce8ff","#9bbcff","#6389e6"],h:["#a9c6fb","#f2f7ff","#86aefa"],deep:"#6d93e6",mid:"#98b8f6",shadow:"#2b4aa0"},
 lav:{a:["#f7f2ff","#c4b4fa"],b:["#e1d6ff","#9d86ee"],c:["#c3b3f8","#8068d8"],t:["#fbf8ff","#e6dcff"],l:["#d2c5fb","#a692f0"],r:["#a994ee","#7c64d2"],s:["#ffffff","#ece5ff","#c0aff8","#8f78e4"],h:["#c8b9fa","#f8f4ff","#ae9bf5"],deep:"#8a73de",mid:"#b3a2f4",shadow:"#4a3a9a"}
};
const ART_PAL_CTX={co:"mint",wt:"blue",gr:"lav"};
let PAL=ART_PAL.blue;
/* ---------- 카드 일러스트: SVG 조명 필터로 만든 3D 클레이 질감 (과제 유형별 모양) ---------- */
function hashSeed(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed;return function(){a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
function smooth(pts,closed){
  const n=pts.length,at=i=>closed?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];
  let d="M"+pts[0][0].toFixed(1)+" "+pts[0][1].toFixed(1);
  for(let i=0;i<(closed?n:n-1);i++){
    const p0=at(i-1),p1=at(i),p2=at(i+1),p3=at(i+2);
    d+="C"+(p1[0]+(p2[0]-p0[0])/6).toFixed(1)+" "+(p1[1]+(p2[1]-p0[1])/6).toFixed(1)+" "+(p2[0]-(p3[0]-p1[0])/6).toFixed(1)+" "+(p2[1]-(p3[1]-p1[1])/6).toFixed(1)+" "+p2[0].toFixed(1)+" "+p2[1].toFixed(1);
  }
  return closed?d+"Z":d;
}
/* 조명 필터: blur로 만든 높이맵에 확산광(음영)과 반사광(하이라이트)을 입히고, 필요하면 바닥 그림자를 깐다 */
function lightFilter(id,blur,scale,shadow){
  const sh=shadow?`<feGaussianBlur in="SourceAlpha" stdDeviation="14" result="sb"/><feOffset in="sb" dx="6" dy="12" result="so"/><feFlood flood-color="${PAL.shadow}" flood-opacity=".2"/><feComposite in2="so" operator="in" result="shadow"/>`:"";
  return `<filter id="${id}" x="-40%" y="-40%" width="185%" height="195%" color-interpolation-filters="sRGB">${sh}
<feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="bump"/>
<feDiffuseLighting in="bump" surfaceScale="${scale}" diffuseConstant="1.1" lighting-color="#ffffff" result="diff"><feDistantLight azimuth="225" elevation="66"/></feDiffuseLighting>
<feComposite in="diff" in2="SourceAlpha" operator="in" result="diffIn"/>
<feBlend in="SourceGraphic" in2="diffIn" mode="multiply" result="shaded"/>
<feSpecularLighting in="bump" surfaceScale="${scale}" specularConstant=".3" specularExponent="16" lighting-color="#eef4ff" result="spec"><feDistantLight azimuth="225" elevation="66"/></feSpecularLighting>
<feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
<feComposite in="shaded" in2="specIn" operator="arithmetic" k1="0" k2="1" k3=".5" k4="0" result="lit"/>
${shadow?`<feMerge><feMergeNode in="shadow"/><feMergeNode in="lit"/></feMerge>`:""}</filter>`;
}
function artDefs(u){
 const P=PAL,g=(id,c)=>`<linearGradient id="${u}${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>`;
 return `<defs>${g("a",P.a)}${g("b",P.b)}${g("c",P.c)}${g("t",P.t)}${g("l",P.l)}${g("r",P.r)}
<radialGradient id="${u}s" cx=".34" cy=".28" r=".78"><stop offset="0" stop-color="${P.s[0]}"/><stop offset=".2" stop-color="${P.s[1]}"/><stop offset=".62" stop-color="${P.s[2]}"/><stop offset="1" stop-color="${P.s[3]}"/></radialGradient>
<linearGradient id="${u}h" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.h[0]}"/><stop offset=".5" stop-color="${P.h[1]}"/><stop offset="1" stop-color="${P.h[2]}"/></linearGradient>
${lightFilter(u+"p",8,4,true)}${lightFilter(u+"q",8,4,false)}${lightFilter(u+"v",3,2.5,true)}
<filter id="${u}d" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="11" result="b"/><feOffset in="b" dx="5" dy="10" result="o"/><feFlood flood-color="${P.shadow}" flood-opacity=".2"/><feComposite in2="o" operator="in" result="s"/><feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="${u}f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter></defs>`}
function sphere(u,x,y,r){
  return `<g filter="url(#${u}d)"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="url(#${u}s)"/></g>`+
         `<ellipse cx="${(x-r*.32).toFixed(1)}" cy="${(y-r*.38).toFixed(1)}" rx="${(r*.28).toFixed(1)}" ry="${(r*.16).toFixed(1)}" fill="#fff" opacity=".5" filter="url(#${u}f)" transform="rotate(-30 ${(x-r*.32).toFixed(1)} ${(y-r*.38).toFixed(1)})"/>`;
}
const ART_SHAPES={
 /* 양끝이 가늘어지는 납작한 리본 띠 두 장 */
 band:(u,r)=>{
  const mk=(y0,amp,ph,wmax,fill,op)=>{const top=[],bot=[];
   for(let i=0;i<=10;i++){const t=i/10,x=10+t*310,y=y0+Math.sin(t*Math.PI*1.3+ph)*amp,w=3+wmax*Math.sin(t*Math.PI);top.push([x,y-w/2]);bot.unshift([x,y+w/2])}
   return `<path d="${smooth(top,false)}${smooth(bot,false).replace(/^M/,"L")}Z" fill="${fill}" opacity="${op}" filter="url(#${u}v)"/>`};
  return mk(140+r()*8,28,.5,34,`url(#${u}c)`,.85)+mk(108+r()*8,38,0,48,`url(#${u}h)`,1);
 },
 /* 구체를 감싸는 기울어진 궤도 고리 */
 orbit:(u,r)=>{
  const cx=196,cy=104,R=32+r()*4;
  const rings=[[-22,98,30,"a"],[30,86,26,"b"]];
  const arc=([rot,rx,ry,g],front)=>`<path d="M${cx-rx} ${cy}A${rx} ${ry} 0 0 ${front?0:1} ${cx+rx} ${cy}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="url(#${u}${g})" stroke-width="9" stroke-linecap="round" filter="url(#${u}v)"/>`;
  return rings.map(o=>arc(o,false)).join("")+sphere(u,cx,cy,R)+rings.map(o=>arc(o,true)).join("")+sphere(u,cx+88,cy+46,8);
 },
 /* 원근으로 눕힌 토러스를 겹겹이 쌓은 모양 */
 rings:(u,r)=>{
  let s="";const cx=200+r()*14;
  for(let i=0;i<4;i++){
   const cy=165-i*30,rx=86-i*12,ry=34-i*4,g=["c","b","b","a"][i];
   s+=`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#${u}${g})" stroke-width="${22-i*2}" filter="url(#${u}p)"/>`;
  }
  return s+sphere(u,cx,58,15);
 },
 /* 렌즈: 두꺼운 고리 + 구체 + 초점 모서리 */
 lens:(u,r)=>{
  const cx=192,cy=104;
  const br=(x,y,dx,dy)=>`<path d="M${x} ${y+dy*28}V${y}H${x+dx*28}" fill="none" stroke="url(#${u}a)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" filter="url(#${u}v)"/>`;
  return br(102,28,1,1)+br(282,28,-1,1)+br(102,180,1,-1)+br(282,180,-1,-1)+
   `<circle cx="${cx}" cy="${cy}" r="56" fill="none" stroke="url(#${u}b)" stroke-width="24" filter="url(#${u}p)"/>`+
   sphere(u,cx,cy,30);
 },
 /* 매끈한 조약돌 */
 blobs:(u,r)=>{
  const g=["c","b","a"];let s="";
  [[150,140,58],[222,96,52],[248,160,40]].forEach(([x,y,R],i)=>{
   const pts=[],n=6,off=r()*Math.PI;
   for(let k=0;k<n;k++){const a=k/n*Math.PI*2+off,rad=R*(.82+.28*r());pts.push([x+Math.cos(a)*rad*1.15,y+Math.sin(a)*rad*.85])}
   s+=`<path d="${smooth(pts,true)}" fill="url(#${u}${g[i]})" filter="url(#${u}p)"/>`;
  });
  return s;
 },
 /* 모서리가 둥근 큐브 계단 */
 blocks:(u,r)=>{
  const cube=(x,y,s)=>{const w=s*.87,h=s*.5;
   return `<g filter="url(#${u}v)"><polygon points="${x},${y-s} ${x+w},${y-h} ${x},${y} ${x-w},${y-h}" fill="url(#${u}t)"/>`+
          `<polygon points="${x-w},${y-h} ${x},${y} ${x},${y+s} ${x-w},${y+h}" fill="url(#${u}l)"/>`+
          `<polygon points="${x},${y} ${x+w},${y-h} ${x+w},${y+h} ${x},${y+s}" fill="url(#${u}r)"/></g>`};
  const s0=38+r()*4;
  return cube(250,82,s0)+cube(186,118,s0)+cube(122,154,s0)+sphere(u,252,170,14);
 },
 /* 둥근 기둥 막대그래프 */
 bars:(u,r)=>{
  const h=[.3,.55,.85,1,.75,.45];let s="";
  h.forEach((v,i)=>{const bh=(36+110*v)*(.92+.16*r()),x=78+i*36,y=184-bh;
   s+=`<rect x="${x}" y="${y.toFixed(1)}" width="26" height="${bh.toFixed(1)}" rx="13" fill="url(#${u}${i%2?"b":"a"})" filter="url(#${u}p)"/>`;});
  return s;
 },
 /* 두께가 있는 문서 판 */
 pages:(u,r)=>{
  let s="";
  [[-12,96,36,"c"],[-3,140,44,"b"],[8,184,50,"a"]].forEach(([rot,x,y,g])=>{
   const body=`<rect x="${x}" y="${y}" width="104" height="124" rx="16"`;
   s+=`<g transform="rotate(${rot} ${x+52} ${y+62})">`+
      `<g filter="url(#${u}d)">${body} transform="translate(5 7)" fill="${PAL.deep}"/>${body} fill="url(#${u}${g})"/></g>`+
      `<g filter="url(#${u}v)">`+[0,1,2,3].map(k=>`<rect x="${x+14}" y="${y+20+k*20}" width="${[66,50,74,40][k]}" height="8" rx="4" fill="#ffffff"/>`).join("")+`</g></g>`;
  });
  return s;
 },
 /* 튜브로 연결된 구체 네트워크 */
 network:(u,r)=>{
  const P=[[118,66],[192,40],[254,92],[172,116],[108,156],[222,166],[282,160]].map(([x,y])=>[x+r()*12-6,y+r()*10-5,13+r()*10]);
  const E=[[0,1],[1,2],[1,3],[0,3],[3,4],[3,5],[2,5],[5,6]];
  const tubes=E.map(([a,b])=>`<line x1="${P[a][0].toFixed(1)}" y1="${P[a][1].toFixed(1)}" x2="${P[b][0].toFixed(1)}" y2="${P[b][1].toFixed(1)}" stroke="url(#${u}c)" stroke-width="12" stroke-linecap="round"/>`).join("");
  return `<g filter="url(#${u}v)">${tubes}</g>`+P.map(([x,y,rad])=>sphere(u,x,y,rad)).join("");
 },
 /* 결정 트리: 구체 노드와 튜브 가지 */
 tree:(u,r)=>{
  const N=[[196,38,24],[140,98,20],[252,98,20],[110,160,16],[170,160,16],[222,160,16],[282,160,16]];
  N.forEach(n=>{n[0]+=r()*8-4;n[1]+=r()*6-3});
  const E=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  const tubes=E.map(([a,b])=>`<line x1="${N[a][0].toFixed(1)}" y1="${N[a][1].toFixed(1)}" x2="${N[b][0].toFixed(1)}" y2="${N[b][1].toFixed(1)}" stroke="url(#${u}c)" stroke-width="11" stroke-linecap="round"/>`).join("");
  return `<g filter="url(#${u}v)">${tubes}</g>`+N.map(([x,y,rad])=>sphere(u,x,y,rad)).join("");
 },
 /* 두께가 있는 톱니바퀴 */
 gear:(u,r)=>{
  const cx=192,cy=100,R=82,rr=63,N=9,step=Math.PI*2/N,rot=r()*step;let d="";
  for(let i=0;i<N;i++){const a=rot+i*step;
   [[rr,0],[R,.16],[R,.46],[rr,.62]].forEach(([q,f],k)=>{const an=a+f*step;d+=(i===0&&k===0?"M":"L")+(cx+Math.cos(an)*q).toFixed(1)+" "+(cy+Math.sin(an)*q).toFixed(1)});
  }
  d+="Z"+`M${cx+28} ${cy}a28 28 0 1 0 -56 0a28 28 0 1 0 56 0Z`;
  let ext="";for(let k=10;k>=1;k--)ext+=`<path d="${d}" transform="translate(${(k*.8).toFixed(1)} ${(k*1.1).toFixed(1)})" fill="${k>5?PAL.deep:PAL.mid}" fill-rule="evenodd"/>`;
  return `<g filter="url(#${u}d)">${ext}</g><path d="${d}" fill="url(#${u}b)" fill-rule="evenodd" filter="url(#${u}q)"/>`;
 }
};
const ART_BY_TASK={"Tabular Prediction":["blocks","bars","tree","pages"],"Image Classification":["rings","blobs","lens"],"Object Detection":["lens","rings"],"Image Segmentation":["blobs","lens"],"Time-Series Forecasting":["band","orbit","bars","network"],"Probabilistic Decision-Making":["tree"],"Statistical Analysis":["bars","blocks"],"Text Classification":["pages"],"Retrieval & RAG":["network","pages","rings"],"OCR & Multimodal":["gear","orbit"]};
function computeArtKind(){const cnt={},out={};MODELS.forEach(m=>{const k=ART_BY_TASK[m.task]||["rings"];cnt[m.task]=cnt[m.task]||0;out[m.id]=k[cnt[m.task]%k.length];cnt[m.task]++});return out}
function cardArt(m,forceKind){
  PAL=ART_PAL[ART_PAL_CTX[ctxOf(m)[0]]||"blue"];
  const seed=hashSeed(m.id),r=rng(seed),u="g"+seed.toString(36);
  const kind=forceKind||ART_KIND[m.id]||"rings";
  return `<svg viewBox="0 0 300 200" preserveAspectRatio="xMaxYMax meet" overflow="visible" aria-hidden="true" focusable="false">${artDefs(u)}${ART_SHAPES[kind](u,r)}</svg>`;
}

function renderModels(){
  const tasks=["All",...new Set(MODELS.map(m=>m.task))];
  const fams=["All",...new Set(MODELS.map(m=>m.family))];
  const list=MODELS.filter(m=>
    (state.task==="All"||m.task===state.task)&&(state.family==="All"||m.family===state.family)&&
    (state.ctx==="All"||ctxOf(m).includes(state.ctx))&&
    (!state.q||(m.name+m.task+m.oneLine+m.arch).toLowerCase().includes(state.q.toLowerCase())));
  app.innerHTML=header()+`
  <div class="filters">
    <input class="search" id="q" type="search" placeholder="Search by model, task, or architecture" value="${esc(state.q)}" aria-label="Search">
    <div class="row"><span class="label">Category</span>${["All","co","gr","wt"].map(k=>`<button class="chip" type="button" data-ctx="${k}" aria-pressed="${state.ctx===k}">${k==="All"?"All":CTX[k]}</button>`).join("")}</div>
    <div class="row"><span class="label">Type</span>${fams.map(t=>`<button class="chip" type="button" data-fam="${esc(t)}" aria-pressed="${state.family===t}">${esc(t)}</button>`).join("")}</div>
    <div class="row"><span class="label">Task</span>${tasks.map(t=>`<button class="chip" type="button" data-task="${esc(t)}" aria-pressed="${state.task===t}">${esc(t)}</button>`).join("")}</div>
  </div>
  ${list.length?`<div class="grid">${list.map(m=>`
    <button class="card" type="button" data-id="${m.id}" data-ctx="${ctxOf(m)[0]}">
      <div class="card-art" aria-hidden="true">${cardArt(m)}</div>
      <div class="badges"><span class="badge">${esc(m.family)}</span><span class="badge">${esc(m.task)}</span></div>
      <h2>${esc(m.name)}</h2>
      <p class="desc">${esc(m.oneLine)}</p>
      <div class="card-foot"><span class="pill">${ctxOf(m).map(c=>CTX[c]).join(" · ")}</span><span class="go" aria-hidden="true">→</span></div>
    </button>`).join("")}</div>`
   :`<div class="empty">No models match the selected filters.</div>`}
  <p class="foot">카드를 누르면 모델 요약과 경험 카드가 열립니다. 회색 '작성 필요'는 아직 채우지 못한 항목입니다.</p>`;
  bindTheme(); bindTabs();
  const q=document.getElementById("q");
  q.oninput=e=>{state.q=e.target.value;const p=e.target.selectionStart;renderModels();const n=document.getElementById("q");n.focus();n.setSelectionRange(p,p);};
  app.querySelectorAll("[data-task]").forEach(b=>b.onclick=()=>{state.task=b.dataset.task;renderModels();});
  app.querySelectorAll("[data-fam]").forEach(b=>b.onclick=()=>{state.family=b.dataset.fam;renderModels();});
  app.querySelectorAll("[data-ctx]").forEach(b=>b.onclick=()=>{state.ctx=b.dataset.ctx;renderModels();});
  app.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>{location.hash=b.dataset.id;});
}

function renderProjects(){
  const groups=[["co","경력"],["wt","원티드 포텐업 하네스 엔지니어링 기반 AI agent 트랙"],["gr","연세대 공학대학원"]];
  app.innerHTML=header()+groups.map(([k,label])=>{
    const ps=PROJECTS.filter(p=>p.ctx===k);
    return `<section class="pgroup"><h2>${ctxBadge(k)} ${label}</h2><div class="plist">${ps.map(p=>{
      const ms=MODELS.filter(m=>m.usage.some(u=>u.p===p.id));
      return `<article class="proj">
        <div class="proj-body"><div class="pm">${esc(p.org)} · ${p.team?esc(p.team):'<span class="todo">개인/팀 · 인원 작성 필요</span>'} · ${esc(p.period)}</div><h3>${esc(p.name)}</h3>
        <p>${esc(p.summary)}</p>
        <div class="ptags">${ms.map(m=>`<button class="pill pill-btn" type="button" data-id="${m.id}">${esc(m.name)}</button>`).join("")}</div></div></article>`;}).join("")}</div></section>`;
  }).join("")+`<p class="foot">모델 이름을 누르면 해당 모델의 상세 기록으로 이동합니다.</p>`;
  bindTheme(); bindTabs();
  app.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>{location.hash=b.dataset.id;});
}

function renderDetail(m){
  const list=a=>a&&a.length?`<ul class="plain">${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:'<span class="todo">작성 필요</span>';
  const lineage=m.lineage?.length?`<section class="sec"><h2>계통과 관련 모델</h2><div class="tags">${m.lineage.map(l=>
    l.id&&byId[l.id]?`<button class="tag" type="button" data-go="${l.id}">${esc(l.name)} <small>${esc(l.rel)}</small></button>`
             :`<span class="tag">${esc(l.name)} <small>${esc(l.rel)}</small></span>`).join("")}</div></section>`:"";
  const usage=m.usage.map(u=>{
    const p=projById[u.p];
    const rows=[["역할",u.role],["선택 이유",u.why],["데이터",u.data],["주요 설정",u.setup]];
    const rows2=[["배운 점",u.learned],["오류·실패 사례",u.qual],["환경·재현",u.env],["링크",u.links]];
    const mc=u.metrics&&u.metrics.length?`<div class="mchips">${u.metrics.map(([k,v])=>`<span class="mchip"><small>${esc(k)}</small><b>${esc(v)}</b></span>`).join("")}</div>`:'<span class="todo">작성 필요</span>';
    const dl=r=>r.map(([k,v])=>`<dt>${k}</dt><dd>${val(v)}</dd>`).join("");
    return `<article class="rec">
      <div class="rec-head"><h3><button type="button" data-proj="${p.id}">${esc(p.name)}</button></h3>
        <span class="mono" style="font-size:14px;color:var(--muted)">${ctxBadge(p.ctx)} ${esc(u.when)}</span></div>
      <dl>${dl(rows)}<dt>결과</dt><dd>${mc}</dd>${dl(rows2)}</dl></article>`;}).join("");
  app.innerHTML=`
  ${themeBtn()}
  <button class="back" type="button" id="back">← 전체 모델</button>
  <header class="dhero" data-ctx="${ctxOf(m)[0]}">
    <div class="dhero-art" aria-hidden="true">${cardArt(m)}</div>
    <div class="badges">${ctxOf(m).map(ctxBadge).join("")}<span class="badge">${esc(m.family)}</span><span class="badge">${esc(m.task)}</span></div>
    <h1>${esc(m.name)}</h1><p class="sub">${esc(m.oneLine)}</p>
  </header>
  <dl class="facts">
    <div><dt class="label">출처</dt><dd>${esc(m.source.org)}</dd></div>
    <div><dt class="label">논문</dt><dd>${m.source.paper?esc(m.source.paper):"–"}</dd></div>
    <div><dt class="label">구분</dt><dd>${esc(m.family)} · ${esc(m.arch)}</dd></div>
    <div><dt class="label">학습 방식 / 연도</dt><dd>${esc(m.learn)} · ${m.year||"–"}</dd></div>
  </dl>
  <section class="sec"><h2>모델 요약</h2><p class="hint">모델 자체에 대한 일반적인 설명입니다.</p>
    <p style="margin:0 0 20px"><b>목적.</b> ${esc(m.purpose)}</p>
    <div class="two"><div><h3>특징</h3>${list(m.features)}</div><div><h3>한계</h3>${list(m.limits)}</div></div>
  </section>
  ${lineage}
  ${m.io?`<section class="sec"><h2>입력과 출력</h2><div class="two"><div><h3>Input</h3><p style="margin:0">${esc(m.io.input)}</p></div><div><h3>Output</h3><p style="margin:0">${esc(m.io.output)}</p></div></div></section>`:""}
  ${m.code?`<section class="sec"><h2>예측 및 추출 과정</h2><pre><code>${esc(m.code)}</code></pre></section>`:""}
  ${m.train?`<section class="sec"><h2>${esc(m.trainTitle||"학습 과정")}</h2><ol class="steps">${m.train.map(s=>`<li><span>${esc(s)}</span></li>`).join("")}</ol></section>`:""}
  ${m.metrics?`<section class="sec"><h2>성능 평가 지표</h2><div class="table-wrap"><table><thead><tr><th>지표</th><th>의미</th></tr></thead><tbody>${m.metrics.map(x=>`<tr><td class="mono">${esc(x.k)}</td><td>${esc(x.v)}</td></tr>`).join("")}</tbody></table></div></section>`:""}
  ${m.apps?`<section class="sec"><h2>활용 예시</h2><div class="table-wrap"><table><thead><tr><th>분야</th><th>활용</th></tr></thead><tbody>${m.apps.map(x=>`<tr><td>${esc(x.f)}</td><td>${esc(x.t)}</td></tr>`).join("")}</tbody></table></div></section>`:""}
  <section class="sec bare"><h2>경험 카드</h2><p class="hint">직접 사용하며 겪은 내용입니다. 위의 모델 요약은 일반적인 설명입니다.</p><div class="log">${usage}</div></section>`;
  bindTheme();
  document.getElementById("back").onclick=()=>{location.hash="";};
  app.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{location.hash=b.dataset.go;});
  app.querySelectorAll("[data-proj]").forEach(b=>b.onclick=()=>{state.tab="projects";location.hash="";route();});
}

function route(){
  const _id=location.hash.slice(1);app.classList.toggle("narrow",!!byId[_id]||state.tab==="projects");
  const id=location.hash.slice(1);
  if(byId[id]) renderDetail(byId[id]);
  else if(state.tab==="projects") renderProjects();
  else renderModels();
  window.scrollTo(0,0);
}
/* BOOT-START */
function buildIndex(){
  const order = Object.fromEntries(MODEL_IDS.map((id,i)=>[id,i]));
  MODELS.sort((a,b)=>order[a.id]-order[b.id]);
  byId = Object.fromEntries(MODELS.map(m=>[m.id,m]));
  projById = Object.fromEntries(PROJECTS.map(p=>[p.id,p]));
  ART_KIND = computeArtKind();
}
function loadScript(src){
  return new Promise((resolve,reject)=>{
    const el = document.createElement("script");
    el.src = src; el.async = false;
    el.onload = resolve; el.onerror = () => reject(new Error(src));
    document.head.appendChild(el);
  });
}
async function boot(){
  try{
    await loadScript("data/projects.js");
    await loadScript("data/models/index.js");
    await Promise.all(MODEL_IDS.map(id => loadScript("data/models/" + id + ".js")));
  }catch(e){
    app.innerHTML = '<p class="empty">데이터 파일을 불러오지 못했습니다: ' + esc(e.message) + '</p>';
    return;
  }
  buildIndex();
  addEventListener("hashchange", route);
  route();
}
boot();
/* BOOT-END */
