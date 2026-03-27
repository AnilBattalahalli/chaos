const N_CHUNKS = 200;

async function loadRandomEntry() {
  try {
    const chunkId = Math.floor(Math.random() * N_CHUNKS);

    const res = await fetch(`/dictionary/dict_${chunkId}.json`);
    const data = await res.json();

    const entry = data[Math.floor(Math.random() * data.length)];

    renderCard(entry);

  } catch (err) {
    console.error(err);
    document.getElementById("card").innerHTML = "Error loading data";
  }
}

function renderCard(entry) {
  let html = "";

  html += `<div class="word">${entry.word}</div>`;

  if (entry.pronunciation) {
    html += `<div class="pronunciation">${entry.pronunciation}</div>`;
  }

  html += "<ul>";

  entry.definitions.forEach(d => {
    if (d.is_reference) {
      html += `<li class="reference">→ ${d.text}</li>`;
    } else {
      html += `<li>${d.text}</li>`;
    }
  });

  html += "</ul>";

  document.getElementById("card").innerHTML = html;
}

loadRandomEntry();