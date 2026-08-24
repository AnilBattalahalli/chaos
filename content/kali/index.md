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
        <div class="kali-amount-grid">
          <button class="kali-amount-btn" data-amount="50">₹50</button>
          <button class="kali-amount-btn" data-amount="100">₹100</button>
          <button class="kali-amount-btn" data-amount="250">₹250</button>
          <button class="kali-amount-btn" data-amount="500">₹500</button>
          <button class="kali-amount-btn" data-amount="1000">₹1000</button>
          <button class="kali-amount-btn" data-amount="custom">Custom</button>
        </div>
        <div id="donate-custom-wrap" class="kali-amount-custom-wrap" hidden>
          <input id="donate-custom-input" class="kali-amount-custom-input" type="number" inputmode="decimal" min="1" step="1" placeholder="Enter amount in ₹">
          <div id="donate-amount-error" class="kali-amount-error"></div>
        </div>
        <button id="donate-cta" class="kali-donate-cta" disabled>Select an amount</button>
        <div class="kali-app-row">
          <span class="kali-app-row-label">Or open directly in</span>
          <div class="kali-app-row-buttons">
            <button type="button" class="kali-app-btn" data-app="gpay" disabled>Google Pay</button>
            <button type="button" class="kali-app-btn" data-app="phonepe" disabled>PhonePe</button>
          </div>
        </div>
        <p class="kali-donate-note">This just opens your UPI app with the payment pre-filled — we never see or process the payment ourselves.</p>
        <div class="kali-donate-qr">
          <div id="donate-qr-canvas" hidden></div>
          <p id="donate-qr-caption">Pick or enter an amount to show a scannable QR code here.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script src="/kali/app.js"></script>