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
        <button class="kali-chip" data-level="3">3 ಸಂಸ್ಕೃತ</button>
        <button class="kali-chip" data-level="2">2 ಸಂಸ್ಕೃತ ಪ್ರಭಾವ</button>
        <button class="kali-chip" data-level="1">1 ಕನ್ನಡ ಪದಗಳು</button>
      </div>
      <button class="kali-chip kali-chip-all" data-action="all">ಎಲ್ಲಾ ಆಯ್ಕೆಮಾಡಿ</button>
    </div>
    <div id="card" class="kali-card">Loading...</div>
  </div>
</div>

<script src="/kali/app.js"></script>