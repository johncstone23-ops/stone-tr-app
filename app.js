
const STORE_KEY = "stone_tr_local_v2";
const PLAN_URL = "./assets/plan.json";
const EX_URL = "./assets/exercises.json";
let PLAN=null;
let EX=null;

function loadStore(){
  try{
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {
      done:{}, notes:{}, choice:{}, rpe:{}, intensity:{},
      focusDate:null,
      measures:{}, // date -> {weight, waist, neck, chest, hips, thigh, arm}
      rucks:{},    // date -> {distance, timeMin, weight, pace, notes}
      pullups:{}   // date -> {maxStrict, totalReps, variant, assist, notes}
      ,warmups:{} // date -> { itemText: true/false }
    };
  }catch{
    return {done:{}, notes:{}, choice:{}, rpe:{}, intensity:{}, focusDate:null, measures:{}, rucks:{}, pullups:{}, warmups:{}};
  }
}
let STORE = loadStore();
function saveStore(){ localStorage.setItem(STORE_KEY, JSON.stringify(STORE)); }

function todayISO(){
  const n=new Date();
  const y=n.getFullYear();
  const m=String(n.getMonth()+1).padStart(2,'0');
  const d=String(n.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
function fmtDate(iso){
  const dt=new Date(iso+"T00:00:00");
  return dt.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric",year:"numeric"});
}
function esc(s){ return (s??"").toString().replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
function escAttr(s){ return esc(s).replaceAll('"',"&quot;"); }

function ensureKey(dateISO){
  if(!(dateISO in STORE.done)) STORE.done[dateISO]=false;
  if(!(dateISO in STORE.notes)) STORE.notes[dateISO]="";
  if(!(dateISO in STORE.choice)) STORE.choice[dateISO]="Base plan (as written)";
  if(!(dateISO in STORE.rpe)) STORE.rpe[dateISO]="";
  if(!(dateISO in STORE.intensity)) STORE.intensity[dateISO]="";
}

function blankScreenWatchdog(){
  // If something fails after load (cached SW serving old files, JSON mismatch, etc.), don't stay blank.
  setTimeout(()=>{
    const view = document.getElementById("view");
    if(!view) return;
    // If there is no card/h1 content rendered, show guidance.
    const hasContent = view.querySelector(".card, h1, .h1, table, canvas, textarea, ul");
    if(!hasContent){
      view.innerHTML = `
        <section class="card errorbox">
          <div class="h1">Nothing rendered</div>
          <div class="small">This usually means a cached Service Worker is still serving an older broken build, or the plan/exercise JSON failed to load/parse.</div>
          <div class="h2">Fix</div>
          <ul class="list">
            <li>Hard refresh: Ctrl+Shift+R (desktop) or pull-to-refresh twice (mobile).</li>
            <li>Chrome Android: Settings → Site settings → Storage → clear for johncstone23-ops.github.io</li>
            <li>Remove the home-screen app and re-add after clearing storage.</li>
            <li>Verify these URLs load (no 404): <span class="pill">/stone-tr-app/assets/plan.json</span> and <span class="pill">/stone-tr-app/app.js</span></li>
          </ul>
          <div class="h2">Build</div>
          <div class="code">v=20260220042400</div>
        </section>
      `;
    }
  }, 900);
}

function ensureWarmupKey(dateISO){
  if(!STORE.warmups) STORE.warmups = {};
  if(!(dateISO in STORE.warmups)) STORE.warmups[dateISO] = {};

function ensureShieldState(){
  if(!STORE.shielded) STORE.shielded = {workout:{}, warmup:{}};
  if(!STORE.shielded.workout) STORE.shielded.workout = {};
  if(!STORE.shielded.warmup) STORE.shielded.warmup = {};
}
function monthKey(dateISO){ return dateISO.slice(0,7); } // YYYY-MM
function shieldsUsedThisMonth(type, dateISO){
  ensureShieldState();
  const mk = monthKey(dateISO);
  const map = STORE.shielded[type] || {};
  return Object.keys(map).filter(d => d.startsWith(mk) && map[d]).length;
}
function shieldAvailable(type, dateISO){
  // 1 shield per calendar month per streak type
  return shieldsUsedThisMonth(type, dateISO) < 1;
}
function isShielded(type, dateISO){
  ensureShieldState();
  return !!STORE.shielded?.[type]?.[dateISO];
}
function applyShield(type, dateISO){
  ensureShieldState();
  if(!shieldAvailable(type, dateISO)) return false;
  STORE.shielded[type][dateISO] = true;
  saveStore();
  return true;
}
function clearShield(type, dateISO){
  ensureShieldState();
  if(STORE.shielded[type] && STORE.shielded[type][dateISO]){
    delete STORE.shielded[type][dateISO];
    saveStore();
    return true;
  }
  return false;
}
function warmupDoneForDate(dateISO, code){
  // Warm-up done = all warm-up checklist items checked for that day's warmup list.
  const items = warmupFor(code) || [];
  if(items.length===0) return false;
  const state = STORE.warmups?.[dateISO] || {};
  return items.every(it => !!state[it]);
}
function calcStreaksForType(type, dateISO){
  // type: "workout" uses STORE.done; "warmup" uses warmupDoneForDate.
  const days = (PLAN?.days || []);
  const dates = days.map(d=>d.date);
  ensureShieldState();

  const doneArr = days.map(d=>{
    if(type==="workout") return !!STORE.done?.[d.date] || isShielded("workout", d.date);
    return warmupDoneForDate(d.date, d.code) || isShielded("warmup", d.date);
  });

  // Longest streak
  let longest=0, run=0;
  for(const f of doneArr){
    if(f){ run++; longest=Math.max(longest, run); }
    else run=0;
  }

  const idx0 = dates.indexOf(dateISO);
  if(idx0 < 0) return { current: 0, longest, atRisk:false, canShield:false, shieldedToday:false, usedThisMonth:0 };

  let idx = idx0;
  let atRisk = false;

  // If today isn't done yet, streak is "through yesterday" and is at risk.
  if(!doneArr[idx]){
    idx = idx - 1;
    atRisk = true;
  }

  let current=0;
  while(idx >= 0 && doneArr[idx]){ current++; idx--; }
  if(current===0) atRisk=false;

  const usedThisMonth = shieldsUsedThisMonth(type, dateISO);
  const canShield = atRisk && shieldAvailable(type, dateISO);
  const shieldedToday = isShielded(type, dateISO);

  return { current, longest, atRisk, canShield, shieldedToday, usedThisMonth };
}

}
function renderWarmupChecklist(day){
  const items = warmupFor(day.code) || [];
  ensureWarmupKey(day.date);
  const state = STORE.warmups[day.date] || {};
  const rows = items.map((txt)=>{
    const checked = state[txt] ? "checked" : "";
    return `<label class="checkrow"><input type="checkbox" class="wu" data-date="${day.date}" data-item="${escAttr(txt)}" ${checked}/> <span>${esc(txt)}</span></label>`;
  }).join("");
  return `
    <section class="card" id="warmupCard">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="h2" style="margin:0">Warm-up (5–8 min) Checklist</div>
          <div class="row" style="margin-top:6px;gap:8px;flex-wrap:wrap">
            <span class="pill">Warm-up status: ${warmupDoneForDate(day.date, day.code) ? "Complete" : "In progress"}</span>
            ${isShielded("warmup", day.date) ? `<span class="pill">🛡 Shielded today</span>` : ``}
          </div>
          <div class="small">Check items as you go. Keep it easy—warm, loose, ready.</div>
        </div>
        <div class="row">
          <button class="btn secondary" id="wuAll">All</button>
          <button class="btn secondary" id="wuReset">Reset</button>
        </div>
      </div>
      <div class="checks">${rows}</div>
      <div class="small" style="margin-top:8px">Peloton classes include a warm-up, but still do 60–90 seconds of easy joint prep first. Run workouts already include a longer warm-up when specified.</div>
    </section>
  `;
}

async function init(){
  PLAN = await fetch(PLAN_URL).then(r=>r.json());
  EX = await fetch(EX_URL).then(r=>r.json()).catch(()=>({exercises:[]}));
  registerSW();
  wireTabs();
  render("today");
    blankScreenWatchdog();
  document.getElementById("exportBtn").addEventListener("click", exportData);
  document.getElementById("importFile").addEventListener("change", importData);
}
function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js?v=20260220045217").catch(()=>{});
  }
}
function wireTabs(){
  document.querySelectorAll(".tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.tab);
    });
  });
}
function getDay(dateISO){
  return PLAN.days.find(x=>x.date===dateISO) || null;
}
function getClosestDay(dateISO){
  const first=PLAN.days[0].date;
  const last=PLAN.days[PLAN.days.length-1].date;
  if(dateISO < first) return PLAN.days[0];
  if(dateISO > last) return PLAN.days[PLAN.days.length-1];
  return getDay(dateISO) || PLAN.days[0];
}

function warmupFor(code){
  // 5–8 min default warm-up. Designed for off‑duty / home gear and street-ready movement quality.
  // Keep it easy: you should feel warmer, looser, and more "snappy"—not fatigued.
  if(code==="R" || code==="C"){
    return [
      "1–2 min easy: brisk walk or easy pedal (Peloton)",
      "Breathing reset: 3 slow nasal breaths, long exhale",
      "Ankles: 10 ankle rocks/side + 10 calf pumps",
      "Hips: 10 leg swings front/back + 10 side/side each",
      "Glutes: 10 glute bridges + 6 bodyweight reverse lunges/side",
      "Run primer: 2 x 20s relaxed strides (or 30s fast walk)"
    ];
  }
  if(code==="SB" || code==="SA" || code==="TAC"){
    return [
      "1–2 min easy: jump rope / marching in place / easy Peloton spin",
      "T‑spine + shoulders: 6 cat‑cow + 6 thoracic rotations/side",
      "Hinge + squat pattern: 10 hip hinges + 6 goblet squat pry (light KB/DB)",
      "Scap + push: 8 scap push‑ups + 10 band pull‑aparts (or Y‑T‑W x 5 each)",
      "Core brace: dead bug 6/side (slow)",
      "Grip primer (optional): 20–30s easy hang or light farmer hold"
    ];
  }
  if(code==="MOB"){
    return [
      "Start with 60–90s easy movement (walk/pedal)",
      "Then begin the mobility flow as written (that IS the warm‑up)"
    ];
  }
  // REC or anything else
  return [
    "2–3 min easy walk",
    "Joint circles: neck/shoulders/hips (gentle)",
    "Light mobility: world's greatest stretch x 3/side",
    "Finish with 3 slow breaths"
  ];
}

function ul(items){
  return `<ul class="list">${items.map(i=>`<li>${esc(i)}</li>`).join("")}</ul>`;
}

function render(tab){
  const view=document.getElementById("view");
  if(tab==="today") view.innerHTML = renderToday();
  if(tab==="calendar") view.innerHTML = renderCalendar();
  if(tab==="log") view.innerHTML = renderLogs();
  if(tab==="library") view.innerHTML = renderLibrary();
  if(tab==="manual") view.innerHTML = renderManual();
  postWire(tab);
}

let timerState = {seconds:0, running:false, interval:null};

function renderToday(){
  const focus = STORE.focusDate ? STORE.focusDate : todayISO();
  const day = getClosestDay(focus);
  ensureKey(day.date);
  const t = day.template;

  const streakW = calcStreaksForType('workout', day.date);
  const streakWU = calcStreaksForType('warmup', day.date);

  const opt = t.programOptions.map(o=>`<option ${STORE.choice[day.date]===o?'selected':''}>${esc(o)}</option>`).join("");
  const checked = STORE.done[day.date] ? "checked" : "";

  const intensity = STORE.intensity[day.date] || "";
  const iPills = ["GOOD","BETTER","BEST"].map(x=>{
    const active = intensity===x ? "active" : "";
    return `<button class="chip ${active}" data-intensity="${x}">${x}</button>`;
  }).join("");

  const tiredBtn = `<button class="btn warn" id="tiredBtn">Tired / short on time</button>`;
  const ssUrl = "https://www.youtube.com/watch?v=booDFgeuN6Y";
  const showSS = (t.programOptions||[]).some(o => (o||"").includes("Simple & Sinister"));

  return `
    <section class="card">
      <div class="row">
        <span class="pill">${esc(day.code)}</span>
        <span class="pill">${esc(day.shift)}</span>
        <span class="pill">Week ${day.week}</span>
        <span class="pill">🔥 Workout Streak: ${streakW.current}</span>
        <span class="pill">🏆 Workout Best: ${streakW.longest}</span>
        <span class="pill">🧘 Warm-up Streak: ${streakWU.current}</span>
        <span class="pill">🏆 Warm-up Best: ${streakWU.longest}</span>
      </div>
      ${(streakW.atRisk || streakWU.atRisk) ? `<div class="small" style="margin-top:6px">${streakW.atRisk ? "Complete today&#39;s workout to keep your workout streak alive. " : ""}${streakWU.atRisk ? "Finish today&#39;s warm-up checklist to keep your warm-up streak alive." : ""}</div>` : ``}
      <h1 class="h1">${fmtDate(day.date)} - ${esc(t.title)}</h1>
      <div class="small">Pick GOOD / BETTER / BEST, choose a Program option, and check it off.</div>
      <div class="chips" style="margin-top:10px">${iPills}</div>
    </section>

    
    <section class="card">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap">
        <div class="row" style="flex-wrap:wrap">
          <span class="pill">🛡 Workout Shield: ${streakW.usedThisMonth}/1 used</span>
          <span class="pill">🛡 Warm-up Shield: ${streakWU.usedThisMonth}/1 used</span>
        </div>
        <div class="row" style="flex-wrap:wrap">
          ${(streakW.canShield && !streakW.shieldedToday) ? `<button class="btn secondary" id="useShieldW">Use workout shield today</button>` : ``}
          ${(streakWU.canShield && !streakWU.shieldedToday) ? `<button class="btn secondary" id="useShieldWU">Use warm-up shield today</button>` : ``}
          ${(streakW.shieldedToday) ? `<button class="ghost" id="undoShieldW">Undo workout shield</button>` : ``}
          ${(streakWU.shieldedToday) ? `<button class="ghost" id="undoShieldWU">Undo warm-up shield</button>` : ``}
        </div>
      </div>
      <div class="small">Shield = 1 “free pass” per month per streak type. Use it only if you miss a day and want to keep the streak.</div>
    </section>

    ${renderWarmupChecklist(day)}


    <section class="card">
      <div class="row">
        <label class="pill"><input type="checkbox" id="done" ${checked}/> Completed</label>
        <label class="pill">RPE (1-10): <input id="rpe" value="${escAttr(STORE.rpe[day.date]||"")}" style="width:70px"/></label>
        <label class="pill">Program:
          <select id="choice">${opt}</select>
        </label>
        ${tiredBtn}
        ${showSS ? `<a class="ghost" id="ssLink" href="${ssUrl}" target="_blank" rel="noopener">S&amp;S follow-along video</a>` : ``}
        <button class="btn secondary" id="jumpLogs">Open Logs</button>
      </div>

      <div id="goodSection">
        <div class="h2">GOOD (15-25 min)</div>
        ${ul(t.good)}
      </div>
      <div class="h2">BETTER (30-45 min)</div>
      ${ul(t.better)}
      <div class="h2">BEST (45-70+ min)</div>
      ${ul(t.best)}

      ${day.code==="SB" ? renderCarryCard() : ""}

      <div class="h2">Timer</div>
      <div class="timer">
        <div class="clock" id="clock">00:00</div>
        <button class="btn secondary" id="startTimer">Start</button>
        <button class="btn secondary" id="pauseTimer">Pause</button>
        <button class="btn secondary" id="resetTimer">Reset</button>
        <button class="btn secondary" id="set25">Set 25:00</button>
        <button class="btn secondary" id="set20">Set 20:00</button>
      </div>
      <div class="small">Tip: "Tired / short on time" auto-selects GOOD and sets 25:00.</div>

      <div class="h2">Notes</div>
      <textarea id="notes" placeholder="How did it feel? Anything to adjust?">${esc(STORE.notes[day.date]||"")}</textarea>

      <div class="row" style="margin-top:10px">
        <button class="btn" id="save">Save</button>
        <button class="btn secondary" id="prev">Prev</button>
        <button class="btn secondary" id="next">Next</button>
        <button class="btn secondary" id="todayBtn">Today</button>
      </div>
      <div class="small">All data is stored locally on this device. Export occasionally as a backup.</div>
    </section>
  `;
}

function renderCarryCard(){
  const cf = PLAN.carryFinisher;
  return `
    <div class="card" style="margin-top:12px">
      <div class="h2">${esc(cf.title)}</div>
      <div class="small">Use this when you pick "Simple & Sinister (scaled) + Carry Finisher".</div>
      <div class="h2">GOOD</div>${ul(cf.good)}
      <div class="h2">BETTER</div>${ul(cf.better)}
      <div class="h2">BEST</div>${ul(cf.best)}
      <div class="small">Default: ${esc(cf.default)}</div>
    </div>
  `;
}

function renderCalendar(){
  const rows = PLAN.days.map(d=>{
    ensureKey(d.date);
    const checked = STORE.done[d.date] ? "checked" : "";
    return `<tr>
      <td>${fmtDate(d.date)}</td>
      <td><span class="pill">${esc(d.code)}</span></td>
      <td>${esc(d.template.title)}</td>
      <td><input class="calDone" data-date="${d.date}" type="checkbox" ${checked}></td>
      <td><button class="ghost openDay" data-date="${d.date}">Open</button></td>
    </tr>`;
  }).join("");
  return `
    <section class="card">
      <h1 class="h1">12-Week Calendar (Start ${fmtDate(PLAN.startDate)})</h1>
      <div class="small">Tap Open to view that day. Checkboxes are stored locally.</div>
    </section>
    <section class="card">
      <table>
        <thead><tr><th>Date</th><th>Code</th><th>Focus</th><th>Done</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function renderLogs(){
  const focus = STORE.focusDate ? STORE.focusDate : todayISO();
  const day = getClosestDay(focus);
  ensureKey(day.date);

  const m = STORE.measures[day.date] || {};
  const r = STORE.rucks[day.date] || {};
  const p = STORE.pullups[day.date] || {};

  const puVar = p.variant || "Strict";
  const puAssist = p.assist || "";

  return `
    <section class="card">
      <h1 class="h1">Logs for ${fmtDate(day.date)}</h1>
      <div class="small">Use the calendar to pick a date (Open) or use Prev/Next in Today view.</div>
      <div class="kpi">
        <span class="pill">Ruck pace auto-calculates</span>
        <span class="pill">Charts are local + offline</span>
      </div>
    </section>

    <section class="card">
      <div class="h2">Body + Measurements</div>
      <div class="row">
        <label>Weight (lb) <input id="w" type="number" step="0.1" value="${escAttr(m.weight||"")}"></label>
        <label>Waist (in) <input id="waist" type="number" step="0.1" value="${escAttr(m.waist||"")}"></label>
        <label>Neck (in) <input id="neck" type="number" step="0.1" value="${escAttr(m.neck||"")}"></label>
        <label>Chest (in) <input id="chest" type="number" step="0.1" value="${escAttr(m.chest||"")}"></label>
        <label>Hips (in) <input id="hips" type="number" step="0.1" value="${escAttr(m.hips||"")}"></label>
        <label>Thigh (in) <input id="thigh" type="number" step="0.1" value="${escAttr(m.thigh||"")}"></label>
        <label>Arm (in) <input id="arm" type="number" step="0.1" value="${escAttr(m.arm||"")}"></label>
        <button class="btn" id="saveMeasures">Save</button>
      </div>
      <div class="small">Trend charts show your last entries (device-local).</div>
      <hr>
      <canvas id="chartWeight" width="900" height="180"></canvas>
      <canvas id="chartWaist" width="900" height="180"></canvas>
      <canvas id="chartNeck" width="900" height="180"></canvas>
      <canvas id="chartChest" width="900" height="180"></canvas>
      <canvas id="chartHips" width="900" height="180"></canvas>
      <canvas id="chartThigh" width="900" height="180"></canvas>
      <canvas id="chartArm" width="900" height="180"></canvas>
    </section>

    <section class="card">
      <div class="h2">Ruck Log</div>
      <div class="row">
        <label>Distance (mi) <input id="ruckDist" type="number" step="0.01" value="${escAttr(r.distance||"")}"></label>
        <label>Time (min) <input id="ruckTime" type="number" step="1" value="${escAttr(r.timeMin||"")}"></label>
        <label>Ruck weight (lb) <input id="ruckWt" type="number" step="1" value="${escAttr(r.weight||"")}"></label>
        <label>Pace (min/mi) <input id="ruckPace" disabled value="${escAttr(r.pace||"")}"></label>
        <button class="btn" id="saveRuck">Save</button>
      </div>
      <textarea id="ruckNotes" placeholder="Feet hot spots? Terrain? HR zone?">${esc(r.notes||"")}</textarea>
      <hr>
      <canvas id="chartRuckPace" width="900" height="180"></canvas>
    </section>

    <section class="card">
      <div class="h2">Pull-Up Tracking</div>
      <div class="row">
        <label>Progression
          <select id="puVar">
            ${["Strict","Band-assisted","Negatives","Isometric holds","Scap pulls"].map(x=>`<option ${puVar===x?"selected":""}>${x}</option>`).join("")}
          </select>
        </label>
        <label>Assist details (optional) <input id="puAssist" value="${escAttr(puAssist)}" placeholder="Band color/weight, negatives tempo, etc."></label>
      </div>
      <div class="row" style="margin-top:8px">
        <label>Max strict pull-ups <input id="puMax" type="number" step="1" value="${escAttr(p.maxStrict||"")}"></label>
        <label>Total pull-up reps today (optional) <input id="puTotal" type="number" step="1" value="${escAttr(p.totalReps||"")}"></label>
        <button class="btn" id="savePullups">Save</button>
      </div>
      <textarea id="puNotes" placeholder="Grip/elbows? Sets x reps? EMOM details?">${esc(p.notes||"")}</textarea>
      <hr>
      <canvas id="chartPullups" width="900" height="180"></canvas>
    </section>
  `;
}

function renderLibrary(){
  const q = STORE.libQuery || "";
  const tag = STORE.libTag || "all";
  const tags = ["all","kettlebell","dumbbell","sandbag","rucking","pull-ups","core","mobility"];
  const chips = tags.map(t=>{
    const active = (tag===t) ? "active" : "";
    return `<button class="chip ${active}" data-tag="${t}">${t}</button>`;
  }).join("");

  let list = (EX && EX.exercises) ? EX.exercises : [];
  if(tag!=="all"){
    list = list.filter(e => (e.tags||[]).includes(tag));
  }
  if(q.trim()){
    const qq = q.trim().toLowerCase();
    list = list.filter(e => (e.name||"").toLowerCase().includes(qq) || (e.purpose||"").toLowerCase().includes(qq));
  }
  const rows = list.slice(0, 300).map((e)=>{
    const t = (e.tags||[]).map(x=>`<span class="pill">${esc(x)}</span>`).join(" ");
    return `<div class="card">
      <div class="row" style="justify-content:space-between">
        <div>
          <div class="h2" style="margin:0">${esc(e.name)}</div>
          <div class="small">${esc(e.purpose||"")}</div>
        </div>
        <button class="ghost openEx" data-name="${escAttr(e.name)}">Open</button>
      </div>
      <div class="row" style="margin-top:8px">${t}</div>
    </div>`;
  }).join("");

  return `
    <section class="card">
      <h1 class="h1">Exercise Library (Offline)</h1>
      <div class="small">Search + filter. Everything is cached for offline use.</div>
      <div class="row" style="margin-top:10px">
        <input id="libSearch" placeholder="Search (e.g., swing, get-up, squat, ruck)" value="${escAttr(q)}" style="flex:1;min-width:260px">
        <button class="btn secondary" id="libClear">Clear</button>
      </div>
      <div class="chips">${chips}</div>
    </section>
    ${rows || `<section class="card"><div class="small">No matches. Try a different search or tag.</div></section>`}
  `;
}

function renderManual(){
  return `
    <section class="card">
      <h1 class="h1">Manual</h1>
      <div class="small">The full manual PDF is bundled and cached for offline use.</div>
      <div style="margin-top:10px">
        <a href="./assets/manual.pdf" target="_blank" rel="noopener">Open the PDF manual</a>
      </div>
    </section>
  `;
}

function postWire(tab){
  if(tab==="today"){
    const focus = STORE.focusDate ? STORE.focusDate : todayISO();
    const day = getClosestDay(focus);
    ensureKey(day.date);

    document.querySelectorAll('[data-intensity]').forEach(btn=>{
      btn.addEventListener("click", ()=>{
        STORE.intensity[day.date] = btn.dataset.intensity;
        saveStore();
        render("today");
        if(btn.dataset.intensity==="GOOD"){
          document.getElementById("goodSection").scrollIntoView({behavior:"smooth",block:"start"});
        }
      });
    });

    document.getElementById("save").addEventListener("click", ()=>{
      STORE.done[day.date] = document.getElementById("done").checked;
      STORE.rpe[day.date] = document.getElementById("rpe").value || "";
      STORE.choice[day.date] = document.getElementById("choice").value || "Base plan (as written)";
      STORE.notes[day.date] = document.getElementById("notes").value || "";
      saveStore();
      const b=document.getElementById("save"); b.textContent="Saved"; setTimeout(()=>b.textContent="Save",700);
    });

    
    // Program dropdown: save + re-render on change so helper links (S&S) appear immediately
    const choiceEl = document.getElementById("choice");
    if(choiceEl){
      choiceEl.addEventListener("change", ()=>{
        STORE.choice[day.date] = choiceEl.value || "Base plan (as written)";
        saveStore();
        render("today");
      });
    }

document.getElementById("prev").addEventListener("click", ()=>jump(day.date, -1));
    document.getElementById("next").addEventListener("click", ()=>jump(day.date, +1));
    document.getElementById("todayBtn").addEventListener("click", ()=>{ STORE.focusDate=todayISO(); saveStore(); render("today"); });

    document.getElementById("tiredBtn").addEventListener("click", ()=>{
      STORE.intensity[day.date] = "GOOD";
      saveStore();
      setTimer(25*60);
      render("today");
      setTimeout(()=>{
        document.getElementById("goodSection").scrollIntoView({behavior:"smooth",block:"start"});
      }, 50);
    });

    document.getElementById("jumpLogs").addEventListener("click", ()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      document.querySelector('[data-tab="log"]').classList.add("active");
      render("log");
    });

    wireTimerUI();
  }

  if(tab==="calendar"){
    document.querySelectorAll(".calDone").forEach(cb=>{
      cb.addEventListener("change", ()=>{
        const d=cb.dataset.date; ensureKey(d);
        STORE.done[d]=cb.checked; saveStore();
      });
    });
    document.querySelectorAll(".openDay").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        STORE.focusDate = btn.dataset.date; saveStore();
        document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
        document.querySelector('[data-tab="today"]').classList.add("active");
        render("today");
      });
    });
  }

  if(tab==="log"){
    const focus = STORE.focusDate ? STORE.focusDate : todayISO();
    const day = getClosestDay(focus);
    ensureKey(day.date);

    document.getElementById("saveMeasures").addEventListener("click", ()=>{
      STORE.measures[day.date] = {
        weight: valNum("w"), waist: valNum("waist"),
        neck: valNum("neck"), chest: valNum("chest"), hips: valNum("hips"),
        thigh: valNum("thigh"), arm: valNum("arm")
      };
      saveStore();
      flashBtn("saveMeasures");
      drawAllCharts();
    });

    const recalc = ()=>{
      const dist = valNum("ruckDist");
      const tmin = valNum("ruckTime");
      const pace = (dist && tmin) ? (tmin/dist) : "";
      document.getElementById("ruckPace").value = pace ? pace.toFixed(2) : "";
    };
    ["ruckDist","ruckTime"].forEach(id=>{
      document.getElementById(id).addEventListener("input", recalc);
    });
    recalc();

    document.getElementById("saveRuck").addEventListener("click", ()=>{
      const dist = valNum("ruckDist");
      const tmin = valNum("ruckTime");
      const wt = valNum("ruckWt");
      const pace = (dist && tmin) ? (tmin/dist) : null;
      STORE.rucks[day.date] = {
        distance: dist || "", timeMin: tmin || "", weight: wt || "",
        pace: (pace!=null) ? pace.toFixed(2) : "",
        notes: document.getElementById("ruckNotes").value || ""
      };
      saveStore();
      flashBtn("saveRuck");
      drawAllCharts();
    });

    document.getElementById("savePullups").addEventListener("click", ()=>{
      STORE.pullups[day.date] = {
        variant: document.getElementById("puVar").value || "Strict",
        assist: document.getElementById("puAssist").value || "",
        maxStrict: valNum("puMax") || "",
        totalReps: valNum("puTotal") || "",
        notes: document.getElementById("puNotes").value || ""
      };
      saveStore();
      flashBtn("savePullups");
      drawAllCharts();
    });

    drawAllCharts();
  }

  if(tab==="library"){
    const search = document.getElementById("libSearch");
    search.addEventListener("input", ()=>{
      STORE.libQuery = search.value || "";
      saveStore();
      render("library");
    });
    document.getElementById("libClear").addEventListener("click", ()=>{
      STORE.libQuery = "";
      saveStore();
      render("library");
    });
    document.querySelectorAll("[data-tag]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        STORE.libTag = btn.dataset.tag;
        saveStore();
        render("library");
      });
    });
    document.querySelectorAll(".openEx").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        openExerciseModal(btn.dataset.name);
      });
    });
  }
}

// Timer
function setTimer(seconds){
  timerState.seconds = Math.max(0, Math.floor(seconds));
  timerState.running = false;
  if(timerState.interval){ clearInterval(timerState.interval); timerState.interval=null; }
}
function tick(){
  if(!timerState.running) return;
  if(timerState.seconds <= 0){
    timerState.running=false;
    if(timerState.interval){ clearInterval(timerState.interval); timerState.interval=null; }
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      o.type="sine"; o.frequency.value=880;
      o.connect(ctx.destination);
      o.start();
      setTimeout(()=>{ o.stop(); ctx.close(); }, 300);
    }catch{}
    return;
  }
  timerState.seconds -= 1;
  updateClock();
}
function updateClock(){
  const el = document.getElementById("clock");
  if(!el) return;
  const s = timerState.seconds;
  const mm = String(Math.floor(s/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  el.textContent = `${mm}:${ss}`;
}
function wireTimerUI(){
  if(timerState.seconds===0){
    setTimer(20*60);
  }
  updateClock();
  document.getElementById("startTimer").addEventListener("click", ()=>{
    timerState.running=true;
    if(!timerState.interval){
      timerState.interval=setInterval(tick, 1000);
    }
  });
  document.getElementById("pauseTimer").addEventListener("click", ()=>{ timerState.running=false; });
  document.getElementById("resetTimer").addEventListener("click", ()=>{ timerState.running=false; updateClock(); });
  document.getElementById("set25").addEventListener("click", ()=>{ setTimer(25*60); updateClock(); });
  document.getElementById("set20").addEventListener("click", ()=>{ setTimer(20*60); updateClock(); });
}

// Charts
function valNum(id){
  const el = document.getElementById(id);
  if(!el) return "";
  const v = el.value;
  if(v==="" || v==null) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}
function flashBtn(id){
  const b=document.getElementById(id);
  const orig=b.textContent;
  b.textContent="Saved";
  setTimeout(()=>b.textContent=orig, 700);
}
function sortedEntries(mapObj, field){
  const keys = Object.keys(mapObj||{}).sort();
  const pts = [];
  for(const k of keys){
    const v = mapObj[k]?.[field];
    const num = (typeof v==="number") ? v : (v===""? null : Number(v));
    if(num!=null && Number.isFinite(num)){
      pts.push({date:k, value:num});
    }
  }
  return pts;
}
function drawLineChart(canvasId, pts, label){
  const c = document.getElementById(canvasId);
  if(!c) return;
  const ctx = c.getContext("2d");
  const W = c.width, H=c.height;
  ctx.clearRect(0,0,W,H);

  ctx.fillStyle = "rgba(255,255,255,0.02)";
  ctx.fillRect(0,0,W,H);

  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1;
  for(let i=1;i<5;i++){
    const y = (H/5)*i;
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }

  ctx.fillStyle = "rgba(229,231,235,0.9)";
  ctx.font = "14px system-ui";
  ctx.fillText(label, 10, 18);

  if(!pts || pts.length<2){
    ctx.fillStyle = "rgba(156,163,175,0.9)";
    ctx.font = "12px system-ui";
    ctx.fillText("Not enough data yet.", 10, 40);
    return;
  }

  const values = pts.map(p=>p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if(min===max){ min -= 1; max += 1; }

  const padL=40, padR=12, padT=30, padB=22;
  const x0=padL, x1=W-padR, y0=padT, y1=H-padB;

  ctx.fillStyle = "rgba(156,163,175,0.9)";
  ctx.font = "11px system-ui";
  ctx.fillText(min.toFixed(1), 8, y1);
  ctx.fillText(max.toFixed(1), 8, y0+5);

  const xStep = (x1-x0)/(pts.length-1);
  const yScale = (y1-y0)/(max-min);

  ctx.strokeStyle = "#93c5fd";
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach((p,i)=>{
    const x = x0 + xStep*i;
    const y = y1 - (p.value - min)*yScale;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();

  ctx.fillStyle = "#93c5fd";
  pts.forEach((p,i)=>{
    const x = x0 + xStep*i;
    const y = y1 - (p.value - min)*yScale;
    ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill();
  });

  ctx.fillStyle = "rgba(156,163,175,0.9)";
  ctx.font = "11px system-ui";
  ctx.fillText(pts[0].date.slice(5), x0, H-6);
  const last = pts[pts.length-1].date.slice(5);
  ctx.fillText(last, x1-28, H-6);
}
function drawAllCharts(){
  drawLineChart("chartWeight", sortedEntries(STORE.measures,"weight"), "Weight (lb)");
  drawLineChart("chartWaist", sortedEntries(STORE.measures,"waist"), "Waist (in)");
  drawLineChart("chartNeck", sortedEntries(STORE.measures,"neck"), "Neck (in)");
  drawLineChart("chartChest", sortedEntries(STORE.measures,"chest"), "Chest (in)");
  drawLineChart("chartHips", sortedEntries(STORE.measures,"hips"), "Hips (in)");
  drawLineChart("chartThigh", sortedEntries(STORE.measures,"thigh"), "Thigh (in)");
  drawLineChart("chartArm", sortedEntries(STORE.measures,"arm"), "Arm (in)");
  drawLineChart("chartRuckPace", sortedEntries(STORE.rucks,"pace"), "Ruck Pace (min/mi)");
  drawLineChart("chartPullups", sortedEntries(STORE.pullups,"maxStrict"), "Max Strict Pull-Ups");
}

// Exercise modal
function openExerciseModal(name){
  const ex = (EX.exercises||[]).find(e=>e.name===name);
  if(!ex) return;
  const overlay = document.createElement("div");
  overlay.style.position="fixed";
  overlay.style.inset="0";
  overlay.style.background="rgba(0,0,0,0.65)";
  overlay.style.padding="14px";
  overlay.style.zIndex="9999";
  overlay.style.overflow="auto";

  const card = document.createElement("div");
  card.className="card";
  card.style.maxWidth="980px";
  card.style.margin="0 auto";

  const tags = (ex.tags||[]).map(t=>`<span class="pill">${esc(t)}</span>`).join(" ");
  card.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div>
        <div class="h1" style="margin:0">${esc(ex.name)}</div>
        <div class="small">${esc(ex.purpose||"")}</div>
      </div>
      <button class="ghost" id="closeEx">Close</button>
    </div>
    <div class="row" style="margin-top:8px">${tags}</div>
    <hr>
    ${section("Setup", ex.setup)}
    ${section("Execution", ex.steps)}
    ${section("Common mistakes", ex.common_mistakes)}
    ${section("Regressions", ex.regressions)}
    ${section("Progressions", ex.progressions)}
  `;
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  card.querySelector("#closeEx").addEventListener("click", ()=>overlay.remove());
  overlay.addEventListener("click", (e)=>{ if(e.target===overlay) overlay.remove(); });
}
function section(title, items){
  if(!items || !items.length) return "";
  return `<div class="h2">${esc(title)}</div>${ul(items)}`;
}

// Navigation
function jump(currentISO, delta){
  const idx = PLAN.days.findIndex(x=>x.date===currentISO);
  const target = PLAN.days[idx+delta];
  if(!target) return;
  STORE.focusDate = target.date; saveStore();
  render("today");
}

// Export/Import
function exportData(){
  const payload = { exportedAt: new Date().toISOString(), store: STORE };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const a=document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "stone_tr_export.json";
  a.click();
  URL.revokeObjectURL(a.href);
}
function importData(ev){
  const file = ev.target.files?.[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const parsed = JSON.parse(reader.result);
      if(parsed && parsed.store){
        STORE = parsed.store;
        saveStore();
        alert("Import complete.");
        render(document.querySelector(".tab.active")?.dataset?.tab || "today");
      }else{
        alert("That file doesn't look like an export.");
      }
    }catch{
      alert("Could not read that JSON file.");
    }
  };
  reader.readAsText(file);
  ev.target.value="";
}

init();
function calcStreaksFor(dateISO){ return calcStreaksForType("workout", dateISO); }


