const STORAGE_KEY = "learngerman:ratings";
const DEWEIGHT_PROB = 0.7;

let vocab = [];
let current = null;
let isFlipped = false;

const ratings = loadRatings();

/* ------------------ STORAGE ------------------ */
function loadRatings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveRating(id, rating) {
  ratings[id] = rating;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    /* quota or disabled — no-op */
  }
}

/* ------------------ INITIAL LOAD ------------------ */
async function initialLoad() {
  try {
    const res = await fetch(`/learngerman/vocab.json`);
    if (!res.ok) throw new Error("Failed to fetch vocab");
    vocab = await res.json();
    nextCard();
  } catch (err) {
    console.error(err);
    document.querySelector(".card-front").textContent = "Error loading vocabulary";
  }
}

/* ------------------ PICK ENTRY ------------------ */
function pickEntry() {
  if (!vocab.length) return null;
  let pick = vocab[Math.floor(Math.random() * vocab.length)];
  const known = ratings[pick.id] === "good" || ratings[pick.id] === "easy";
  if (known && Math.random() < DEWEIGHT_PROB) {
    // one reroll only
    pick = vocab[Math.floor(Math.random() * vocab.length)];
  }
  return pick;
}

/* ------------------ RENDER ------------------ */
function nextCard() {
  current = pickEntry();
  if (!current) return;

  isFlipped = false;
  const card = document.getElementById("card");
  card.classList.remove("flipped");
  document.getElementById("rating-row").hidden = true;

  document.querySelector(".card-front").innerHTML = renderFront(current);
  document.querySelector(".card-back").innerHTML = renderBack(current);
}

function renderFront(e) {
  const formality = e.formality
    ? `<span class="formality">${escapeHtml(e.formality)}</span>`
    : "";
  const sentence = e.de_sentence
    ? `<div class="sentence">${escapeHtml(e.de_sentence)}</div>`
    : "";
  return `
    <div class="word">${escapeHtml(e.de_word)}${formality}</div>
    ${sentence}
    <div class="hint">Tap card to reveal</div>
  `;
}

function renderBack(e) {
  const sentence = e.en_sentence
    ? `<div class="sentence">${escapeHtml(e.en_sentence)}</div>`
    : "";
  const note = e.note
    ? `<div class="note">${escapeHtml(e.note)}</div>`
    : "";
  const deSentence = e.de_sentence
    ? `<div class="de-sentence">${escapeHtml(e.de_sentence)}</div>`
    : "";
  return `
    <div class="word de-word">${escapeHtml(e.de_word)}</div>
    ${deSentence}
    <hr class="divider">
    <div class="word en-word">${escapeHtml(e.en_word)}</div>
    ${sentence}
    ${note}
  `;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

/* ------------------ INTERACTIONS ------------------ */
function flip() {
  if (isFlipped || !current) return;
  isFlipped = true;
  document.getElementById("card").classList.add("flipped");
  document.getElementById("rating-row").hidden = false;
}

function handleRating(rating) {
  if (!current) return;
  if (rating === "again" || rating === "hard") {
    saveRating(current.id, rating);
  } else if (isFlipped) {
    saveRating(current.id, rating);
  }
  nextCard();
}

/* ------------------ KEYBOARD ------------------ */
function handleKey(e) {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    if (!isFlipped) flip();
    return;
  }
  if (!isFlipped) return;
  const map = { "1": "again", "2": "hard", "3": "good", "4": "easy" };
  if (map[e.key]) {
    e.preventDefault();
    handleRating(map[e.key]);
  }
}

/* ------------------ WIRE UP ------------------ */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("card").addEventListener("click", flip);
  document.querySelectorAll("#rating-row button").forEach((btn) => {
    btn.addEventListener("click", () => handleRating(btn.dataset.rating));
  });
  document.addEventListener("keydown", handleKey);
  initialLoad();
});
