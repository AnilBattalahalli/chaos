const N_CHUNKS = 200;
const ALL_LEVELS = [1, 2, 3];
const STORAGE_KEY = "kaliLevels";

let dictionary = [];
let chunkId = null;
let selectedLevels = loadSelectedLevels();

/* ------------------ LEVEL FILTER STATE ------------------ */
function loadSelectedLevels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set(ALL_LEVELS);
    const arr = JSON.parse(raw).filter((l) => ALL_LEVELS.includes(l));
    return arr.length ? new Set(arr) : new Set(ALL_LEVELS);
  } catch {
    return new Set(ALL_LEVELS);
  }
}

function saveSelectedLevels() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedLevels]));
}

function currentPool() {
  // words without a classified level are always shown, regardless of filter
  return dictionary.filter((e) => e.level == null || selectedLevels.has(e.level));
}

/* ------------------ INITIAL LOAD ------------------ */
async function initialLoad() {
  wireLevelPanel();
  syncChipState();

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

  // Fade out
  card.style.opacity = 0;

  setTimeout(() => {
    const entry = pool[Math.floor(Math.random() * pool.length)];
    renderCard(entry);

    // Fade in
    card.style.opacity = 1;
  }, 300); // matches CSS transition
}

/* ------------------ RENDER ------------------ */
function renderCard(entry) {
  let html = "";

  html += `<div class="kali-word">${entry.word}</div>`;

  if (entry.pronunciation) {
    html += `<div class="kali-pronunciation">${entry.pronunciation}</div>`;
  }

  html += `<div class="kali-definitions">`;

  entry.definitions.forEach((d, i) => {
    if (d.is_reference) {
      html += `<div class="reference">→ ${d.text}</div>`;
    } else {
      html += `<div>${i + 1}. ${d.text}</div>`; // manual numbering
    }
  });

  html += `</div>`;

  document.getElementById("card").innerHTML = html;
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

function toggleLevelPanel() {
  const panel = document.getElementById("level-panel");
  const btn = document.getElementById("level-toggle");
  const isHidden = panel.hasAttribute("hidden");

  if (isHidden) {
    panel.removeAttribute("hidden");
    btn.setAttribute("aria-expanded", "true");
  } else {
    panel.setAttribute("hidden", "");
    btn.setAttribute("aria-expanded", "false");
  }
}

/* ------------------ START ------------------ */
window.addEventListener("DOMContentLoaded", initialLoad);
