---
title: "ಕಲಿ 2.0"
layout: "blank"
---

<div id="kali-splash" class="kali-splash">
  <div class="kali-splash-title">ಕಲಿ 2.0</div>
</div>

<div class="kali-widget-wrapper">
  <div class="kali-container">
    <h1 class="kali-heading">ಕಲಿ 2.0</h1>
    <br>
    <div class="kali-toolbar-secondary">
      <button id="level-toggle" class="kali-secondary-btn" onclick="toggleLevelPanel()" aria-expanded="false">
        Levels<span id="level-count" class="kali-level-count"></span>
      </button>
      <button id="saved-toggle" class="kali-secondary-btn" aria-expanded="false">
        Saved<span id="saved-count" class="kali-level-count"></span>
      </button>
      <button id="quiz-toggle" class="kali-secondary-btn" aria-pressed="false">
        Quiz Mode
      </button>
      <button id="install-toggle" class="kali-secondary-btn" hidden>
        ಸ್ಥಾಪಿಸಿ
      </button>
    </div>
    <div id="level-panel" class="kali-level-panel" hidden>
      <div class="kali-level-grid">
        <label class="kali-level-option">
          <input type="checkbox" class="kali-level-checkbox" data-level="3">
          <span class="kali-checkbox-box"></span>
          <span class="kali-level-label">Pure Sanskrit</span>
        </label>
        <label class="kali-level-option">
          <input type="checkbox" class="kali-level-checkbox" data-level="2">
          <span class="kali-checkbox-box"></span>
          <span class="kali-level-label">Sanskrit Influence</span>
        </label>
        <label class="kali-level-option">
          <input type="checkbox" class="kali-level-checkbox" data-level="1">
          <span class="kali-checkbox-box"></span>
          <span class="kali-level-label">Pure Kannada</span>
        </label>
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