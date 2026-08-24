const N_CHUNKS = 200;
const ALL_LEVELS = [1, 2, 3];
const LEVELS_STORAGE_KEY = "kaliLevels";
const SAVED_STORAGE_KEY = "kaliSaved";
const QUIZ_STORAGE_KEY = "kaliQuizMode";

// ---- Donation config: the only place the UPI ID is set ----
const DONATION_UPI_ID = "anilbattalahalli-3@okhdfcbank";
const DONATION_PAYEE_NAME = "Kali 2.0";
const DONATION_NOTE = "Donation to Kali 2.0";
const DONATION_PRESETS = [50, 100, 250, 500, 1000];
const DONATION_MAX_AMOUNT = 100000;

let dictionary = [];
let chunkId = null;
let selectedLevels = loadSelectedLevels();
let savedWords = loadSavedWords();
let quizMode = loadQuizMode();
let currentEntry = null;
let revealed = true;
let deferredInstallPrompt = null;
let donateAmount = null;

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
  // toggle the class on the existing element (not a fresh renderCard) so the
  // flip transition has something to animate from
  document.getElementById("card-flip")?.classList.add("flipped");
}

/* ------------------ INITIAL LOAD ------------------ */
async function initialLoad() {
  wireLevelPanel();
  syncLevelCheckboxState();
  wireSavedPanel();
  renderSavedList();
  wireQuizToggle();
  wireInstallPrompt();
  wireDonateModal();
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
function wordBlockHtml(entry) {
  let html = `<div class="kali-word">${entry.word}</div>`;
  if (entry.pronunciation) {
    html += `<div class="kali-pronunciation">${entry.pronunciation}</div>`;
  }
  return html;
}

function definitionsHtml(entry) {
  let html = `<div class="kali-definitions">`;
  entry.definitions.forEach((d, i) => {
    if (d.is_reference) {
      html += `<div class="reference">→ ${d.text}</div>`;
    } else {
      html += `<div>${i + 1}. ${d.text}</div>`; // manual numbering
    }
  });
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
    html += wordBlockHtml(entry);
    html += `<button class="kali-reveal" onclick="revealAnswer()">ಅರ್ಥ ಏನಿರಬಹುದು? ಉತ್ತರ ನೋಡಲು ತಟ್ಟಿ</button>`;
    html += `</div>`;
    html += `<div class="kali-card-face kali-card-back">`;
    html += wordBlockHtml(entry);
    html += definitionsHtml(entry);
    html += `</div>`;
    html += `</div>`;
  } else {
    html += wordBlockHtml(entry);
    html += definitionsHtml(entry);
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
  document.querySelectorAll(".kali-level-checkbox").forEach((cb) => {
    const lvl = Number(cb.dataset.level);
    cb.addEventListener("change", () => toggleLevel(lvl, cb));
  });

  document.querySelector(".kali-chip-all").addEventListener("click", selectAllLevels);
}

function toggleLevel(lvl, checkbox) {
  // the checkbox has already flipped its own `checked` by the time `change`
  // fires, so revert it visually if this would drop selection to zero
  if (!checkbox.checked && selectedLevels.size === 1 && selectedLevels.has(lvl)) {
    checkbox.checked = true;
    return;
  }

  if (checkbox.checked) {
    selectedLevels.add(lvl);
  } else {
    selectedLevels.delete(lvl);
  }
  saveSelectedLevels();
  syncLevelCheckboxState();
  loadRandomEntry();
}

function selectAllLevels() {
  selectedLevels = new Set(ALL_LEVELS);
  saveSelectedLevels();
  syncLevelCheckboxState();
  loadRandomEntry();
}

function syncLevelCheckboxState() {
  document.querySelectorAll(".kali-level-checkbox").forEach((cb) => {
    cb.checked = selectedLevels.has(Number(cb.dataset.level));
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

/* ------------------ DONATE (direct UPI, no gateway) ------------------ */
// iOS has no system-level chooser for custom URL schemes the way Android
// does, so a generic upi:// link just resolves to whichever app last
// registered it (WhatsApp, in practice) instead of prompting. These
// app-specific schemes carry the exact same UPI payload — no separate
// flow, just a different door into the same payment — so a user who
// wants a particular app can pick it directly.
//
// Google Pay doesn't publish a supported app-specific deep link for
// third-party payees. Its old "tez://" scheme still opens the app, but on
// current builds it's misrouted through GPay's "pay via QR image from
// gallery" flow instead of a normal payment request — showing that flow's
// ₹2,000 QR-import cap regardless of the actual amount. The generic
// upi://pay intent is what Google actually recommends, and Android's own
// chooser already lets a user pick Google Pay from it, so route through
// that instead of the broken app-specific scheme.
const DONATION_APP_SCHEMES = {
  gpay: (qs) => `upi://pay?${qs}`,
  phonepe: (qs) => `phonepe://pay?${qs}`,
};

function buildUpiQueryString(amount) {
  const parts = [`pa=${encodeURIComponent(DONATION_UPI_ID)}`, `pn=${encodeURIComponent(DONATION_PAYEE_NAME)}`];
  if (amount != null) parts.push(`am=${amount.toFixed(2)}`);
  parts.push("cu=INR");
  parts.push(`tn=${encodeURIComponent(DONATION_NOTE)}`);
  return parts.join("&");
}

function buildUpiUrl(amount) {
  return `upi://pay?${buildUpiQueryString(amount)}`;
}

function buildAppUpiUrl(app, amount) {
  return DONATION_APP_SCHEMES[app](buildUpiQueryString(amount));
}

function wireDonateModal() {
  const backdrop = document.getElementById("donate-modal-backdrop");
  const openBtn = document.getElementById("donate-toggle");
  const closeBtn = document.getElementById("donate-modal-close");
  const amountBtns = document.querySelectorAll(".kali-amount-btn[data-amount]");
  const customWrap = document.getElementById("donate-custom-wrap");
  const customInput = document.getElementById("donate-custom-input");
  const errorEl = document.getElementById("donate-amount-error");
  const cta = document.getElementById("donate-cta");
  const qrContainer = document.getElementById("donate-qr-canvas");
  const qrCaption = document.getElementById("donate-qr-caption");
  const qrAvailable = typeof QRCode !== "undefined";
  const payMethodInputs = document.querySelectorAll(".kali-pay-method-input");
  let qrInstance = null;
  let donatePayMethod = null;

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

  function updateQr(amount) {
    if (!qrContainer) return;

    if (!qrAvailable) {
      qrContainer.hidden = true;
      qrCaption.textContent = "QR code unavailable — use the Donate button above instead.";
      return;
    }

    if (amount == null) {
      qrContainer.hidden = true;
      qrCaption.textContent = "Pick or enter an amount to show a scannable QR code here.";
      return;
    }

    try {
      const url = buildUpiUrl(amount);
      if (!qrInstance) {
        qrInstance = new QRCode(qrContainer, { text: url, width: 132, height: 132, correctLevel: QRCode.CorrectLevel.M });
      } else {
        qrInstance.clear();
        qrInstance.makeCode(url);
      }
      qrContainer.hidden = false;
      const amtStr = Number.isInteger(amount) ? amount : amount.toFixed(2);
      qrCaption.innerHTML = `Scan with any UPI app to pay <b>₹${amtStr}</b>`;
    } catch (err) {
      console.error(err);
      qrContainer.hidden = true;
      qrCaption.textContent = "Couldn't generate the QR code.";
    }
  }

  function refreshCta() {
    if (donateAmount != null && donatePayMethod != null) {
      cta.disabled = false;
      const amtStr = Number.isInteger(donateAmount) ? donateAmount : donateAmount.toFixed(2);
      cta.textContent = `Donate ₹${amtStr}`;
    } else {
      cta.disabled = true;
      cta.textContent = donateAmount == null ? "Select an amount" : "Choose a payment app";
    }
  }

  function setAmount(amount) {
    donateAmount = amount;
    refreshCta();
    updateQr(amount);
  }

  amountBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      amountBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      errorEl.textContent = "";

      if (btn.dataset.amount === "custom") {
        customWrap.hidden = false;
        customInput.value = "";
        customInput.focus();
        setAmount(null);
      } else {
        customWrap.hidden = true;
        setAmount(Number(btn.dataset.amount));
      }
    });
  });

  customInput.addEventListener("input", () => {
    const raw = customInput.value.trim();
    if (raw === "") {
      errorEl.textContent = "";
      setAmount(null);
      return;
    }

    const val = Number(raw);
    if (!Number.isFinite(val) || val <= 0) {
      errorEl.textContent = "Enter a positive amount.";
      setAmount(null);
      return;
    }
    if (val > DONATION_MAX_AMOUNT) {
      errorEl.textContent = `Max is ₹${DONATION_MAX_AMOUNT.toLocaleString("en-IN")} per UPI transaction.`;
      setAmount(null);
      return;
    }

    errorEl.textContent = "";
    setAmount(Math.round(val * 100) / 100);
  });

  payMethodInputs.forEach((input) => {
    input.addEventListener("change", () => {
      donatePayMethod = input.value;
      refreshCta();
    });
  });

  cta.addEventListener("click", () => {
    if (donateAmount == null || donatePayMethod == null) return;
    // hands off to whichever UPI app was picked; we never see or claim a result
    const url = donatePayMethod === "other" ? buildUpiUrl(donateAmount) : buildAppUpiUrl(donatePayMethod, donateAmount);
    window.location.href = url;
  });
}

/* ------------------ START ------------------ */
window.addEventListener("DOMContentLoaded", initialLoad);
