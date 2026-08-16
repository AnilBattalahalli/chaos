const STORAGE_KEY_TOGGLE = "learngerman:keepEnglishNouns";
const STORAGE_KEY_LESSON = "learngerman:lastLesson";

let manifest = [];
let currentLesson = null;
let sentences = [];
let index = 0;
let isFlipped = false;
let keepEnglishNouns = loadToggle();

/* ------------------ STORAGE ------------------ */
function loadToggle() {
  const raw = localStorage.getItem(STORAGE_KEY_TOGGLE);
  return raw === null ? true : raw === "true";
}

function saveToggle(value) {
  try {
    localStorage.setItem(STORAGE_KEY_TOGGLE, String(value));
  } catch {
    /* no-op */
  }
}

function saveLastLesson(id) {
  try {
    localStorage.setItem(STORAGE_KEY_LESSON, id);
  } catch {
    /* no-op */
  }
}

function loadLastLesson() {
  return localStorage.getItem(STORAGE_KEY_LESSON);
}

/* ------------------ ESCAPE ------------------ */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

/* ------------------ SENTENCE HIGHLIGHTING ------------------ */
// Reconstructs `fullText` with each pos-tagged word wrapped in a highlight span,
// preserving original punctuation/spacing by locating each token in sequence.
function highlightSentence(fullText, posTokens) {
  let result = "";
  let cursor = 0;
  for (const tok of posTokens) {
    const idx = fullText.indexOf(tok.word, cursor);
    if (idx === -1) continue;
    if (idx > cursor) result += escapeHtml(fullText.slice(cursor, idx));
    result += `<span class="pos-${tok.pos.toLowerCase()}">${escapeHtml(tok.word)}</span>`;
    cursor = idx + tok.word.length;
  }
  if (cursor < fullText.length) result += escapeHtml(fullText.slice(cursor));
  return result;
}

// Renders the German sentence structure, but substitutes each NOUN-tagged German
// word with the corresponding English noun (matched by occurrence order, since
// german_pos/english_pos aren't always index-aligned when token counts differ).
function highlightMixedGerman(germanFull, germanPos, englishPos) {
  const englishNouns = englishPos.filter((t) => t.pos === "NOUN").map((t) => t.word);
  let nounCursor = 0;
  let result = "";
  let cursor = 0;
  for (const tok of germanPos) {
    const idx = germanFull.indexOf(tok.word, cursor);
    if (idx === -1) continue;
    if (idx > cursor) result += escapeHtml(germanFull.slice(cursor, idx));
    const isNoun = tok.pos === "NOUN";
    const displayWord = isNoun && nounCursor < englishNouns.length
      ? englishNouns[nounCursor++]
      : tok.word;
    result += `<span class="pos-${tok.pos.toLowerCase()}">${escapeHtml(displayWord)}</span>`;
    cursor = idx + tok.word.length;
  }
  if (cursor < germanFull.length) result += escapeHtml(germanFull.slice(cursor));
  return result;
}

/* ------------------ MINIMAL MARKDOWN RENDERER ------------------ */
function renderMarkdown(md) {
  const inline = (text) => {
    text = escapeHtml(text);
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/(^|[^*])\*([^*]+?)\*(?!\*)/g, "$1<em>$2</em>");
    text = text.replace(/`([^`]+?)`/g, "<code>$1</code>");
    return text;
  };

  const renderTable = (lines) => {
    const rows = lines.map((l) =>
      l.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim())
    );
    if (rows.length < 2) return "";
    const header = rows[0];
    const body = rows.slice(2);
    let html = '<div class="lg-table-wrap"><table><thead><tr>';
    header.forEach((h) => (html += `<th>${inline(h)}</th>`));
    html += "</tr></thead><tbody>";
    body.forEach((r) => {
      html += "<tr>";
      r.forEach((c) => (html += `<td>${inline(c)}</td>`));
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  };

  const lines = md.split("\n");
  let html = "";
  let i = 0;
  let para = [];

  const flush = () => {
    if (para.length) {
      html += `<p>${inline(para.join(" "))}</p>`;
      para = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) { flush(); i++; continue; }
    if (/^###\s+/.test(line)) { flush(); html += `<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`; i++; continue; }
    if (/^##\s+/.test(line)) { flush(); html += `<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`; i++; continue; }
    if (/^#\s+/.test(line)) { flush(); html += `<h1>${inline(line.replace(/^#\s+/, ""))}</h1>`; i++; continue; }
    if (/^-{3,}\s*$/.test(line)) { flush(); html += "<hr>"; i++; continue; }
    if (/^\s*\|/.test(line)) {
      flush();
      const tableLines = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { tableLines.push(lines[i].trim()); i++; }
      html += renderTable(tableLines);
      continue;
    }
    if (/^\d+\.\s+/.test(line) || /^[-*]\s+/.test(line)) {
      flush();
      const ordered = /^\d+\.\s+/.test(line);
      const items = [];
      while (i < lines.length && (/^\d+\.\s+/.test(lines[i]) || /^[-*]\s+/.test(lines[i]))) {
        items.push(inline(lines[i].replace(/^(\d+\.|[-*])\s+/, "")));
        i++;
      }
      const tag = ordered ? "ol" : "ul";
      html += `<${tag}>${items.map((it) => `<li>${it}</li>`).join("")}</${tag}>`;
      continue;
    }
    para.push(line.trim());
    i++;
  }
  flush();
  return html;
}

/* ------------------ MANIFEST / LESSON LOADING ------------------ */
async function loadManifest() {
  const res = await fetch("/learngerman/lessons/manifest.json");
  if (!res.ok) throw new Error("Failed to fetch lesson manifest");
  manifest = await res.json();
  renderLessonList();
  const lastId = loadLastLesson();
  const initial = manifest.find((m) => m.id === lastId) || manifest[0];
  await loadLesson(initial);
}

function renderLessonList() {
  const list = document.getElementById("lg-lesson-list");
  list.innerHTML = "";
  manifest.forEach((lesson) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lg-lesson-item";
    btn.textContent = lesson.title;
    btn.dataset.id = lesson.id;
    btn.addEventListener("click", () => {
      loadLesson(lesson);
      closeSidebar();
    });
    li.appendChild(btn);
    list.appendChild(li);
  });
  updateActiveLessonItem();
}

function updateActiveLessonItem() {
  document.querySelectorAll(".lg-lesson-item").forEach((el) => {
    el.classList.toggle("active", currentLesson && el.dataset.id === currentLesson.id);
  });
}

async function loadLesson(lessonMeta) {
  const res = await fetch(`/learngerman/lessons/${lessonMeta.file}`);
  if (!res.ok) throw new Error(`Failed to fetch lesson ${lessonMeta.file}`);
  const data = await res.json();
  currentLesson = lessonMeta;
  currentLesson.cheatsheet = data.cheatsheet || "";
  sentences = data.sentences || [];
  index = 0;
  saveLastLesson(lessonMeta.id);
  document.getElementById("lg-lesson-title").textContent = data.title || lessonMeta.title;
  updateActiveLessonItem();
  renderCard();
}

/* ------------------ CARD RENDERING ------------------ */
function renderCard() {
  const sentence = sentences[index];
  if (!sentence) return;

  isFlipped = false;
  const card = document.getElementById("card");
  card.classList.remove("flipped");

  document.querySelector(".card-front").innerHTML =
    `<div class="lg-sentence">${highlightSentence(sentence.english, sentence.english_pos)}</div>
     <div class="hint">Tap card to reveal</div>`;

  document.querySelector(".card-back").innerHTML =
    `<div class="lg-sentence">${
      keepEnglishNouns
        ? highlightMixedGerman(sentence.german, sentence.german_pos, sentence.english_pos)
        : highlightSentence(sentence.german, sentence.german_pos)
    }</div>`;

  updateProgress();
}

function updateProgress() {
  document.getElementById("lg-progress").textContent =
    sentences.length ? `${index + 1} / ${sentences.length}` : "";
}

function flip() {
  if (isFlipped) return;
  isFlipped = true;
  document.getElementById("card").classList.add("flipped");
}

function goNext() {
  if (index < sentences.length - 1) {
    index++;
    renderCard();
  }
}

function goPrev() {
  if (index > 0) {
    index--;
    renderCard();
  }
}

/* ------------------ SIDEBAR ------------------ */
function openSidebar() {
  document.getElementById("lg-sidebar").classList.add("open");
  document.getElementById("lg-sidebar-backdrop").hidden = false;
}

function closeSidebar() {
  document.getElementById("lg-sidebar").classList.remove("open");
  document.getElementById("lg-sidebar-backdrop").hidden = true;
}

function toggleSidebar() {
  const isOpen = document.getElementById("lg-sidebar").classList.contains("open");
  if (isOpen) closeSidebar();
  else openSidebar();
}

/* ------------------ HELP MODAL ------------------ */
function openHelp() {
  document.getElementById("lg-cheatsheet").innerHTML = renderMarkdown(currentLesson?.cheatsheet || "");
  document.getElementById("lg-help-modal").hidden = false;
}

function closeHelp() {
  document.getElementById("lg-help-modal").hidden = true;
}

/* ------------------ KEYBOARD ------------------ */
function handleKey(e) {
  if (e.key === "Escape") {
    closeHelp();
    closeSidebar();
    return;
  }
  if (!document.getElementById("lg-help-modal").hidden) return;
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();
    flip();
    return;
  }
  if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
  if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
}

/* ------------------ WIRE UP ------------------ */
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("card").addEventListener("click", flip);
  document.getElementById("lg-next").addEventListener("click", goNext);
  document.getElementById("lg-prev").addEventListener("click", goPrev);
  document.getElementById("lg-menu-btn").addEventListener("click", toggleSidebar);
  document.getElementById("lg-sidebar-backdrop").addEventListener("click", closeSidebar);
  document.getElementById("lg-help-btn").addEventListener("click", openHelp);
  document.getElementById("lg-help-close").addEventListener("click", closeHelp);
  document.getElementById("lg-help-modal").addEventListener("click", (e) => {
    if (e.target.id === "lg-help-modal" || e.target.classList.contains("lg-modal-backdrop")) closeHelp();
  });

  const toggle = document.getElementById("lg-noun-toggle");
  toggle.checked = keepEnglishNouns;
  toggle.addEventListener("change", () => {
    keepEnglishNouns = toggle.checked;
    saveToggle(keepEnglishNouns);
    renderCard();
  });

  document.addEventListener("keydown", handleKey);

  loadManifest().catch((err) => {
    console.error(err);
    document.querySelector(".card-front").textContent = "Error loading lessons";
  });
});
