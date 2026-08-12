const N_CHUNKS = 200;
const ALL_LEVELS = [1, 2, 3];
const LEVELS_STORAGE_KEY = "kaliLevels";
const SAVED_STORAGE_KEY = "kaliSaved";
const QUIZ_STORAGE_KEY = "kaliQuizMode";

let dictionary = [];
let chunkId = null;
let selectedLevels = loadSelectedLevels();
let savedWords = loadSavedWords();
let quizMode = loadQuizMode();
let currentEntry = null;
let revealed = true;
let deferredInstallPrompt = null;

/* ------------------ LEVEL FILTER STATE ------------------ */
function loadSelectedLevels() {
  try {
    const raw = localStorage.getItem(LEVELS_STORAGE_KEY);
    if (!raw) return new Set(ALL_LEVELS);
    const arr = JSON.parse(raw).filter((l) => ALL_LEVELS.includes(l));
    return arr.length ? new Set(arr) : new Set(ALL_LEVELS);
  } catch {
    return new Set(ALL_LEVELS);
  }
}

function saveSelectedLevels() {
  localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify([...selectedLevels]));
}

function currentPool() {
  // words without a classified level are always shown, regardless of filter
  return dictionary.filter((e) => e.level == null || selectedLevels.has(e.level));
}

/* ------------------ SAVED WORDS STATE ------------------ */
function entryKey(entry) {
  return `${entry.word}::${entry.pronunciation || ""}::${entry.definitions?.[0]?.text || ""}`;
}

function loadSavedWords() {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedWords() {
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedWords));
}

function isSaved(entry) {
  const key = entryKey(entry);
  return savedWords.some((e) => entryKey(e) === key);
}

function toggleSaveCurrent() {
  if (!currentEntry) return;

  const key = entryKey(currentEntry);
  const idx = savedWords.findIndex((e) => entryKey(e) === key);

  if (idx === -1) {
    savedWords.push(currentEntry);
  } else {
    savedWords.splice(idx, 1);
  }

  persistSavedWords();
  updateSaveButton();
  renderSavedList();
}

function removeSaved(key) {
  savedWords = savedWords.filter((e) => entryKey(e) !== key);
  persistSavedWords();
  updateSaveButton();
  renderSavedList();
}

function updateSaveButton() {
  const btn = document.getElementById("save-toggle");
  if (!btn) return;
  const saved = currentEntry ? isSaved(currentEntry) : false;
  btn.textContent = saved ? "★" : "☆";
  btn.classList.toggle("active", saved);
  btn.setAttribute("aria-pressed", saved);
}

function updateSavedCount() {
  const el = document.getElementById("saved-count");
  if (!el) return;
  el.textContent = savedWords.length ? ` (${savedWords.length})` : "";
}

function renderSavedList() {
  updateSavedCount();
  const list = document.getElementById("saved-list");
  if (!list) return;

  if (savedWords.length === 0) {
    list.innerHTML = `<div class="kali-saved-empty">ಯಾವುದೂ ಉಳಿಸಿಲ್ಲ</div>`;
    return;
  }

  list.innerHTML = savedWords
    .map((e) => {
      const key = entryKey(e).replace(/"/g, "&quot;");
      return `
        <div class="kali-saved-item">
          <button class="kali-saved-word" data-key="${key}">${e.word}</button>
          <button class="kali-saved-remove" data-key="${key}" aria-label="remove">×</button>
        </div>
      `;
    })
    .join("");

  list.querySelectorAll(".kali-saved-word").forEach((btn) => {
    btn.addEventListener("click", () => {
      const entry = savedWords.find((e) => entryKey(e) === btn.dataset.key);
      if (entry) {
        togglePanel("saved-panel", "saved-toggle", false);
        showEntry(entry);
      }
    });
  });

  list.querySelectorAll(".kali-saved-remove").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      removeSaved(btn.dataset.key);
    });
  });
}

/* ------------------ QUIZ MODE STATE ------------------ */
function loadQuizMode() {
  return localStorage.getItem(QUIZ_STORAGE_KEY) === "1";
}

function toggleQuizMode() {
  quizMode = !quizMode;
  localStorage.setItem(QUIZ_STORAGE_KEY, quizMode ? "1" : "0");

  const btn = document.getElementById("quiz-toggle");
  if (btn) {
    btn.classList.toggle("active", quizMode);
    btn.setAttribute("aria-pressed", quizMode);
  }

  if (currentEntry) {
    revealed = !quizMode;
    renderCard();
  }
}

function revealAnswer() {
  revealed = true;
  renderCard();
}

/* ------------------ INITIAL LOAD ------------------ */
async function initialLoad() {
  wireLevelPanel();
  syncChipState();
  wireSavedPanel();
  renderSavedList();
  wireQuizToggle();
  wireInstallPrompt();
  registerServiceWorker();

  try {
    await fetchRandomChunk();
    loadRandomEntry();
  } catch (err) {
    console.error(err);
    document.getElementById("card").innerHTML = "Error loading data";
  }
}

async function fetchRandomChunk() {
  chunkId = Math.floor(Math.random() * N_CHUNKS);

  const res = await fetch(`/kali/dict_${chunkId}.json`);
  if (!res.ok) throw new Error("Failed to fetch JSON");

  dictionary = await res.json();
}

/* ------------------ RANDOM WORD ------------------ */
async function loadRandomEntry() {
  const card = document.getElementById("card");

  if (!dictionary || dictionary.length === 0) {
    card.innerHTML = "Loading...";
    return;
  }

  let pool = currentPool();

  // this chunk happened to have none of the selected levels; try a few other chunks
  let tries = 0;
  while (pool.length === 0 && tries < 5) {
    await fetchRandomChunk();
    pool = currentPool();
    tries++;
  }

  if (pool.length === 0) {
    card.innerHTML = "ಈ ಹಂತದಲ್ಲಿ ಪದಗಳು ಸಿಗಲಿಲ್ಲ.";
    return;
  }

  const entry = pool[Math.floor(Math.random() * pool.length)];

  // Fade out
  card.style.opacity = 0;

  setTimeout(() => {
    showEntry(entry);
  }, 300); // matches CSS transition
}

function showEntry(entry) {
  currentEntry = entry;
  revealed = !quizMode;
  renderCard();

  const card = document.getElementById("card");
  card.style.opacity = 1;
}

/* ------------------ RENDER ------------------ */
function renderCard() {
  const entry = currentEntry;
  if (!entry) return;

  let html = "";

  html += `<button id="save-toggle" class="kali-save-toggle" aria-label="save">☆</button>`;
  html += `<div class="kali-word">${entry.word}</div>`;

  if (entry.pronunciation) {
    html += `<div class="kali-pronunciation">${entry.pronunciation}</div>`;
  }

  if (quizMode && !revealed) {
    html += `<button class="kali-reveal" onclick="revealAnswer()">ಅರ್ಥ ಏನಿರಬಹುದು? ಉತ್ತರ ನೋಡಲು ತಟ್ಟಿ</button>`;
  } else {
    html += `<div class="kali-definitions">`;
    entry.definitions.forEach((d, i) => {
      if (d.is_reference) {
        html += `<div class="reference">→ ${d.text}</div>`;
      } else {
        html += `<div>${i + 1}. ${d.text}</div>`; // manual numbering
      }
    });
    html += `</div>`;
  }

  document.getElementById("card").innerHTML = html;

  updateSaveButton();
  document.getElementById("save-toggle")?.addEventListener("click", toggleSaveCurrent);
}

/* ------------------ GENERIC PANEL TOGGLE ------------------ */
function togglePanel(panelId, toggleBtnId, forceOpen) {
  const panel = document.getElementById(panelId);
  const btn = document.getElementById(toggleBtnId);
  const isHidden = panel.hasAttribute("hidden");
  const open = forceOpen != null ? forceOpen : isHidden;

  if (open) {
    panel.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
  } else {
    panel.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", "false");
  }
}

function toggleLevelPanel() {
  togglePanel("level-panel", "level-toggle");
}

/* ------------------ LEVEL FILTER UI ------------------ */
function wireLevelPanel() {
  document.querySelectorAll(".kali-chip[data-level]").forEach((btn) => {
    const lvl = Number(btn.dataset.level);
    btn.addEventListener("click", () => toggleLevel(lvl));
  });

  const allBtn = document.querySelector(".kali-chip-all");
  allBtn.addEventListener("click", selectAllLevels);
}

function toggleLevel(lvl) {
  if (selectedLevels.has(lvl)) {
    if (selectedLevels.size === 1) return; // keep at least one level active
    selectedLevels.delete(lvl);
  } else {
    selectedLevels.add(lvl);
  }
  saveSelectedLevels();
  syncChipState();
  loadRandomEntry();
}

function selectAllLevels() {
  selectedLevels = new Set(ALL_LEVELS);
  saveSelectedLevels();
  syncChipState();
  loadRandomEntry();
}

function syncChipState() {
  document.querySelectorAll(".kali-chip[data-level]").forEach((btn) => {
    const lvl = Number(btn.dataset.level);
    const active = selectedLevels.has(lvl);
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active);
  });
  updateLevelCount();
}

function updateLevelCount() {
  const el = document.getElementById("level-count");
  if (!el) return;
  el.textContent = selectedLevels.size === ALL_LEVELS.length ? "" : ` (${selectedLevels.size})`;
}

/* ------------------ SAVED PANEL UI ------------------ */
function wireSavedPanel() {
  document.getElementById("saved-toggle").addEventListener("click", () => togglePanel("saved-panel", "saved-toggle"));
}

/* ------------------ QUIZ TOGGLE UI ------------------ */
function wireQuizToggle() {
  const btn = document.getElementById("quiz-toggle");
  btn.classList.toggle("active", quizMode);
  btn.setAttribute("aria-pressed", quizMode);
  btn.addEventListener("click", toggleQuizMode);
}

/* ------------------ PWA INSTALL ------------------ */
function wireInstallPrompt() {
  const btn = document.getElementById("install-toggle");
  if (!btn) return;

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    btn.hidden = false;
  });

  btn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    btn.hidden = true;
  });

  window.addEventListener("appinstalled", () => {
    btn.hidden = true;
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/kali/sw.js").catch((err) => console.error(err));
  }
}

/* ------------------ START ------------------ */
window.addEventListener("DOMContentLoaded", initialLoad);
