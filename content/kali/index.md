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
    <button id="donate-toggle" class="kali-donate-toggle">
      <span class="heart" aria-hidden="true">&#10084;</span> Donate
    </button>
    <div id="donate-modal-backdrop" class="kali-modal-backdrop" hidden>
      <div class="kali-modal" role="dialog" aria-modal="true" aria-labelledby="donate-modal-title">
        <button id="donate-modal-close" class="kali-modal-close" aria-label="Close">&times;</button>
        <h2 id="donate-modal-title" class="kali-modal-title">ಕಲಿ 2.0 is free for everyone &#10084;</h2>
        <p class="kali-modal-message">If you've found it useful and want to help keep it alive, you can leave a little donation. It helps cover the costs of running and maintaining the project.</p>
        <p class="kali-modal-message">No pressure at all — just thank you for being here. &lt;3</p>
        <div class="kali-pay-with" aria-hidden="true">
          <span class="kali-pay-with-label">Pay with</span>
          <div class="kali-pay-with-icons">
            <span class="kali-pay-with-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.963 7.235A3.963 3.963 0 00.422 9.419a3.963 3.963 0 000 3.559 3.963 3.963 0 003.541 2.184c1.07 0 1.97-.352 2.627-.957.748-.69 1.18-1.71 1.18-2.916a4.722 4.722 0 00-.07-.806H3.964v1.526h2.14a1.835 1.835 0 01-.79 1.205c-.356.241-.814.379-1.35.379-1.034 0-1.911-.697-2.225-1.636a2.375 2.375 0 010-1.517c.314-.94 1.191-1.636 2.225-1.636a2.152 2.152 0 011.52.594l1.132-1.13a3.808 3.808 0 00-2.652-1.033zm6.501.55v6.9h.886V11.89h1.465c.603 0 1.11-.196 1.522-.588a1.911 1.911 0 00.635-1.464 1.92 1.92 0 00-.635-1.456 2.125 2.125 0 00-1.522-.598zm2.427.85a1.156 1.156 0 01.823.365 1.176 1.176 0 010 1.686 1.171 1.171 0 01-.877.357H11.35V8.635h1.487a1.156 1.156 0 01.054 0zm4.124 1.175c-.842 0-1.477.308-1.907.925l.781.491c.288-.417.68-.626 1.175-.626a1.255 1.255 0 01.856.323 1.009 1.009 0 01.366.785v.202c-.34-.193-.774-.289-1.3-.289-.617 0-1.11.145-1.479.434-.37.288-.554.677-.554 1.165a1.476 1.476 0 00.525 1.156c.35.308.785.463 1.305.463.61 0 1.098-.27 1.465-.81h.038v.655h.848v-2.909c0-.61-.19-1.09-.568-1.44-.38-.35-.896-.525-1.551-.525zm2.263.154l1.946 4.422-1.098 2.38h.915L24 9.963h-.965l-1.368 3.391h-.02l-1.406-3.39zm-2.146 2.368c.494 0 .88.11 1.156.33 0 .372-.147.696-.44.973a1.413 1.413 0 01-.997.414 1.081 1.081 0 01-.69-.232.708.708 0 01-.293-.578c0-.257.12-.47.363-.647.24-.173.54-.26.9-.26Z"/></svg></span>
            <span class="kali-pay-with-icon"><svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.206 9.941h2.949v4.692c-.402.201-.938.268-1.34.268-1.072 0-1.609-.536-1.609-1.743V9.941zm13.47 4.816c-1.523 6.449-7.985 10.442-14.433 8.919C2.794 22.154-1.199 15.691.324 9.243 1.847 2.794 8.309-1.199 14.757.324c6.449 1.523 10.442 7.985 8.919 14.433zm-6.231-5.888a.887.887 0 0 0-.871-.871h-1.609l-3.686-4.222c-.335-.402-.871-.536-1.407-.402l-1.274.401c-.201.067-.268.335-.134.469l4.021 3.82H6.386c-.201 0-.335.134-.335.335v.67c0 .469.402.871.871.871h.938v3.217c0 2.413 1.273 3.82 3.418 3.82.67 0 1.206-.067 1.877-.335v2.145c0 .603.469 1.072 1.072 1.072h.938a.432.432 0 0 0 .402-.402V9.874h1.542c.201 0 .335-.134.335-.335v-.67z"/></svg></span>
          </div>
        </div>
        <div class="kali-upi-id-row">
          <span class="kali-upi-id-label">Copy the UPI ID and pay from your own app:</span>
          <div class="kali-upi-id-copy">
            <code id="donate-upi-id-text" class="kali-upi-id-text"></code>
            <button type="button" id="donate-copy-upi" class="kali-copy-upi-btn">Copy</button>
          </div>
        </div>
        <p class="kali-donate-note">We never see or process the payment ourselves — this just copies the ID so you can pay however you like.</p>
      </div>
    </div>
  </div>
</div>

<script src="/kali/app.js"></script>