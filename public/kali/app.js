const N_CHUNKS = 90;
const SAVED_STORAGE_KEY = "kaliSaved";
const QUIZ_STORAGE_KEY = "kaliQuizMode";
const DATA_VERSION_KEY = "kaliDataVersion";
const DATA_VERSION = "3";

// ---- Donation config: the only place the UPI ID is set ----
const DONATION_UPI_ID = "learnwithkali@axl";

/* ------------------ ONE-TIME DATA MIGRATION ------------------ */
// the dictionary schema changed (3-level -> 6-level, definitions -> gloss/
// meaning/example), so old saved words can never match a new entry again.
// Wipe the old, now-orphaned state once per browser, before anything reads it.
(function migrateDataVersionIfNeeded() {
  if (localStorage.getItem(DATA_VERSION_KEY) === DATA_VERSION) return;
  localStorage.removeItem(SAVED_STORAGE_KEY);
  localStorage.removeItem("kaliLevels");
  localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION);
})();

let dictionary = [];
let chunkId = null;
let savedWords = loadSavedWords();
let quizMode = loadQuizMode();
let currentEntry = null;
let revealed = true;
let deferredInstallPrompt = null;

/* ------------------ SAVED WORDS STATE ------------------ */
function entryKey(entry) {
  return `${entry.root}::${entry.gloss}`;
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
          <button class="kali-saved-word" data-key="${key}">${e.root}</button>
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
  // toggle the class on the existing element (not a fresh renderCard) so the
  // flip transition has something to animate from
  document.getElementById("card-flip")?.classList.add("flipped");
}

/* ------------------ INITIAL LOAD ------------------ */
async function initialLoad() {
  wireLegendPanel();
  wireSavedPanel();
  renderSavedList();
  wireQuizToggle();
  wireInstallPrompt();
  wireDonateModal();
  wireSynonymsModal();
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
    await fetchRandomChunk();
  }

  if (!dictionary || dictionary.length === 0) {
    card.innerHTML = "Error loading data";
    return;
  }

  const entry = dictionary[Math.floor(Math.random() * dictionary.length)];

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
function wordBlockHtml(entry, showSynonymsButton) {
  let html = `<div class="kali-root-row">`;
  html += `<span class="kali-word kali-level-${entry.level}">${entry.root}</span>`;
  if (showSynonymsButton && entry.synonyms && entry.synonyms.length) {
    html += `<button class="kali-syn-btn" aria-label="synonyms" onclick="openSynonyms()">+${entry.synonyms.length}</button>`;
  }
  html += `</div>`;
  return html;
}

function contentHtml(entry) {
  let html = `<div class="kali-content">`;
  html += `<p class="kali-gloss">${entry.gloss}</p>`;
  html += `<p class="kali-meaning">${entry.meaning}</p>`;
  if (entry.example) {
    html += `<p class="kali-example">${entry.example}</p>`;
  }
  html += `</div>`;
  return html;
}

function renderCard() {
  const entry = currentEntry;
  if (!entry) return;

  let html = `<button id="save-toggle" class="kali-save-toggle" aria-label="save">☆</button>`;

  if (quizMode) {
    // two-sided flip card: front asks, back reveals — tapping flips it in place
    html += `<div id="card-flip" class="kali-flip${revealed ? " flipped" : ""}">`;
    html += `<div class="kali-card-face kali-card-front">`;
    html += wordBlockHtml(entry, false);
    html += `<button class="kali-reveal" onclick="revealAnswer()">ಅರ್ಥ ಏನಿರಬಹುದು? ಉತ್ತರ ನೋಡಲು ತಟ್ಟಿ</button>`;
    html += `</div>`;
    html += `<div class="kali-card-face kali-card-back">`;
    html += wordBlockHtml(entry, true);
    html += contentHtml(entry);
    html += `</div>`;
    html += `</div>`;
  } else {
    html += wordBlockHtml(entry, true);
    html += contentHtml(entry);
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

/* ------------------ LEGEND UI ------------------ */
function wireLegendPanel() {
  document.getElementById("legend-toggle").addEventListener("click", () => togglePanel("legend-panel", "legend-toggle"));
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

/* ------------------ DONATE (copy UPI ID, no gateway) ------------------ */
// upi://pay deep links get treated as untrusted regardless of app, scheme,
// or payload — confirmed on-device that the identical link works scanned
// live but fails opened from a browser, in every app tried. Since that's
// not something a website's link can change, this just offers the UPI ID
// to copy so people can pay from inside their own app directly.
function wireDonateModal() {
  const backdrop = document.getElementById("donate-modal-backdrop");
  const openBtn = document.getElementById("donate-toggle");
  const closeBtn = document.getElementById("donate-modal-close");
  const upiIdText = document.getElementById("donate-upi-id-text");
  const copyBtn = document.getElementById("donate-copy-upi");

  function openModal() {
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("open"));
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
      backdrop.hidden = true;
    }, 200);
  }

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });

  upiIdText.textContent = DONATION_UPI_ID;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(DONATION_UPI_ID);
    } catch (err) {
      // clipboard API unavailable/blocked: fall back to selecting the text
      const range = document.createRange();
      range.selectNodeContents(upiIdText);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      try {
        document.execCommand("copy");
      } catch (fallbackErr) {
        console.error(fallbackErr);
      }
      sel.removeAllRanges();
    }
    const original = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    copyBtn.disabled = true;
    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.disabled = false;
    }, 1500);
  });
}

/* ------------------ SYNONYMS POPOVER ------------------ */
function wireSynonymsModal() {
  const backdrop = document.getElementById("synonyms-modal-backdrop");
  const closeBtn = document.getElementById("synonyms-modal-close");

  function closeModal() {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => {
      backdrop.hidden = true;
    }, 200);
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !backdrop.hidden) closeModal();
  });
}

function openSynonyms() {
  if (!currentEntry || !currentEntry.synonyms || !currentEntry.synonyms.length) return;

  document.getElementById("synonyms-modal-title").textContent = currentEntry.root;
  document.getElementById("synonyms-list").innerHTML = currentEntry.synonyms
    .map((s) => `<span class="kali-syn-chip kali-level-${s.level}">${s.word}</span>`)
    .join("");

  const backdrop = document.getElementById("synonyms-modal-backdrop");
  backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.add("open"));
  document.body.style.overflow = "hidden";
}

/* ------------------ START ------------------ */
window.addEventListener("DOMContentLoaded", initialLoad);
