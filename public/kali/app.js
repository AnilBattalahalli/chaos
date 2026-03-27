const N_CHUNKS = 200;
let dictionary = [];
let chunkId = null;

/* ------------------ INITIAL LOAD ------------------ */
async function initialLoad() {
  try {
    // Pick ONE chunk per page load
    chunkId = Math.floor(Math.random() * N_CHUNKS);

    const res = await fetch(`/kali/dict_${chunkId}.json`);
    if (!res.ok) throw new Error("Failed to fetch JSON");

    dictionary = await res.json();

    loadRandomEntry(); // show first word
  } catch (err) {
    console.error(err);
    document.getElementById("card").innerHTML = "Error loading data";
  }
}

/* ------------------ RANDOM WORD ------------------ */
function loadRandomEntry() {
  if (!dictionary || dictionary.length === 0) {
    document.getElementById("card").innerHTML = "Loading...";
    return;
  }

  // Fade out
  const card = document.getElementById("card");
  card.style.opacity = 0;

  setTimeout(() => {
    const entry = dictionary[Math.floor(Math.random() * dictionary.length)];
    renderCard(entry);

    // Fade in
    card.style.opacity = 1;
  }, 300);  // matches CSS transition
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
      html += `<div>${i + 1}. ${d.text}</div>`;  // manual numbering
    }
  });

  html += `</div>`;

  document.getElementById("card").innerHTML = html;
}

/* ------------------ START ------------------ */
window.addEventListener("DOMContentLoaded", initialLoad);