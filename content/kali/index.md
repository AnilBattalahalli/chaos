---
title: "ಕಲಿ"
layout: "blank"
---

<div class="kali-widget-wrapper">
  <div class="kali-container">
    <!-- <h1>ಕಲಿ</h1> -->
    <br>
    <div class="kali-toolbar">
      <button class="kali-button" onclick="loadRandomEntry()">ಹೊಸ ಪದ</button>
      <button id="level-toggle" class="kali-level-toggle" onclick="toggleLevelPanel()" aria-expanded="false">
        ಹಂತ<span id="level-count" class="kali-level-count"></span>
      </button>
    </div>
    <div id="level-panel" class="kali-level-panel" hidden>
      <div class="kali-level-grid">
        <button class="kali-chip" data-level="5">೫ ಸಂಸ್ಕೃತ</button>
        <button class="kali-chip" data-level="4">೪ ಸಂಸ್ಕೃತ ಛಾಯೆ</button>
        <button class="kali-chip" data-level="3">೩ ತದ್ಭವ</button>
        <button class="kali-chip" data-level="2">೨ ದ್ರಾವಿಡ+</button>
        <button class="kali-chip" data-level="1">೧ ಅಚ್ಚ ಕನ್ನಡ</button>
        <button class="kali-chip" data-level="0">೦ ಅನ್ಯದೇಶ್ಯ</button>
      </div>
      <button class="kali-chip kali-chip-all" data-action="all">ಎಲ್ಲಾ ಆಯ್ಕೆಮಾಡಿ</button>
    </div>
    <div id="card" class="kali-card">Loading...</div>
  </div>
</div>

<script src="/kali/app.js"></script>