---
title: "ಕಲಿ"
layout: "blank"
---

<div class="kali-widget-wrapper">
  <div class="kali-container">
    <!-- <h1>ಕಲಿ</h1> -->
    <br>
    <div class="kali-toolbar-secondary">
      <button id="level-toggle" class="kali-secondary-btn" onclick="toggleLevelPanel()" aria-expanded="false">
        ಹಂತ<span id="level-count" class="kali-level-count"></span>
      </button>
      <button id="saved-toggle" class="kali-secondary-btn" aria-expanded="false">
        ಉಳಿಸಿದ<span id="saved-count" class="kali-level-count"></span>
      </button>
      <button id="quiz-toggle" class="kali-secondary-btn" aria-pressed="false">
        ಕ್ವಿಜ್
      </button>
      <button id="install-toggle" class="kali-secondary-btn" hidden>
        ಸ್ಥಾಪಿಸಿ
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
    <div id="saved-panel" class="kali-level-panel" hidden>
      <div id="saved-list" class="kali-saved-list"></div>
    </div>
    <div id="card" class="kali-card">Loading...</div>
    <div class="kali-toolbar kali-toolbar-primary">
      <button class="kali-button" onclick="loadRandomEntry()">ಹೊಸ ಪದ</button>
    </div>
  </div>
</div>

<script src="/kali/app.js"></script>