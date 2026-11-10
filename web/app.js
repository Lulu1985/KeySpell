/* KeySpell · 代码打字练习
   纯静态实现，无任何依赖。状态保存在 localStorage。 */

const STORE_KEY = "keyspell.v1";
const SOUND_CACHE = {};

const $ = (id) => document.getElementById(id);
const els = {
  home: $("homeView"),
  practice: $("practiceView"),
  grid: $("moduleGrid"),
  brandKicker: $("brandKicker"),
  brandLang: $("brandLang"),
  logoMark: $("logoMark"),
  soundBtn: $("soundBtn"),
  statModules: $("statModules"),
  statWords: $("statWords"),
  statMastered: $("statMastered"),
  statBest: $("statBest"),
  statToday: $("statToday"),
  practiceModuleName: $("practiceModuleName"),
  targetModuleHint: $("targetModuleHint"),
  targetCard: $("targetCard"),
  targetWord: $("targetWord"),
  targetPreview: $("targetPreview"),
  progressFill: $("progressFill"),
  starTrack: $("starTrack"),
  sparkleLayer: $("sparkleLayer"),
  keyboard: $("keyboard"),
  typeInput: $("typeInput"),
  statTime: $("statTime"),
  statWpm: $("statWpm"),
  statAcc: $("statAcc"),
  statCombo: $("statCombo"),
  backBtn: $("backBtn"),
  resultModal: $("resultModal"),
  resultModule: $("resultModule"),
  resTime: $("resTime"),
  resWpm: $("resWpm"),
  resAcc: $("resAcc"),
  resCombo: $("resCombo"),
  resultStars: $("resultStars"),
  resultPraise: $("resultPraise"),
  againBtn: $("againBtn"),
  doneBtn: $("doneBtn"),
  toast: $("toast"),
  toastText: $("toastText")
};

let lang = "python";
let session = null;
let tickTimer = null;
let composing = false;
let lastModuleId = null;
let toastTimer = null;
let audioCtx = null;
let lastKeyTs = 0;

/* ---------------- 本地存储 ---------------- */

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

function blankProfile() {
  return {
    best: 0,
    rounds: 0,
    today: { date: todayStr(), count: 0 },
    modules: {}
  };
}

function normalizeStore(parsed) {
  const base = { sound: true, python: blankProfile(), cpp: blankProfile() };
  if (!parsed || typeof parsed !== "object") return base;
  const merge = (a, b) => Object.assign({}, a, b || {});
  return {
    sound: parsed.sound !== false,
    python: merge(blankProfile(), parsed.python),
    cpp: merge(blankProfile(), parsed.cpp)
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? normalizeStore(JSON.parse(raw)) : normalizeStore(null);
  } catch (e) {
    return normalizeStore(null);
  }
}

const store = loadStore();

/* 桌面版经由 pywebview 桥写入 sqlite；网页版自动回落到 localStorage */
function desktopBridge() {
  const api = window.pywebview && window.pywebview.api;
  return api && typeof api.save_state === "function" ? api : null;
}

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch (e) {
    /* 隐私模式下忽略 */
  }
  const api = desktopBridge();
  if (api) {
    try {
      api.save_state(JSON.stringify(store));
    } catch (e) {
      /* 数据库不可用时继续使用本地缓存 */
    }
  }
}

let restored = false;

async function restoreFromDesktop() {
  if (restored) return;
  restored = true;
  const api = desktopBridge();
  if (!api || typeof api.load_state !== "function") return;
  try {
    const raw = await api.load_state();
    if (!raw) return;
    const next = normalizeStore(JSON.parse(raw));
    store.sound = next.sound;
    store.python = next.python;
    store.cpp = next.cpp;
    updateSoundBtn();
    renderHome();
  } catch (e) {
    /* 数据库读取失败时沿用本地缓存 */
  }
}

function profile() {
  const p = store[lang];
  if (!p.today || p.today.date !== todayStr()) {
    p.today = { date: todayStr(), count: 0 };
    saveStore();
  }
  return p;
}

function moduleStat(id) {
  const p = profile();
  if (!p.modules[id]) p.modules[id] = { attempts: 0, mastered: false, best: 0 };
  return p.modules[id];
}

/* ---------------- 音效 ---------------- */

function playSound(type) {
  if (!store.sound) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const map = {
      tap: { f: 660, d: 0.035, v: 0.035 },
      ok: { f: 900, d: 0.045, v: 0.04 },
      err: { f: 190, d: 0.1, v: 0.05 },
      skip: { f: 460, d: 0.07, v: 0.035 },
      done: { f: 1200, d: 0.16, v: 0.05 }
    };
    const cfg = map[type] || map.tap;
    osc.type = type === "err" ? "square" : "triangle";
    osc.frequency.setValueAtTime(cfg.f, t);
    if (type === "done") osc.frequency.exponentialRampToValueAtTime(700, t + cfg.d);
    gain.gain.setValueAtTime(cfg.v, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + cfg.d);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(t);
    osc.stop(t + cfg.d + 0.02);
  } catch (e) {
    /* 忽略音频错误 */
  }
}

/* ---------------- 通用工具 ---------------- */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fmt(n) {
  return Number(n).toFixed(1);
}

function showToast(msg, kind) {
  els.toastText.textContent = msg;
  els.toast.classList.toggle("is-error", kind === "error");
  els.toast.classList.add("is-show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("is-show"), 2600);
}

/* ---------------- 首页 ---------------- */

function moduleList() {
  return TYPING_DATA[lang].modules;
}

function renderBrand() {
  const meta = TYPING_DATA[lang];
  els.brandKicker.textContent = meta.kicker;
  els.brandLang.textContent = meta.label;
  els.logoMark.textContent = meta.logoMark;
  els.statModules.textContent = moduleList().length + " 组";
  document.body.dataset.lang = lang;
  document.title = meta.label + " 打字练习 · KeySpell";
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const on = btn.dataset.lang === lang;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", on ? "true" : "false");
  });
}

function renderHome() {
  renderBrand();
  const p = profile();
  const mods = moduleList();
  const totalWords = mods.reduce((sum, m) => sum + m.words.length, 0);
  const mastered = mods.filter((m) => (p.modules[m.name] || {}).mastered).length;

  els.statWords.textContent = totalWords + " 个";
  els.statMastered.textContent = mastered + " / " + mods.length;
  els.statBest.textContent = p.best ? p.best + " WPM" : "—";
  els.statToday.textContent = p.today.count + " 轮";

  els.grid.innerHTML = "";
  mods.forEach((mod, idx) => {
    const stat = p.modules[mod.name] || { attempts: 0, mastered: false, best: 0 };
    const card = document.createElement("button");
    card.type = "button";
    card.className = "module-card";
    card.dataset.id = mod.name;
    card.style.setProperty("--i", idx);
    card.innerHTML =
      '<span class="card-top">' +
        '<span class="group-no">GROUP ' + String(idx + 1).padStart(2, "0") + "</span>" +
        '<span class="card-icon tint-' + mod.tint + '">' + mod.icon + "</span>" +
      "</span>" +
      '<span class="card-title">' + mod.name + "</span>" +
      '<span class="card-meta">' +
        "<span>" + mod.words.length + " 词汇</span>" +
        '<span class="meta-dot">·</span>' +
        "<span>累计 " + stat.attempts + " 次</span>" +
        '<span class="tag ' + (stat.mastered ? "tag-done" : "") + '">' +
          (stat.mastered ? "已掌握" : "未开始") +
        "</span>" +
      "</span>";
    card.addEventListener("click", () => startSession(idx));
    els.grid.appendChild(card);
  });

  els.home.hidden = false;
  els.practice.hidden = true;
}

/* ---------------- 屏幕键盘 ---------------- */

const KEY_LAYOUT = [
  {
    row: [
      { id: "`", label: "`", sub: "~" }, { id: "1", label: "1", sub: "!" },
      { id: "2", label: "2", sub: "@" }, { id: "3", label: "3", sub: "#" },
      { id: "4", label: "4", sub: "$" }, { id: "5", label: "5", sub: "%" },
      { id: "6", label: "6", sub: "^" }, { id: "7", label: "7", sub: "&" },
      { id: "8", label: "8", sub: "*" }, { id: "9", label: "9", sub: "(" },
      { id: "0", label: "0", sub: ")" }, { id: "-", label: "-", sub: "_" },
      { id: "=", label: "=", sub: "+" }
    ]
  },
  {
    row: [
      { id: "q", label: "q", sub: "" }, { id: "w", label: "w", sub: "" },
      { id: "e", label: "e", sub: "" }, { id: "r", label: "r", sub: "" },
      { id: "t", label: "t", sub: "" }, { id: "y", label: "y", sub: "" },
      { id: "u", label: "u", sub: "" }, { id: "i", label: "i", sub: "" },
      { id: "o", label: "o", sub: "" }, { id: "p", label: "p", sub: "" },
      { id: "[", label: "[", sub: "{" }, { id: "]", label: "]", sub: "}" },
      { id: "\\", label: "\\", sub: "|" }
    ]
  },
  {
    row: [
      { id: "caps", label: "Caps", sub: "", wide: "wide-sm" },
      { id: "a", label: "a", sub: "" }, { id: "s", label: "s", sub: "" },
      { id: "d", label: "d", sub: "" }, { id: "f", label: "f", sub: "" },
      { id: "g", label: "g", sub: "" }, { id: "h", label: "h", sub: "" },
      { id: "j", label: "j", sub: "" }, { id: "k", label: "k", sub: "" },
      { id: "l", label: "l", sub: "" }, { id: ";", label: ";", sub: ":" },
      { id: "'", label: "'", sub: '"' },
      { id: "enter", label: "Enter", sub: "", wide: "wide-md" }
    ]
  },
  {
    row: [
      { id: "shift-l", label: "Shift", sub: "", wide: "wide-md" },
      { id: "z", label: "z", sub: "" }, { id: "x", label: "x", sub: "" },
      { id: "c", label: "c", sub: "" }, { id: "v", label: "v", sub: "" },
      { id: "b", label: "b", sub: "" }, { id: "n", label: "n", sub: "" },
      { id: "m", label: "m", sub: "" }, { id: ",", label: ",", sub: "<" },
      { id: ".", label: ".", sub: ">" }, { id: "/", label: "/", sub: "?" },
      { id: "shift-r", label: "Shift", sub: "", wide: "wide-md" }
    ]
  },
  {
    row: [
      { id: "tab", label: "Tab", sub: "", wide: "wide-md" },
      { id: "ctrl", label: "Ctrl", sub: "", wide: "wide-sm" },
      { id: "alt", label: "Alt", sub: "", wide: "wide-sm" },
      { id: "space", label: "空格", sub: "", wide: "wide-space" },
      { id: "alt2", label: "Alt", sub: "", wide: "wide-sm" },
      { id: "ctrl2", label: "Ctrl", sub: "", wide: "wide-sm" }
    ]
  }
];

const SHIFT_MAP = {
  "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7",
  "*": "8", "(": "9", ")": "0", "_": "-", "+": "=", "{": "[", "}": "]",
  "|": "\\", ":": ";", '"': "'", "<": ",", ">": ".", "?": "/", "~": "`"
};

function buildKeyboard() {
  els.keyboard.innerHTML = "";
  KEY_LAYOUT.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "kb-row";
    row.row.forEach((k) => {
      const key = document.createElement("div");
      key.className = "key" + (k.wide ? " " + k.wide : "");
      key.dataset.key = k.id;
      key.innerHTML =
        '<span class="k-sub">' + (k.sub || "&nbsp;") + "</span>" +
        '<span class="k-label">' + k.label + "</span>";
      rowEl.appendChild(key);
    });
    els.keyboard.appendChild(rowEl);
  });
}

function charToKey(ch) {
  if (ch === " ") return { key: "space", shift: false };
  if (ch === "\t") return { key: "tab", shift: false };
  const lower = ch.toLowerCase();
  if (lower >= "a" && lower <= "z") return { key: lower, shift: ch !== lower };
  if (SHIFT_MAP[ch]) return { key: SHIFT_MAP[ch], shift: true };
  return { key: ch, shift: false };
}

function highlightNextKey() {
  const keys = els.keyboard.querySelectorAll(".key");
  keys.forEach((k) => k.classList.remove("is-next"));
  if (!session || session.finished) return;
  const target = session.items[session.index];
  if (!target) return;
  const nextChar = target[session.buffer.length];
  if (!nextChar) return;
  const map = charToKey(nextChar);
  const el = els.keyboard.querySelector('[data-key="' + map.key + '"]');
  if (el) el.classList.add("is-next");
  if (map.shift) {
    els.keyboard.querySelector('[data-key="shift-l"]').classList.add("is-next");
    els.keyboard.querySelector('[data-key="shift-r"]').classList.add("is-next");
  }
}

function flashKey(ch) {
  if (!ch) return;
  const map = charToKey(ch);
  const key = els.keyboard.querySelector('[data-key="' + map.key + '"]');
  if (!key) return;
  key.classList.add("is-press");
  setTimeout(() => key.classList.remove("is-press"), 110);
}

/* ---------------- 练习流程 ---------------- */

function startSession(index) {
  const mod = moduleList()[index];
  lastModuleId = index;
  session = {
    moduleIndex: index,
    moduleName: mod.name,
    items: shuffle(mod.words),
    index: 0,
    buffer: [],
    keystrokes: 0,
    correctChars: 0,
    wrongChars: 0,
    combo: 0,
    maxCombo: 0,
    skipped: 0,
    startedAt: null,
    finished: false,
    pending: null,
    celebratedIndex: -1
  };

  els.home.hidden = true;
  els.practice.hidden = false;
  els.resultModal.hidden = true;
  els.practiceModuleName.textContent =
    String(index + 1).padStart(2, "0") + " · " + mod.name;
  els.targetModuleHint.textContent = mod.name;

  buildKeyboard();
  renderRound();
  startTick();
  setTimeout(() => els.typeInput.focus({ preventScroll: true }), 60);
  window.scrollTo({ top: 0 });
}

function currentTarget() {
  return session ? session.items[session.index] : "";
}

function renderRound() {
  if (!session) return;
  session.buffer = [];
  const target = currentTarget();
  els.targetPreview.textContent =
    session.items.slice(session.index + 1, session.index + 4).join("   ");
  renderWord();
  renderStats();
  highlightNextKey();
}

function renderWord() {
  if (!session) return;
  const target = currentTarget();
  els.targetWord.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = ch === " " ? "\u00a0" : ch;
    if (ch === " ") span.classList.add("is-space");
    if (i < session.buffer.length) {
      span.classList.add(session.buffer[i] === ch ? "is-ok" : "is-bad");
    } else if (i === session.buffer.length) {
      span.classList.add("is-cur");
    } else {
      span.classList.add("is-todo");
    }
    fragment.appendChild(span);
  }
  els.targetWord.appendChild(fragment);
  renderProgress();
}

function renderProgress() {
  if (!session) return;
  const target = currentTarget();
  const total = session.items.length;
  const done = session.index + Math.min(session.buffer.length, target.length) / target.length;
  const ratio = Math.min(1, done / total);
  els.progressFill.style.width = ratio * 100 + "%";
  updateStarTrack(ratio);
}

/* ---------------- 视觉鼓励（星星进度 / 粒子 / 夸赞） ---------------- */

const PRAISE_WORDS = [
  "太棒啦！", "好厉害！", "完美！", "★ 准确无误！",
  "喵～超顺滑！", "就是这样！", "闪闪发光！"
];

function updateStarTrack(ratio) {
  if (!els.starTrack) return;
  const stars = Array.from(els.starTrack.children);
  const lit = Math.max(0, Math.min(stars.length, Math.floor(ratio * stars.length + 1e-6)));
  stars.forEach((star, i) => {
    if (i < lit) {
      if (!star.classList.contains("is-lit")) star.classList.add("is-lit");
    } else {
      star.classList.remove("is-lit");
    }
  });
}

function spawnSparkles(x, y) {
  if (!els.sparkleLayer) return;
  const glyphs = ["★", "✦", "✧", "⭐", "✶"];
  for (let i = 0; i < 10; i++) {
    const sp = document.createElement("span");
    sp.className = "spark";
    sp.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 55 + Math.random() * 95;
    sp.style.left = x + "px";
    sp.style.top = y + "px";
    sp.style.fontSize = 14 + Math.random() * 12 + "px";
    sp.style.setProperty("--dx", (Math.cos(angle) * dist).toFixed(1) + "px");
    sp.style.setProperty("--dy", (Math.sin(angle) * dist - 45).toFixed(1) + "px");
    sp.style.setProperty("--sc", (0.6 + Math.random() * 0.8).toFixed(2));
    sp.style.setProperty("--rot", Math.round((Math.random() - 0.5) * 300) + "deg");
    els.sparkleLayer.appendChild(sp);
    setTimeout(() => sp.remove(), 1000);
  }
}

function showPraise(text, x, y) {
  const pop = document.createElement("div");
  pop.className = "praise-pop";
  pop.textContent = text;
  pop.style.left = x + "px";
  pop.style.top = y + "px";
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1200);
}

function celebrateWord() {
  if (!session || session.finished) return;
  if (session.celebratedIndex === session.index) return;
  session.celebratedIndex = session.index;
  if (els.practice.hidden) return;
  const rect = els.targetCard.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height * 0.42;
  spawnSparkles(x, y);
  let text = PRAISE_WORDS[Math.floor(Math.random() * PRAISE_WORDS.length)];
  if (session.combo > 0 && session.combo % 10 === 0) {
    text = "连击 " + session.combo + "！好厉害！";
  }
  showPraise(text, x, rect.top + 36);
}

function currentWpm() {
  if (!session || !session.startedAt) return 0;
  const minutes = (performance.now() - session.startedAt) / 60000;
  if (minutes <= 0) return 0;
  return Math.round((session.correctChars / 5) / minutes);
}

function currentAcc() {
  if (!session) return 100;
  const total = session.correctChars + session.wrongChars;
  if (!total) return 100;
  return Math.round((session.correctChars / total) * 100);
}

function renderStats() {
  if (!session) return;
  const elapsed = session.startedAt ? (performance.now() - session.startedAt) / 1000 : 0;
  els.statTime.textContent = fmt(elapsed) + "s";
  els.statWpm.textContent = currentWpm() + " WPM";
  els.statAcc.textContent = currentAcc() + "%";
  els.statCombo.textContent = session.combo;
}

function startTick() {
  stopTick();
  tickTimer = setInterval(() => {
    if (!session || session.finished) return;
    renderStats();
  }, 100);
}

function stopTick() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = null;
}

function handleChar(ch) {
  if (!session || session.finished || session.pending) return;
  if (ch === "\n" || ch === "\r") return;
  const target = currentTarget();
  if (!target || session.buffer.length >= target.length) return;
  if (!session.startedAt) session.startedAt = performance.now();

  const expected = target[session.buffer.length];
  session.keystrokes += 1;
  session.buffer.push(ch);
  flashKey(ch);

  if (ch === expected) {
    session.correctChars += 1;
    session.combo += 1;
    session.maxCombo = Math.max(session.maxCombo, session.combo);
    playSound("ok");
  } else {
    session.wrongChars += 1;
    session.combo = 0;
    playSound("err");
    els.targetCard.classList.add("is-shake");
    setTimeout(() => els.targetCard.classList.remove("is-shake"), 320);
  }

  renderWord();
  renderStats();
  highlightNextKey();

  if (session.buffer.length === target.length) {
    const perfect = session.buffer.every((c, i) => c === target[i]);
    if (perfect) {
      session.pending = setTimeout(() => {
        session.pending = null;
        celebrateWord();
        advance();
      }, 140);
    }
  }
}

function advance() {
  if (!session) return;
  session.index += 1;
  if (session.index >= session.items.length) {
    finishRound();
    return;
  }
  renderRound();
}

function skipWord() {
  if (!session || session.finished) return;
  if (session.pending) {
    clearTimeout(session.pending);
    session.pending = null;
  }
  session.skipped += 1;
  session.combo = 0;
  playSound("skip");
  advance();
}

function backspace() {
  if (!session || session.finished) return;
  if (session.buffer.length === 0) {
    return;
  }
  session.buffer.pop();
  playSound("tap");
  renderWord();
  highlightNextKey();
}

function submitWord() {
  if (!session || session.finished) return;
  const target = currentTarget();
  const joined = session.buffer.join("");
  if (joined === target) {
    if (session.pending) {
      clearTimeout(session.pending);
      session.pending = null;
    }
    playSound("ok");
    celebrateWord();
    advance();
  }
}

function finishRound() {
  if (!session || session.finished) return;
  session.finished = true;
  stopTick();

  const wpm = currentWpm();
  const acc = currentAcc();
  const elapsed = session.startedAt ? (performance.now() - session.startedAt) / 1000 : 0;
  const p = profile();
  const mod = p.modules[session.moduleName] || { attempts: 0, mastered: false, best: 0 };
  mod.attempts += 1;
  mod.mastered = true;
  mod.best = Math.max(mod.best, wpm);
  p.modules[session.moduleName] = mod;
  p.best = Math.max(p.best, wpm);
  p.rounds += 1;
  p.today.count += 1;
  saveStore();

  els.progressFill.style.width = "100%";
  updateStarTrack(1);
  renderResultStars(acc, wpm);
  els.targetWord.innerHTML = '<span class="target-done">✓</span>';
  els.targetPreview.textContent = "";
  playSound("done");

  els.resultModule.textContent = session.moduleName + " · 已完成 " + session.items.length + " 项";
  els.resTime.textContent = fmt(elapsed) + "s";
  els.resWpm.textContent = wpm + " WPM";
  els.resAcc.textContent = acc + "%";
  els.resCombo.textContent = session.maxCombo;
  els.resultModal.hidden = false;
  els.againBtn.focus({ preventScroll: true });
}

function renderResultStars(acc, wpm) {
  let stars = 1;
  if (acc >= 85 && session.correctChars > 0) stars = 2;
  if (acc >= 95 && wpm >= 25) stars = 3;
  if (els.resultStars) {
    Array.from(els.resultStars.children).forEach((node, i) => {
      node.classList.toggle("is-lit", i < stars);
    });
    els.resultStars.setAttribute("aria-label", "本轮获得 " + stars + " 颗星");
  }
  if (els.resultPraise) {
    els.resultPraise.textContent = {
      3: "太厉害了！三星通关，Cici 为你鼓掌！",
      2: "做得很好！再快一点点，就能集齐三颗星啦～",
      1: "完成啦！慢慢来，先把每个字符敲准确，星星会越来越多的！"
    }[stars];
  }
}

function exitPractice() {
  stopTick();
  if (session && session.pending) clearTimeout(session.pending);
  session = null;
  composing = false;
  els.typeInput.value = "";
  els.resultModal.hidden = true;
  renderHome();
  window.scrollTo({ top: 0 });
}

function replay() {
  if (lastModuleId == null) return;
  startSession(lastModuleId);
}

/* ---------------- 事件绑定 ---------------- */

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const next = btn.dataset.lang;
    if (next === lang) return;
    lang = next;
    exitPractice();
  });
});

els.backBtn.addEventListener("click", exitPractice);
els.doneBtn.addEventListener("click", exitPractice);
els.againBtn.addEventListener("click", replay);

els.soundBtn.addEventListener("click", () => {
  store.sound = !store.sound;
  saveStore();
  updateSoundBtn();
  if (store.sound) playSound("tap");
});

function updateSoundBtn() {
  els.soundBtn.querySelector(".ico-on").hidden = !store.sound;
  els.soundBtn.querySelector(".ico-off").hidden = store.sound;
  els.soundBtn.classList.toggle("is-muted", !store.sound);
}

/* 练习区域点击 -> 重新聚焦隐藏输入框 */
els.practice.addEventListener("mousedown", (e) => {
  if (e.target.closest("button")) return;
  setTimeout(() => els.typeInput.focus({ preventScroll: true }), 0);
});

/* 输入法检测 */
els.typeInput.addEventListener("compositionstart", () => {
  composing = true;
  showToast("检测到中文输入法，请切换为英文输入法", "error");
});
els.typeInput.addEventListener("compositionend", () => {
  composing = false;
  els.typeInput.value = "";
});

els.typeInput.addEventListener("input", () => {
  if (!session || session.finished) {
    els.typeInput.value = "";
    return;
  }
  if (composing) {
    els.typeInput.value = "";
    return;
  }
  const value = els.typeInput.value;
  els.typeInput.value = "";
  /* 桌面端按键已在 keydown 中处理，此处仅作为软键盘兜底 */
  if (performance.now() - lastKeyTs < 120) return;
  Array.from(value).forEach((ch) => handleChar(ch));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!els.resultModal.hidden) {
      exitPractice();
      return;
    }
    if (session) {
      e.preventDefault();
      exitPractice();
    }
    return;
  }
  if (!session || session.finished) return;
  if (els.resultModal.hidden === false) return;

  if (e.key === "Tab") {
    e.preventDefault();
    skipWord();
  } else if (e.key === "Backspace") {
    e.preventDefault();
    backspace();
  } else if (e.key === "Enter") {
    e.preventDefault();
    submitWord();
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    lastKeyTs = performance.now();
    handleChar(e.key);
  }
});

/* 初次渲染 */
updateSoundBtn();
renderHome();

/* 桌面版：等 pywebview 就绪后从 sqlite 读回星星与练习记录 */
if (window.pywebview && window.pywebview.api) {
  restoreFromDesktop();
} else {
  window.addEventListener("pywebviewready", restoreFromDesktop, { once: true });
}
