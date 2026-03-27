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

  const card = document.getElementById("card");

  // Start fade out
  card.classList.add("fade-out");

  setTimeout(() => {
    // Change content after fade out
    const entry = dictionary[Math.floor(Math.random() * dictionary.length)];
    renderCard(entry);

    // Force reflow so fade-in works
    void card.offsetWidth; 

    // Fade in
    card.classList.remove("fade-out");
  }, 300); // matches CSS transition duration
}

/* ------------------ RENDER ------------------ */
function renderCard(entry) {
  let html = "";

  html += `<div class="kali-word">${entry.word}</div>`;

  if (entry.pronunciation) {
    html += `<div class="kali-pronunciation">${entry.pronunciation}</div>`;
  }

  html += `<div class="kali-definitions"><ul>`;

  entry.definitions.forEach((d, i) => {
    const number = i + 1;

    if (d.is_reference) {
      html += `<li class="reference"><strong>${number}.</strong> → ${d.text}</li>`;
    } else {
      html += `<li><strong>${number}.</strong> ${d.text}</li>`;
    }
  });

  html += "</ul></div>";

  document.getElementById("card").innerHTML = html;
}

/* ------------------ START ------------------ */
window.addEventListener("DOMContentLoaded", initialLoad);