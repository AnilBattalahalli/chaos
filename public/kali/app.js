const N_CHUNKS = 20;
let dictionary = [];
let chunkId = null;

async function initialLoad() {
  try {
    chunkId = Math.floor(Math.random() * N_CHUNKS);
    const res = await fetch(`/kali/IWN_Ka_En_${chunkId}.json`);
    if (!res.ok) throw new Error("Failed to fetch JSON");

    dictionary = await res.json();
    loadRandomEntry();
  } catch (err) {
    console.error(err);
    document.getElementById("card").innerHTML = "Error loading data";
  }
}

function loadRandomEntry() {
  if (!dictionary || dictionary.length === 0) {
    document.getElementById("card").innerHTML = "Loading...";
    return;
  }

  const card = document.getElementById("card");
  card.style.opacity = 0;
  card.style.transform = "translateY(20px)";

  setTimeout(() => {
    const entry = dictionary[Math.floor(Math.random() * dictionary.length)];
    renderCard(entry);

    card.style.opacity = 1;
    card.style.transform = "translateY(0)";
  }, 300);
}

function renderCard(entry) {
  let html = "";

  if (entry.pos || entry.part_of_speech) {
    html += `<div class="kali-pos-tag">${entry.pos || entry.part_of_speech}</div>`;
  }

  html += `<div class="kali-word">${entry.kannada_root}</div>`;

  if (entry.transliteration) {
    html += `<div class="kali-transliteration">${entry.transliteration}</div>`;
  }

  if (entry.kannada_synonyms && entry.kannada_synonyms.length > 0) {
    html += `<div class="kali-synonyms">`;
    entry.kannada_synonyms.forEach(s => {
      html += `<span class="chip">${s}</span>`;
    });
    html += `</div>`;
  }

  html += `<div class="kali-divider"></div>`;

  if (entry.english_gloss) {
    html += `<span class="kali-section-label en">English</span>`;
    html += `<div class="kali-english-gloss">${entry.english_gloss}</div>`;
  }

  if (entry.kannada_meaning) {
    html += `<span class="kali-section-label kn">ಕನ್ನಡ ಅರ್ಥ</span>`;
    html += `<div class="kali-kannada-meaning">${entry.kannada_meaning}</div>`;
  }

  if (entry.kannada_example) {
    html += `<span class="kali-section-label ex">ಉದಾಹರಣೆ</span>`;
    html += `<div class="kali-kannada-example">${entry.kannada_example}</div>`;
  }

  html += `<div class="kali-card-footer">
    <span class="kali-source-tag">IWN corpus · chunk #${chunkId}</span>
  </div>`;

  document.getElementById("card").innerHTML = html;
}

window.addEventListener("DOMContentLoaded", initialLoad);