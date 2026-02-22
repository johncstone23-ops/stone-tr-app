
const STORE_KEY = "stone_tr_local_v2";
const PLAN_URL = "assets/plan.json";
const EX_URL = "assets/exercises.json";
let PLAN=null;
let EX=null;
const BUILD_ID = "20260222021252";


// ===== Nutrition & Recovery (Offline) =====
const RECIPES = [
  {
    id:"ip_salsa_chicken",
    name:"Instant Pot Salsa Chicken (batch)",
    tags:["instant pot","high protein","meal prep","kid-friendly"],
    servings:8,
    per:{kcal:250,p:35,c:6,f:8},
    ingredients:[
      "2.5–3 lb boneless skinless chicken breast (or 50/50 breast + thighs)",
      "16 oz salsa (choose mild for family)",
      "1 tbsp olive oil (optional)",
      "1 tbsp taco seasoning (or 2 tsp each cumin + chili powder + garlic powder)",
      "1 tsp salt (adjust to salsa)",
      "1 cup low-sodium chicken broth (or water)"
    ],
    steps:[
      "Trim chicken. Add broth/water to Instant Pot. Place chicken in (do not pack tightly).",
      "Pour salsa over chicken. Sprinkle seasoning + salt. Add olive oil if using.",
      "Cook: High Pressure 10 minutes for breasts (12–14 for thicker / thighs). Natural release 10 minutes, then quick release.",
      "Shred in pot with two forks. Stir to coat. If watery: sauté 5–8 minutes to thicken.",
      "Cool fast (spread in shallow container). Portion into 8 servings. Refrigerate 3–4 days or freeze up to 3 months."
    ],
    uses:[
      "Bowl: 1 cup chicken + 1 cup rice/quinoa + veggies.",
      "Tacos: 4 oz chicken + tortillas + slaw.",
      "Salad: chicken over greens + beans + corn."
    ]
  },
  {
    id:"af_salmon",
    name:"Air Fryer Salmon (Breville) + Rice/Quinoa",
    tags:["air fryer","omega-3","dinner","fast"],
    servings:4,
    per:{kcal:430,p:40,c:35,f:14},
    ingredients:[
      "4 x 6 oz salmon fillets",
      "1 tbsp olive oil or avocado oil",
      "1 tsp kosher salt",
      "1 tsp garlic powder",
      "1 tsp paprika",
      "1 lemon (zest + wedges)",
      "2 cups cooked rice or quinoa (batch-prepped)",
      "Optional: frozen broccoli or green beans"
    ],
    steps:[
      "Pat salmon dry. Rub with oil, salt, garlic, paprika, lemon zest.",
      "Breville Air Fry: 400°F for 8–12 minutes (thicker fillets longer) until it flakes easily.",
      "Serve with 1/2 cup cooked rice/quinoa per person (adjust for goals) + veg.",
      "Leftovers: flake into rice bowl, salad, or wraps."
    ]
  },
  {
    id:"egg_bake",
    name:"Sheet-Pan Egg & Veggie Bake (breakfast prep)",
    tags:["breakfast","meal prep","eggs"],
    servings:6,
    per:{kcal:260,p:22,c:10,f:14},
    ingredients:[
      "12 large eggs",
      "1 cup cottage cheese or Greek yogurt (optional, boosts protein)",
      "2 cups chopped veggies (spinach, peppers, onions, mushrooms)",
      "8 oz turkey sausage or ham (optional)",
      "1 tsp salt, 1/2 tsp pepper",
      "Cooking spray / parchment"
    ],
    steps:[
      "Heat oven 350°F. Line a sheet pan (or 9x13) with parchment + spray.",
      "Whisk eggs + cottage cheese/yogurt + salt/pepper. Fold in veggies + meat.",
      "Bake 22–28 minutes until set. Rest 10 minutes. Cut into 6 squares.",
      "Store: fridge 4 days. Reheat 60–90 seconds microwave or 8 minutes air fryer at 325°F."
    ]
  },
  {
    id:"ip_turkey_chili",
    name:"Instant Pot Turkey Chili (family pot)",
    tags:["instant pot","family","fiber"],
    servings:8,
    per:{kcal:360,p:33,c:32,f:10},
    ingredients:[
      "2 lb lean ground turkey",
      "1 tbsp olive oil",
      "1 large onion, diced",
      "3 cloves garlic, minced",
      "2 bell peppers, diced",
      "2 tbsp chili powder + 1 tbsp cumin",
      "1 tsp salt + pepper",
      "28 oz crushed tomatoes",
      "2 cans beans (kidney/black), drained",
      "1 cup broth or water",
      "Optional: 1 cup corn"
    ],
    steps:[
      "Sauté mode: oil → onion/pepper 3–4 min → add turkey, brown 5–7 min → add garlic + spices 30 sec.",
      "Add tomatoes + beans + broth. Pressure cook 12 minutes. Natural release 10 minutes.",
      "Taste. Adjust salt/heat. Serve with rice, Greek yogurt, cheese, or avocado.",
      "Freeze in single-meal containers."
    ]
  },
  {
    id:"overnight_oats",
    name:"Overnight Oats (on-the-go) + Protein",
    tags:["on the go","breakfast","kid-friendly"],
    servings:1,
    per:{kcal:480,p:35,c:58,f:12},
    ingredients:[
      "1/2 cup rolled oats",
      "3/4 cup milk (or almond milk) + 1/4 cup Greek yogurt",
      "1 scoop protein (Legion whey or Orgain)",
      "1 tbsp chia seeds (optional)",
      "1/2 cup berries or 1 banana",
      "Cinnamon + pinch of salt"
    ],
    steps:[
      "Mix everything in a jar. Refrigerate overnight (or 4+ hours).",
      "In the morning: stir, add a splash of milk if thick, top with fruit/nuts if desired."
    ]
  },
  {
    id:"rice_quinoa_batch",
    name:"Batch Rice + Quinoa (weekly prep)",
    tags:["meal prep","staples"],
    servings:10,
    per:{kcal:210,p:4,c:45,f:2},
    ingredients:[
      "White rice: 3 cups dry (makes ~9 cups cooked)",
      "Quinoa: 2 cups dry (makes ~6 cups cooked)",
      "Salt",
      "Optional: broth instead of water"
    ],
    steps:[
      "Instant Pot Rice: rinse → 1:1 water → High Pressure 4 min → Natural release 10 min.",
      "Instant Pot Quinoa: rinse → 1:1.25 water → High Pressure 1 min → Natural release 10 min.",
      "Cool, portion into 1-cup containers. Refrigerate 4–5 days or freeze."
    ]
  }
];


const WEEKLY_ROTATION = {
  prepDay:"Sunday (or Monday if Sunday is a shift)",
  batchSteps:[
    "Cook: Instant Pot Salsa Chicken (8 servings).",
    "Cook: Rice + Quinoa batch (10 servings total).",
    "Bake: Sheet-pan Egg & Veggie Bake (6 servings).",
    "Optional: Instant Pot Turkey Chili (8 servings).",
    "Wash/chop: veggies + fruit (grab-and-go).",
    "Pack: 2–3 ‘go bags’ in fridge (protein + carb + fruit)."
  ],
  dinners:[
    {day:"Mon", meal:"Salmon + rice/quinoa + veg"},
    {day:"Tue", meal:"Turkey chili night (family pot)"},
    {day:"Wed", meal:"Salsa chicken tacos/bowls (fast after a double)"},
    {day:"Thu", meal:"Sheet-pan chicken/veg + rice (or leftovers)"},
    {day:"Fri", meal:"Salmon leftovers or quick protein bowls before shift"},
    {day:"Sat", meal:"Family choice (keep protein first)"},
    {day:"Sun", meal:"Shift-friendly: chili or chicken bowl packed"}
  ],
  grabAndGo:[
    "Protein shake + banana",
    "Greek yogurt + berries",
    "Jerky + fruit",
    "Hard boiled eggs + apples",
    "Tuna packet + rice cup"
  ],
  weeklyShop:[
    "Chicken breast/thighs (3 lb)",
    "Salmon fillets (4–6 portions)",
    "Lean ground turkey (2 lb)",
    "Eggs (2 dozen)",
    "Greek yogurt / cottage cheese",
    "Salsa + crushed tomatoes + beans",
    "Rice + quinoa",
    "Frozen broccoli/green beans",
    "Onions, peppers, spinach",
    "Fruit (bananas/berries/apples)",
    "Nuts or trail mix (portion-controlled)"
  ]
};

const MEAL_TEMPLATES = {
  hard:{
    title:"Hard Training Day (strength/intervals/ruck)",
    goal:{kcal:2200,p:180,c:210,f:70},
    plan:[
      {slot:"Breakfast", item:"Sheet-pan egg bake (1 square) + fruit"},
      {slot:"Lunch", item:"Salsa chicken bowl: chicken + rice/quinoa + veg"},
      {slot:"Snack", item:"Greek yogurt OR protein shake + nuts"},
      {slot:"Dinner", item:"Air fryer salmon + rice/quinoa + veg"},
      {slot:"Late/Shift snack", item:"Cottage cheese or shake (if needed) + water/electrolytes"}
    ]
  },
  easy:{
    title:"Easy / Recovery Day",
    goal:{kcal:2000,p:180,c:140,f:75},
    plan:[
      {slot:"Breakfast", item:"Eggs (3) + veggies + 1 slice toast OR egg bake"},
      {slot:"Lunch", item:"Turkey chili (1–1.5 cups) OR chicken salad bowl"},
      {slot:"Snack", item:"Protein shake OR jerky + fruit"},
      {slot:"Dinner", item:"Salmon or lean meat + big salad/veg + small rice/quinoa"},
      {slot:"Optional", item:"Herbal tea, magnesium in the evening (if you use it)"}
    ]
  }
};

function nutritionDayType(code){
  const s=(code||"").toLowerCase();
  if(s.includes("4x4") || s.includes("ruck") || s.includes("strength") || s.includes("p90x") || s.includes("insanity")) return "hard";
  if(s.includes("rest") || s.includes("recovery") || s.includes("mobility")) return "easy";
  // S&S days count as medium -> treat as hard for fueling unless you keep it truly easy.
  if(s.includes("s&s") || s.includes("simple & sinister")) return "hard";
  return "easy";
}

// Recovery routines (CastleFlexx + Chirp)
const RECOVERY_ROUTINES = [
  {
    id:"am_quick",
    name:"Quick AM Mobility (8 minutes)",
    gear:"CastleFlexx + Chirp wheel",
    steps:[
      {t:"1:00", what:"Nasal breathing + tall posture (reset ribs/pelvis)"},
      {t:"2:00", what:"CastleFlexx: calf/ankle dorsiflexion (each side 1:00) — toes pulled back in the foot hammock; keep neutral spine"},
      {t:"2:00", what:"CastleFlexx: hamstring stretch (each side 1:00) — hinge at hips, don’t round low back"},
      {t:"2:00", what:"Chirp: Back roll (10-inch or 12-inch) — align groove with spine, slow rolls 6–10 passes, stay relaxed"}
    ],
    notes:"Stop if sharp pain/tingling. Go gentle at first. (See Chirp 'Ways to use the wheel' + CastleFlexx 'toe dorsiflexion/foot hammock' details.)"
  },
  {
    id:"post_shift",
    name:"Post‑Shift Decompression (10 minutes)",
    gear:"Chirp wheels + CastleFlexx",
    steps:[
      {t:"3:00", what:"Chirp: back roll 10-inch (slow) + pause on tight spots"},
      {t:"2:00", what:"Chirp: neck support (6-inch or 4-inch) — ‘yes/no’ micro-movements"},
      {t:"3:00", what:"CastleFlexx: hip flexor / quad bias stretch (each side 1:30)"},
      {t:"2:00", what:"Box breathing 4‑4‑4‑4"}
    ]
  },
  {
    id:"ruck_ready",
    name:"Ruck‑Readiness (8 minutes)",
    gear:"CastleFlexx",
    steps:[
      {t:"2:00", what:"Foot/plantar fascia: toes back + ankle dorsiflexion (each side 1:00)"},
      {t:"2:00", what:"Calf stretch: straight knee (1:00) + bent knee (1:00) each side"},
      {t:"2:00", what:"Hamstring stretch (each side 1:00)"},
      {t:"2:00", what:"Glute/hip external rotation (figure‑4 on floor or seated) 1:00 each"}
    ]
  }
];

function assetUrl(rel){
  return new URL(rel, window.location.href).toString();
}

function fatal(message, err){
  const view=document.getElementById('view');
  const details = err ? (err.stack || err.toString()) : '';
  const href = window.location.href;
  view.innerHTML = `
    <section class="card errorbox">
      <div class="h1">App failed to load</div>
      <div class="small">${message}</div>
      <div class="h2">Quick checks</div>
      <ul class="list">
        <li>Confirm these URLs load (no 404): <span class="pill">/stone-tr-app/assets/plan.json</span> and <span class="pill">/stone-tr-app/assets/exercises.json</span></li>
        <li>Make sure <b>assets/</b> folder is uploaded at the same level as <b>index.html</b>.</li>
        <li>If you previously installed the app: remove it, clear site storage, then re-add.</li>
      </ul>
      <div class="h2">Location</div>
      <div class="code">${href}</div>
      ${details ? `<div class="h2">Error details</div><div class="code">${details.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}</div>`:''}
    </section>
  `;
  console.error('StoneTR fatal:', message, err);
}

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
normalizeStore();
function saveStore(){ localStorage.setItem(STORE_KEY, JSON.stringify(STORE)); }


function normalizeStore(){
  // Backward-compatible defaults for new features
  if(!STORE.nutrition) STORE.nutrition = {water:{}, waterGoalOz:100, calories:{}, calorieGoal:2100, macroGoal:{p:170,c:190,f:70}, foodLog:{}, shopping:{}, supplements:[], meds:[]};
  if(!STORE.nutrition.water) STORE.nutrition.water = {};
  if(!STORE.nutrition.calories) STORE.nutrition.calories = {};
  if(!STORE.nutrition.foodLog) STORE.nutrition.foodLog = {};
  if(!STORE.nutrition.shopping) STORE.nutrition.shopping = {};
  if(!Array.isArray(STORE.nutrition.supplements)) STORE.nutrition.supplements = [];
  if(!STORE.nutrition.suppPrefilled){
    // Optional starter list (edit/delete as you like)
    STORE.nutrition.supplements = STORE.nutrition.supplements.length ? STORE.nutrition.supplements : [
      {name:"Creatine monohydrate", dose:"3–5 g", time:"Daily (any time)"},
      {name:"Omega‑3 (fish oil)", dose:"Enough to give 1–2 g EPA+DHA", time:"With a meal"},
      {name:"Vitamin D3", dose:"1000–2000 IU (or per labs)", time:"With a meal"},
      {name:"Magnesium glycinate", dose:"200–400 mg", time:"Evening"},
      {name:"L‑theanine (optional)", dose:"100–200 mg", time:"With coffee (optional)"},
      {name:"Basic multivitamin (optional)", dose:"per label", time:"Morning"}
    ];
    STORE.nutrition.suppPrefilled = true;
  }
  if(!Array.isArray(STORE.nutrition.meds)) STORE.nutrition.meds = [];
  if(typeof STORE.nutrition.waterGoalOz!=="number") STORE.nutrition.waterGoalOz = 100;
  if(typeof STORE.nutrition.calorieGoal!=="number") STORE.nutrition.calorieGoal = 2100;
  if(!STORE.nutrition.macroGoal) STORE.nutrition.macroGoal = {p:170,c:190,f:70};
  // Per-day structures
  const d = STORE.focusDate || todayISO();
  if(!(d in STORE.nutrition.water)) STORE.nutrition.water[d] = {oz:0};
  if(!(d in STORE.nutrition.calories)) STORE.nutrition.calories[d] = {kcal:0,p:0,c:0,f:0};
  if(!(d in STORE.nutrition.foodLog)) STORE.nutrition.foodLog[d] = [];
  if(!(d in STORE.nutrition.shopping)) STORE.nutrition.shopping[d] = {};
}


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

function findExercisesForItem(itemText){
  if(!itemText) return [];
  const t = itemText.toLowerCase();
  const out = [];

  // Movement keyword → exercise name mapping
  const add = (name)=>{
    if(!name) return;
    if(!(EX && EX.exercises)) return;
    if((EX.exercises||[]).some(e=>e.name===name) && !out.includes(name)) out.push(name);
  };

  if(t.includes("norwegian 4x4")) add("Norwegian 4x4 (VO2max Intervals)");
  if(t.includes("kb swing") || t.includes("swings")) add("Kettlebell Swing (two-hand)");
  if(t.includes("get-up") || t.includes("get up") || t.includes("tgu")) add("Turkish Get-Up (TGU)");
  if(t.includes("push-up") || t.includes("pushups")) add("Push-up");
  if(t.includes("1-arm db row") || t.includes("db row") || t.includes("rows")) add("1-Arm DB Row");
  if(t.includes("floor press")) add("DB Floor Press");
  if(t.includes("goblet squat")) add("Goblet Squat (KB or DB)");
  if(t.includes("front squat")) add("DB Front Squat (or heavy goblet)");
  if(t.includes("db rdl") || t.includes("romanian deadlift") || t.includes("rdl")) add("DB Romanian Deadlift (RDL)");
  if(t.includes("push press")) add("DB Push Press");
  if(t.includes("pull-up") || t.includes("pull up") || t.includes("chin")) add("Pull-up (strict) + Progressions");

  if(t.includes("suitcase carry") || t.includes("farmer carry") || t.includes("farmer hold")) add("Farmer Carry / Suitcase Carry");
  if(t.includes("sandbag") && t.includes("carry")) add("Sandbag Bear-Hug Carry");
  if(t.includes("step-up") || t.includes("step ups")) add("Step-Up (weighted optional)");
  if(t.includes("burpee")) add("Burpee (scaled)");

  if(t.includes("plank") || t.includes("side plank") || t.includes("dead bug")) add("Plank / Side Plank / Dead Bug");

  if(t.includes("couch stretch")) add("Couch Stretch (Hip Flexor)");
  if(t.includes("open books") || t.includes("open book")) add("Open Book (Thoracic Rotation)");
  if(t.includes("calf") && t.includes("stretch")) add("Calf Stretch (Gastrocnemius/Soleus)");
  if(t.includes("breathing")) add("Breathing Reset (2 minutes)");
  if(t.includes("zone 2 ride") || (t.includes("easy ride") && t.includes("peloton"))) add("Peloton Zone 2 Ride (Aerobic Base)");
  if(t.includes("ruck")) add("Rucking (20 lb)");

  if(t.includes("castleflexx") || t.includes("castle flexx") || t.includes("castle flex")) add("CastleFlexx Routine (calves/hamstrings/hips)");
  if(t.includes("chirp")) add("Chirp Wheel Routine (T-spine extension)");

  return out;
}

function openExercisePicker(names, itemText){
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

  card.innerHTML = `
    <div class="row" style="justify-content:space-between">
      <div>
        <div class="h1" style="margin:0">Instructions</div>
        <div class="small">This workout line includes multiple movements. Pick one:</div>
      </div>
      <button class="ghost" id="closePick">Close</button>
    </div>
    <div class="small" style="margin-top:8px">${esc(itemText||"")}</div>
    <hr>
    <div class="checks">
      ${names.map(n=>`<button type="button" class="ghost pickEx" data-ex="${escAttr(n)}">${esc(n)}</button>`).join("")}
    </div>
  `;
  overlay.appendChild(card);
  document.body.appendChild(overlay);

  card.querySelector("#closePick").addEventListener("click", ()=>overlay.remove());
  overlay.addEventListener("click", (e)=>{ if(e.target===overlay) overlay.remove(); });

  card.querySelectorAll(".pickEx").forEach(b=>{
    b.addEventListener("click", ()=>{
      const exName = b.dataset.ex;
      overlay.remove();
      openExerciseModal(exName);
    });
  });
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
  const items = warmupFor(code) || [];
  if(items.length===0) return false;
  const state = STORE.warmups?.[dateISO] || {};
  return items.every((txt,i)=> !!(state[i] || state[txt]));
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
  const rows = items.map((txt,i)=>{
    const checked = (state[i] || state[txt]) ? "checked" : "";
    return `<label class="checkrow"><input type="checkbox" class="wu" data-date="${day.date}" data-idx="${i}" data-item="${escAttr(txt)}" ${checked}/> <span>${esc(txt)}</span></label>`;
  }).join("");
  return `
    <section class="card" id="warmupCard" data-date="${day.date}" data-code="${day.code}">
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
          <button type="button" class="btn secondary" id="wuAll" aria-label="Select all warm-up items">All</button>
          <button type="button" class="btn secondary" id="wuReset" aria-label="Reset warm-up checklist">Reset</button>
        </div>
      </div>
      <div class="checks">${rows}</div>
      <div class="small" style="margin-top:8px">Peloton classes include a warm-up, but still do 60–90 seconds of easy joint prep first. Run workouts already include a longer warm-up when specified.</div>
    </section>
  `;
}

async function init(){
  try{
    PLAN = await fetch(assetUrl(PLAN_URL), {cache:"no-cache"}).then(r=>{
      if(!r.ok) throw new Error(`Failed to load plan.json (HTTP ${r.status})`);
      return r.json();
    });
    EX = await fetch(assetUrl(EX_URL), {cache:"no-cache"}).then(r=>{
      if(!r.ok) throw new Error(`Failed to load exercises.json (HTTP ${r.status})`);
      return r.json();
    }).catch(()=>({exercises:[]}));
    registerSW();
    wireTabs();
    // exlink delegated (open mini instructions without leaving Today)
    // exlink delegated
    document.addEventListener("click", (e)=>{
      const btn = e.target && (e.target.closest ? e.target.closest(".exlink") : null);
      if(!btn) return;
      const item = btn.dataset.item || btn.textContent || "";
      const names = findExercisesForItem(item);
      if(!names.length) return;
      if(names.length===1) openExerciseModal(names[0]);
      else openExercisePicker(names, item);
    });

    // Warm-up delegated handlers (works even after re-render)
    // Warm-up delegated handlers
    document.addEventListener("click", (e)=>{
      const t = e.target;
      if(!t) return;
      if(t.id === "wuAll" || t.id === "wuReset"){
        const card = document.getElementById("warmupCard");
        if(!card) return;
        const date = card.dataset.date;
        const code = card.dataset.code;
        ensureWarmupKey(date);
        const items = warmupFor(code) || [];
        items.forEach((txt,i)=>{
          STORE.warmups[date][i] = (t.id === "wuAll");
          // also keep text key for backwards compat with old versions
          STORE.warmups[date][txt] = (t.id === "wuAll");
        });
        saveStore();
        // quick visual feedback
        const old = t.textContent;
        t.textContent = (t.id === "wuAll") ? "✓" : "↺";
        setTimeout(()=>{ t.textContent = old; }, 600);
        render("today");
      }
    });

    document.addEventListener("change", (e)=>{
      const t = e.target;
      if(!t || !t.classList || !t.classList.contains("wu")) return;
      const date = t.dataset.date;
      const idx = t.dataset.idx;
      const item = t.dataset.item;
      ensureWarmupKey(date);
      if(idx !== undefined && idx !== null){
        STORE.warmups[date][idx] = t.checked;
      }
      if(item){
        STORE.warmups[date][item] = t.checked; // backwards compat
      }
      saveStore();
      render("today");
    });

    render("today");
    blankScreenWatchdog();
    document.getElementById("exportBtn").addEventListener("click", exportData);
    document.getElementById("importFile").addEventListener("change", importData);
  }catch(err){
    try{ registerSW(); }catch{}
    fatal("Could not load required assets. This is usually a GitHub Pages folder/path issue or an old cached Service Worker.", err);
  }
}
function registerSW(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./service-worker.js?v=20260222021252").catch(()=>{});
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
  return `<ul class="list">${items.map(i=>{
    const matches = findExercisesForItem(i);
    if(matches && matches.length){
      // Store the full item text; click handler decides whether to open one modal or a picker.
      return `<li><button type="button" class="exlink" data-item="${escAttr(i)}">${esc(i)}</button></li>`;
    }
    return `<li>${esc(i)}</li>`;
  }).join("")}</ul>`;
}

function render(tab){
  const view=document.getElementById("view");
  if(tab==="today") view.innerHTML = renderToday();
  if(tab==="calendar") view.innerHTML = renderCalendar();
  if(tab==="log") view.innerHTML = renderLogs();
  if(tab==="nutrition") view.innerHTML = renderNutrition();
  if(tab==="recovery") view.innerHTML = renderRecovery();
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
  const warmupComplete = warmupDoneForDate(day.date, day.code) || isShielded('warmup', day.date);

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
        <span class="pill">Build ${BUILD_ID}</span>
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
        <label class="pill">Program:
          <select id="choice">${opt}</select>
        </label>
        ${tiredBtn}
      </div>
      <details class="card" style="margin-top:10px">
        <summary class="ghost" id="moreOptsSummary">More options</summary>
        <div class="row" style="margin-top:10px">
          <label class="pill">RPE (1-10): <input id="rpe" aria-label="RPE 1 to 10" value="${escAttr(STORE.rpe[day.date]||"")}" style="width:70px"/></label>
          <button type="button" class="btn secondary" id="jumpLogs">Open Logs</button>
        </div>
      </details>

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
      <textarea id="notes" aria-label="Workout notes" placeholder="How did it feel? Anything to adjust?">${esc(STORE.notes[day.date]||"")}</textarea>

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
      <div class="row" style="justify-content:space-between;align-items:center">
        <div>
          <div class="h2" style="margin:0">Start here (30 sec)</div>
          <div class="small">1) Pick GOOD/BETTER/BEST • 2) Warm-up checklist • 3) Do the work</div>
        </div>
        <button type="button" class="btn" id="ctaStart">${warmupComplete ? "Start workout" : "Start warm-up"}</button>
      </div>
      <div class="small" style="margin-top:8px">${warmupComplete ? "Warm-up complete. Hit the workout and keep the streak alive." : "Knock out the warm-up first—fast win and protects joints."}</div>
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


function ensureNutritionDay(dateISO){
  if(!STORE.nutrition) normalizeStore();
  if(!(dateISO in STORE.nutrition.water)) STORE.nutrition.water[dateISO] = {oz:0};
  if(!(dateISO in STORE.nutrition.calories)) STORE.nutrition.calories[dateISO] = {kcal:0,p:0,c:0,f:0};
  if(!(dateISO in STORE.nutrition.foodLog)) STORE.nutrition.foodLog[dateISO] = [];
  if(!(dateISO in STORE.nutrition.shopping)) STORE.nutrition.shopping[dateISO] = {};
}

function renderNutrition(){
  const f = STORE.focusDate || todayISO();
  ensureNutritionDay(f);
  const day = (PLAN?.days || []).find(d=>d.date===f);
  const code = day?.code || "";
  const t = MEAL_TEMPLATES[nutritionDayType(code)] || MEAL_TEMPLATES.easy;
  const w = STORE.nutrition.water[f]?.oz || 0;
  const wg = STORE.nutrition.waterGoalOz || 100;
  const cal = STORE.nutrition.calories[f] || {kcal:0,p:0,c:0,f:0};
  const cg = STORE.nutrition.calorieGoal || t.goal.kcal;
  const mg = STORE.nutrition.macroGoal || t.goal;

  const log = STORE.nutrition.foodLog[f] || [];
  const logRows = log.map((it,idx)=>`
    <tr>
      <td class="small">${esc(it.time||"")}</td>
      <td>${esc(it.name||"")}</td>
      <td class="right">${esc(it.kcal||0)}</td>
      <td class="right small">${esc(it.p||0)}/${esc(it.c||0)}/${esc(it.f||0)}</td>
      <td class="right"><button class="mini danger" data-action="foodDel" data-idx="${idx}">✕</button></td>
    </tr>`).join("");

  const recipeCards = RECIPES.map(r=>`
    <div class="card">
      <div class="row between">
        <div>
          <div class="h2">${esc(r.name)}</div>
          <div class="small">${r.tags.map(t=>`<span class="pill">${esc(t)}</span>`).join(" ")}</div>
          <div class="small">Per serving: <b>${r.per.kcal} kcal</b> • P/C/F ${r.per.p}/${r.per.c}/${r.per.f}</div>
        </div>
        <div class="col" style="gap:8px;align-items:flex-end">
          <button class="mini" data-action="recipeToggle" data-id="${escAttr(r.id)}">View</button>
          <button class="mini" data-action="recipeLog" data-id="${escAttr(r.id)}">Log 1</button>
          <button class="mini" data-action="recipeShop" data-id="${escAttr(r.id)}">Add to list</button>
        </div>
      </div>
      <div class="recipeBody hidden" id="recipe_${escAttr(r.id)}">
        <div class="h3">Ingredients</div>
        <ul class="list">${r.ingredients.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        <div class="h3">Steps</div>
        <ol class="list">${r.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
        ${r.uses?`<div class="h3">Use it for</div><ul class="list">${r.uses.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
      </div>
    </div>
  `).join("");

  const shop = STORE.nutrition.shopping[f] || {};
  const shopItems = Object.keys(shop);
  const shopListHtml = shopItems.length ? shopItems.map(item=>`
    <label class="checkrow">
      <input type="checkbox" data-action="shopToggle" data-item="${escAttr(item)}" ${shop[item]?"checked":""}/>
      <span>${esc(item)}</span>
    </label>`).join("") : `<div class="small">No items yet. Tap “Add to list” on a recipe or add items below.</div>`;

  return `
  <section class="card">
    <div class="row between">
      <div>
        <div class="h1">Nutrition</div>
        <div class="small">Date: <b>${esc(fmtDate(f))}</b> • Plan: <span class="pill">${esc(code||"—")}</span></div>
      </div>
      <div class="pill">Build ${esc(BUILD_ID)}</div>
    </div>
  </section>

  <section class="grid2">
    <div class="card">
      <div class="h2">Water</div>
      <div class="small">Goal: <b>${wg} oz</b> (edit below)</div>
      <div class="progress"><div class="bar" style="width:${Math.min(100, Math.round((w/wg)*100))}%"></div></div>
      <div class="row between">
        <div class="big">${w} oz</div>
        <div class="small">${Math.round((w/wg)*100)}%</div>
      </div>
      <div class="row wrap" style="gap:8px;margin-top:8px">
        <button class="mini" data-action="waterAdd" data-oz="8">+8</button>
        <button class="mini" data-action="waterAdd" data-oz="16">+16</button>
        <button class="mini" data-action="waterAdd" data-oz="24">+24</button>
        <button class="mini danger" data-action="waterReset">Reset</button>
      </div>
      <div class="row" style="gap:8px;margin-top:10px">
        <label class="small">Goal oz</label>
        <input id="waterGoal" class="inp" type="number" min="40" max="200" value="${wg}" />
        <button class="mini" data-action="waterSaveGoal">Save</button>
      </div>
      <div class="small" style="margin-top:8px">Tip: On ruck days, add electrolytes if you’re sweating heavily.</div>
    </div>

    <div class="card">
      <div class="h2">Calories & Macros</div>
      <div class="small">Goal: <b>${cg} kcal</b> • Macro goal P/C/F: <b>${mg.p}/${mg.c}/${mg.f}</b></div>
      <div class="progress"><div class="bar" style="width:${Math.min(100, Math.round((cal.kcal/cg)*100))}%"></div></div>
      <div class="row between">
        <div class="big">${cal.kcal} kcal</div>
        <div class="small">P/C/F ${cal.p}/${cal.c}/${cal.f}</div>
      </div>
      <div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap">
        <input id="foodName" class="inp" placeholder="Food (e.g., shake, chicken bowl)" />
        <input id="foodKcal" class="inp" type="number" placeholder="kcal" style="width:90px"/>
        <input id="foodP" class="inp" type="number" placeholder="P" style="width:70px"/>
        <input id="foodC" class="inp" type="number" placeholder="C" style="width:70px"/>
        <input id="foodF" class="inp" type="number" placeholder="F" style="width:70px"/>
        <button class="mini" data-action="foodAdd">Add</button>
        <button class="mini danger" data-action="foodClear">Clear day</button>
      </div>
      <div class="small" style="margin-top:8px">Shortcut: tap “Log 1” on a recipe to auto-add macros.</div>
    </div>
  </section>

  <section class="card">
    <div class="h2">Today’s simple plan</div>
    <div class="small">${esc(t.title)} • Suggested goal: <b>${t.goal.kcal} kcal</b> • P/C/F <b>${t.goal.p}/${t.goal.c}/${t.goal.f}</b></div>
    <table class="tbl" style="margin-top:10px">
      <thead><tr><th>Slot</th><th>Meal</th></tr></thead>
      <tbody>${t.plan.map(x=>`<tr><td class="small">${esc(x.slot)}</td><td>${esc(x.item)}</td></tr>`).join("")}</tbody>
    </table>
  </section>

  <section class="card">
    <div class="h2">Food log</div>
    <table class="tbl">
      <thead><tr><th class="small">Time</th><th>Item</th><th class="right">kcal</th><th class="right small">P/C/F</th><th></th></tr></thead>
      <tbody>${logRows || `<tr><td colspan="5" class="small">No entries yet.</td></tr>`}</tbody>
    </table>
  </section>

  <section class="card">
    <div class="h2">Shopping list (today)</div>
    <div class="small">Tap a recipe’s “Add to list” button, or add your own item.</div>
    <div class="shopbox">${shopListHtml}</div>
    <div class="row" style="gap:8px;margin-top:10px">
      <input id="shopAddTxt" class="inp" placeholder="Add item (e.g., salmon, eggs, salsa)" />
      <button class="mini" data-action="shopAdd">Add</button>
      <button class="mini danger" data-action="shopClearChecked">Clear checked</button>
    </div>
  </section>

  <section class="card">
    <div class="h2">Supplements & meds (quick list)</div>
    <div class="small">This is a private list stored only on this device (LocalStorage). Always confirm with your clinician/pharmacist if you’re on prescriptions.</div>
    <div class="grid2" style="margin-top:10px">
      <div class="card" style="margin:0">
        <div class="h3">Supplements</div>
        <div id="suppList">${(STORE.nutrition.supplements||[]).map((s,idx)=>`
          <div class="row between">
            <div><b>${esc(s.name||"")}</b> <span class="small">${esc(s.dose||"")}</span><div class="small">${esc(s.time||"")}</div></div>
            <button class="mini danger" data-action="suppDel" data-idx="${idx}">✕</button>
          </div>`).join("") || `<div class="small">None yet.</div>`}
        </div>
        <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">
          <input id="suppName" class="inp" placeholder="Name (e.g., creatine, fish oil)" />
          <input id="suppDose" class="inp" placeholder="Dose" style="width:110px"/>
          <input id="suppTime" class="inp" placeholder="Timing" style="width:120px"/>
          <button class="mini" data-action="suppAdd">Add</button>
        </div>
      </div>
      <div class="card" style="margin:0">
        <div class="h3">Meds</div>
        <div id="medList">${(STORE.nutrition.meds||[]).map((s,idx)=>`
          <div class="row between">
            <div><b>${esc(s.name||"")}</b> <span class="small">${esc(s.dose||"")}</span><div class="small">${esc(s.time||"")}</div></div>
            <button class="mini danger" data-action="medDel" data-idx="${idx}">✕</button>
          </div>`).join("") || `<div class="small">None yet.</div>`}
        </div>
        <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap">
          <input id="medName" class="inp" placeholder="Medication name" />
          <input id="medDose" class="inp" placeholder="Dose" style="width:110px"/>
          <input id="medTime" class="inp" placeholder="Time" style="width:120px"/>
          <button class="mini" data-action="medAdd">Add</button>
        </div>
      </div>
    </div>
  </section>

  
  <section class="card">
    <details>
      <summary class="h2">Weekly rotation (simple & repeatable)</summary>
      <div class="small" style="margin-top:8px">Prep day: <b>${esc(WEEKLY_ROTATION.prepDay)}</b></div>
      <div class="h3">Batch prep checklist</div>
      <ul class="list">${WEEKLY_ROTATION.batchSteps.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      <div class="h3">Dinners</div>
      <table class="tbl">
        <thead><tr><th>Day</th><th>Plan</th></tr></thead>
        <tbody>${WEEKLY_ROTATION.dinners.map(x=>`<tr><td class="small">${esc(x.day)}</td><td>${esc(x.meal)}</td></tr>`).join("")}</tbody>
      </table>
      <div class="h3">Grab‑and‑go options</div>
      <ul class="list">${WEEKLY_ROTATION.grabAndGo.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      <div class="h3">Master shopping list</div>
      <div class="row wrap" style="gap:8px;margin-top:6px">
        <button class="mini" data-action="shopAddWeekly">Add all to today’s list</button>
      </div>
      <ul class="list">${WEEKLY_ROTATION.weeklyShop.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
    </details>
  </section>

<section class="card">
    <div class="h2">Recipes (offline)</div>
    <div class="small">These are built-in so you can use the app without internet.</div>
    <div class="stack" style="margin-top:10px">${recipeCards}</div>
  </section>
  `;
}

function renderRecovery(){
  const list = RECOVERY_ROUTINES.map(r=>`
    <div class="card">
      <div class="row between">
        <div>
          <div class="h2">${esc(r.name)}</div>
          <div class="small">Gear: ${esc(r.gear||"")}</div>
        </div>
        <button class="mini" data-action="routineToggle" data-id="${escAttr(r.id)}">Checklist</button>
      </div>
      <div class="routineBody hidden" id="routine_${escAttr(r.id)}">
        <div class="small" style="margin-top:8px">${esc(r.notes||"")}</div>
        <div class="h3">Steps</div>
        <div class="checklist">
          ${r.steps.map((s,idx)=>`
            <label class="checkrow">
              <input type="checkbox" data-action="routineCheck" data-r="${escAttr(r.id)}" data-i="${idx}"/>
              <span><b class="pill">${esc(s.t)}</b> ${esc(s.what)}</span>
            </label>`).join("")}
        </div>
      </div>
    </div>
  `).join("");

  return `
    <section class="card">
      <div class="row between">
        <div>
          <div class="h1">Recovery</div>
          <div class="small">CastleFlexx + Chirp wheel routines (offline)</div>
        </div>
        <div class="pill">Build ${esc(BUILD_ID)}</div>
      </div>
      <div class="small" style="margin-top:8px">If you get sharp pain, numbness/tingling, or symptoms that feel “nerve-y,” stop and reset to gentler positions.</div>
    </section>
    <section class="stack">${list}</section>
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
    // Primary CTA (Start warm-up / Start workout)
    const cta = document.getElementById("ctaStart");
    if(cta){
      cta.addEventListener("click", ()=>{
        const wuDone = warmupDoneForDate(day.date, day.code) || isShielded("warmup", day.date);
        if(!wuDone){
          const el = document.getElementById("warmupCard");
          if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
        }else{
          const el = document.getElementById("goodSection") || document.getElementById("workoutCard");
          if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
        }
      });
    }

    ensureWarmupKey(day.date); // warm-up checklist state
    ensureShieldState();       // streak shield state

    // Warm-up checklist wiring (handled by delegated handlers)
    document.querySelectorAll(".wu").forEach(cb=>{
      cb.addEventListener("change", ()=>{
        const item = cb.dataset.item;
        STORE.warmups[day.date][item] = cb.checked;
        saveStore();
        render("today");
      });
    });

    // Warm-up quick buttons
    const wuAll = document.getElementById("wuAll");
    const wuReset = document.getElementById("wuReset");
    if(wuAll){
      wuAll.addEventListener("click", ()=>{
        (warmupFor(day.code)||[]).forEach(it=>{ STORE.warmups[day.date][it] = true; });
        saveStore();
        render("today");
      });
    }
    if(wuReset){
      wuReset.addEventListener("click", ()=>{
        (warmupFor(day.code)||[]).forEach(it=>{ STORE.warmups[day.date][it] = false; });
        saveStore();
        render("today");
      });
    }

    // Streak shield buttons (only visible when applicable)
    const bSW = document.getElementById("useShieldW");
    const bSWU = document.getElementById("useShieldWU");
    const bUSW = document.getElementById("undoShieldW");
    const bUSWU = document.getElementById("undoShieldWU");
    if(bSW){ bSW.addEventListener("click", ()=>{ applyShield("workout", day.date); render("today"); }); }
    if(bSWU){ bSWU.addEventListener("click", ()=>{ applyShield("warmup", day.date); render("today"); }); }
    if(bUSW){ bUSW.addEventListener("click", ()=>{ clearShield("workout", day.date); render("today"); }); }
    if(bUSWU){ bUSWU.addEventListener("click", ()=>{ clearShield("warmup", day.date); render("today"); }); }


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

    
    const jumpLogsBtn = document.getElementById("jumpLogs");
    if(jumpLogsBtn){
      jumpLogsBtn.addEventListener("click", ()=>{
        document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
        const t = document.querySelector('[data-tab="log"]');
        if(t){ t.classList.add("active"); }
        render("log");
      });
    }
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

  if(tab==="nutrition"){
    const f = STORE.focusDate || todayISO();
    ensureNutritionDay(f);

    // Water
    document.querySelectorAll('[data-action="waterAdd"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const oz = parseInt(b.dataset.oz||"0",10);
        STORE.nutrition.water[f].oz = (STORE.nutrition.water[f].oz||0) + oz;
        saveStore(); render("nutrition");
      });
    });
    const wreset=document.querySelector('[data-action="waterReset"]');
    if(wreset) wreset.addEventListener("click", ()=>{ STORE.nutrition.water[f].oz=0; saveStore(); render("nutrition"); });
    const wsave=document.querySelector('[data-action="waterSaveGoal"]');
    if(wsave) wsave.addEventListener("click", ()=>{
      const v = parseInt(document.getElementById("waterGoal").value||"0",10);
      if(v>0){ STORE.nutrition.waterGoalOz=v; saveStore(); render("nutrition"); }
    });

    // Food add
    const addBtn=document.querySelector('[data-action="foodAdd"]');
    if(addBtn) addBtn.addEventListener("click", ()=>{
      const name=document.getElementById("foodName").value.trim();
      const kcal=parseInt(document.getElementById("foodKcal").value||"0",10);
      const p=parseInt(document.getElementById("foodP").value||"0",10);
      const c=parseInt(document.getElementById("foodC").value||"0",10);
      const fat=parseInt(document.getElementById("foodF").value||"0",10);
      if(!name) return;
      STORE.nutrition.foodLog[f].push({time:new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}), name, kcal, p, c, f:fat});
      const day = STORE.nutrition.calories[f];
      day.kcal += kcal; day.p += p; day.c += c; day.f += fat;
      saveStore(); render("nutrition");
    });
    const clearBtn=document.querySelector('[data-action="foodClear"]');
    if(clearBtn) clearBtn.addEventListener("click", ()=>{
      if(!confirm("Clear today's calorie totals and food log?")) return;
      STORE.nutrition.foodLog[f]=[];
      STORE.nutrition.calories[f]={kcal:0,p:0,c:0,f:0};
      saveStore(); render("nutrition");
    });

    // Food delete
    document.querySelectorAll('[data-action="foodDel"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const idx=parseInt(b.dataset.idx,10);
        const it=STORE.nutrition.foodLog[f][idx];
        if(!it) return;
        STORE.nutrition.foodLog[f].splice(idx,1);
        const day=STORE.nutrition.calories[f];
        day.kcal -= (it.kcal||0); day.p -= (it.p||0); day.c -= (it.c||0); day.f -= (it.f||0);
        saveStore(); render("nutrition");
      });
    });

    // Recipes: toggle/log/shop
    document.querySelectorAll('[data-action="recipeToggle"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const id=b.dataset.id;
        const el=document.getElementById("recipe_"+id);
        if(el) el.classList.toggle("hidden");
      });
    });
    document.querySelectorAll('[data-action="recipeLog"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const id=b.dataset.id;
        const r=RECIPES.find(x=>x.id===id);
        if(!r) return;
        STORE.nutrition.foodLog[f].push({time:new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}), name:r.name, kcal:r.per.kcal, p:r.per.p, c:r.per.c, f:r.per.f});
        const day=STORE.nutrition.calories[f];
        day.kcal += r.per.kcal; day.p += r.per.p; day.c += r.per.c; day.f += r.per.f;
        saveStore(); render("nutrition");
      });
    });
    document.querySelectorAll('[data-action="recipeShop"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const id=b.dataset.id;
        const r=RECIPES.find(x=>x.id===id);
        if(!r) return;
        r.ingredients.forEach(line=>{
          const base=line.replace(/^\d+[\w\s\-\/]*\s+/,'').trim();
          if(base.length<2) return;
          if(!(base in STORE.nutrition.shopping[f])) STORE.nutrition.shopping[f][base]=false;
        });
        saveStore(); render("nutrition");
      });
    });

    // Shopping
    document.querySelectorAll('[data-action="shopToggle"]').forEach(cb=>{
      cb.addEventListener("change", ()=>{
        const item=cb.dataset.item;
        STORE.nutrition.shopping[f][item]=cb.checked;
        saveStore();
      });
    });
    const shopAdd=document.querySelector('[data-action="shopAdd"]');
    if(shopAdd) shopAdd.addEventListener("click", ()=>{
      const t=document.getElementById("shopAddTxt").value.trim();
      if(!t) return;
      STORE.nutrition.shopping[f][t]=false;
      saveStore(); render("nutrition");
    });
    const shopClear=document.querySelector('[data-action="shopClearChecked"]');
    if(shopClear) shopClear.addEventListener("click", ()=>{
      const items=STORE.nutrition.shopping[f]||{};
      Object.keys(items).forEach(k=>{ if(items[k]) delete items[k]; });
      saveStore(); render("nutrition");
    });

    // Supplements / meds
    const suppAdd=document.querySelector('[data-action="suppAdd"]');
    if(suppAdd) suppAdd.addEventListener("click", ()=>{
      const name=document.getElementById("suppName").value.trim();
      if(!name) return;
      STORE.nutrition.supplements.push({name, dose:document.getElementById("suppDose").value.trim(), time:document.getElementById("suppTime").value.trim()});
      saveStore(); render("nutrition");
    });
    document.querySelectorAll('[data-action="suppDel"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const idx=parseInt(b.dataset.idx,10);
        STORE.nutrition.supplements.splice(idx,1);
        saveStore(); render("nutrition");
      });
    });
    const medAdd=document.querySelector('[data-action="medAdd"]');
    if(medAdd) medAdd.addEventListener("click", ()=>{
      const name=document.getElementById("medName").value.trim();
      if(!name) return;
      STORE.nutrition.meds.push({name, dose:document.getElementById("medDose").value.trim(), time:document.getElementById("medTime").value.trim()});
      saveStore(); render("nutrition");
    });
    document.querySelectorAll('[data-action="medDel"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const idx=parseInt(b.dataset.idx,10);
        STORE.nutrition.meds.splice(idx,1);
        saveStore(); render("nutrition");
      });
    });
  }

  if(tab==="recovery"){
    document.querySelectorAll('[data-action="routineToggle"]').forEach(b=>{
      b.addEventListener("click", ()=>{
        const id=b.dataset.id;
        const el=document.getElementById("routine_"+id);
        if(el) el.classList.toggle("hidden");
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



// ===== Global streak helpers (workout + warm-up) + Streak Shield =====
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
  const items = warmupFor(code) || [];
  if(items.length===0) return false;
  const state = STORE.warmups?.[dateISO] || {};
  return items.every(it => !!state[it]);
}
function calcStreaksForType(type, dateISO){
  const days = (PLAN?.days || []);
  const dates = days.map(d=>d.date);
  ensureShieldState();

  const doneArr = days.map(d=>{
    if(type==="workout") return !!STORE.done?.[d.date] || isShielded("workout", d.date);
    return warmupDoneForDate(d.date, d.code) || isShielded("warmup", d.date);
  });

  let longest=0, run=0;
  for(const f of doneArr){
    if(f){ run++; longest=Math.max(longest, run); }
    else run=0;
  }

  const idx0 = dates.indexOf(dateISO);
  if(idx0 < 0) return { current: 0, longest, atRisk:false, canShield:false, shieldedToday:false, usedThisMonth:0 };

  let idx = idx0;
  let atRisk = false;

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
// ===== End streak helpers =====
