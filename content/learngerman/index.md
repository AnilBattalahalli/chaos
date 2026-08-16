---
title: "Learn German"
layout: "blank"
description: "German grammar-drill flashcards."
---

<div id="learngerman-splash" class="learngerman-splash">
  <div class="splash-greeting">Hi, 🌻</div>
  <div class="splash-loading">loading...</div>
</div>

<div class="lg-app">
  <button id="lg-menu-btn" class="lg-icon-btn lg-menu-btn" aria-label="Choose lesson" type="button">☰</button>
  <button id="lg-help-btn" class="lg-icon-btn lg-help-btn" aria-label="Help" type="button">?</button>
  <aside id="lg-sidebar" class="lg-sidebar">
    <div class="lg-sidebar-header">Lessons</div>
    <ul id="lg-lesson-list" class="lg-lesson-list"></ul>
  </aside>
  <div id="lg-sidebar-backdrop" class="lg-sidebar-backdrop" hidden></div>
  <div class="learngerman-widget-wrapper">
    <div class="learngerman-container">
      <div class="lg-header">
        <div id="lg-lesson-title" class="lg-lesson-title">Loading…</div>
        <div id="lg-progress" class="lg-progress"></div>
      </div>
      <div id="card" class="learngerman-card">
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back"></div>
        </div>
      </div>
      <label class="lg-switch">
        <input type="checkbox" id="lg-noun-toggle" checked>
        <span class="lg-switch-track"><span class="lg-switch-thumb"></span></span>
        <span class="lg-switch-label">Keep nouns in English</span>
      </label>
      <div class="lg-nav">
        <button id="lg-prev" class="lg-nav-btn" type="button">‹ Prev</button>
        <button id="lg-next" class="lg-nav-btn" type="button">Next ›</button>
      </div>
    </div>
  </div>
  <div id="lg-help-modal" class="lg-modal" hidden>
    <div class="lg-modal-backdrop"></div>
    <div class="lg-modal-panel">
      <button id="lg-help-close" class="lg-modal-close" type="button">✕</button>
      <div id="lg-cheatsheet" class="lg-cheatsheet"></div>
    </div>
  </div>
</div>

<script src="/learngerman/app.js"></script>
