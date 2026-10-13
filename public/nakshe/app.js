/*
 * Nakshe widget: pick lat/lon, marker (heart or dot), zoom and a color style,
 * then download a square PNG with the marker at the center. No text, no credit in
 * the image. Pure frontend: MapLibre GL JS + free OpenFreeMap vector tiles.
 *
 * Needs: maplibre-gl.js and window.NAKSHE_THEMES (themes.js) loaded first.
 */
(function () {
  "use strict";

  var TILES_URL = "https://tiles.openfreemap.org/planet";
  var HEART_RED = "#E0245E";
  var DOT_RED = "#E53935";
  // Line widths in px for a 512 px wide map; scaled to the actual map size
  var BASE = { path: 0.5, minor: 0.8, tertiary: 1.1, secondary: 1.5, primary: 2.0, motorway: 2.5, waterway: 1.2 };

  function match(classes) {
    return ["match", ["get", "class"], classes, true, false];
  }

  function road(id, classes, color, width) {
    return {
      id: id, type: "line", source: "omt", "source-layer": "transportation",
      filter: match(classes),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": color, "line-width": width },
    };
  }

  function buildStyle(t, size) {
    var k = size / 512;
    return {
      version: 8,
      sources: { omt: { type: "vector", url: TILES_URL } },
      layers: [
        { id: "bg", type: "background", paint: { "background-color": t.bg } },
        { id: "grass", type: "fill", source: "omt", "source-layer": "landcover", filter: match(["grass"]),
          paint: { "fill-color": t.parks } },
        { id: "park", type: "fill", source: "omt", "source-layer": "park", paint: { "fill-color": t.parks } },
        { id: "water", type: "fill", source: "omt", "source-layer": "water", paint: { "fill-color": t.water } },
        { id: "waterway", type: "line", source: "omt", "source-layer": "waterway",
          paint: { "line-color": t.water, "line-width": BASE.waterway * k } },
        // thin roads first so major roads end up on top
        road("r-path", ["path", "pedestrian", "track", "service", "busway"], t.other, BASE.path * k),
        road("r-minor", ["minor", "residential", "living_street", "unclassified"], t.residential, BASE.minor * k),
        road("r-tertiary", ["tertiary"], t.tertiary, BASE.tertiary * k),
        road("r-secondary", ["secondary"], t.secondary, BASE.secondary * k),
        road("r-primary", ["primary", "trunk"], t.primary, BASE.primary * k),
        road("r-motorway", ["motorway"], t.motorway, BASE.motorway * k),
      ],
    };
  }

  // Parametric heart, about 32 units wide
  function heartPoints(cx, cy, widthPx) {
    var k = widthPx / 32, pts = [];
    for (var i = 0; i <= 200; i++) {
      var a = (i / 200) * 2 * Math.PI;
      var x = 16 * Math.pow(Math.sin(a), 3);
      var y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
      pts.push([cx + x * k, cy - y * k]);
    }
    return pts;
  }

  function drawMarker(ctx, size, kind, bg) {
    var cx = size / 2, cy = size / 2;
    ctx.fillStyle = kind === "heart" ? HEART_RED : DOT_RED;
    ctx.strokeStyle = bg;
    ctx.lineWidth = size * 0.003;
    ctx.beginPath();
    if (kind === "dot") {
      ctx.arc(cx, cy, size * 0.016, 0, 2 * Math.PI);
    } else {
      heartPoints(cx, cy, size * 0.06).forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); });
      ctx.closePath();
    }
    ctx.fill();
    ctx.stroke();
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function mount(root) {
    var themes = window.NAKSHE_THEMES;
    var state = {
      lat: parseFloat(root.dataset.lat), lon: parseFloat(root.dataset.lon),
      zoom: parseFloat(root.dataset.zoom), theme: root.dataset.theme,
      marker: root.dataset.marker === "dot" ? "dot" : "heart",
    };
    if (!themes[state.theme]) state.theme = Object.keys(themes)[0];

    root.innerHTML =
      '<div class="nk-card"><div class="nk-row">' +
        '<div class="nk-field"><label>Latitude</label><input type="text" inputmode="decimal" class="nk-lat"></div>' +
        '<div class="nk-field"><label>Longitude</label><input type="text" inputmode="decimal" class="nk-lon"></div>' +
      '</div>' +
      '<div class="nk-row"><div class="nk-field"><label>Marker</label>' +
        '<div class="nk-seg"><button type="button" data-m="heart">Red heart</button><button type="button" data-m="dot">Red dot</button></div>' +
      '</div></div>' +
      '<div class="nk-field nk-zoomfield"><label>Zoom <b class="nk-zoomval"></b></label>' +
        '<input type="range" class="nk-zoom" min="3" max="19" step="0.1"></div>' +
      '<div class="nk-kicker">[ style: <span class="nk-themename"></span> ]</div><div class="nk-themes"></div>' +
      '<div class="nk-map"><div class="nk-gl"></div><div class="nk-marker"></div></div>' +
      '<div class="nk-actions">' +
        '<div class="nk-field"><label>Image size</label><select class="nk-size">' +
          '<option value="1024">1024 px</option><option value="2048" selected>2048 px</option></select></div>' +
        '<button type="button" class="nk-download">Download PNG</button>' +
      '</div></div>' +
      '<div class="nk-status" role="status"></div>' +
      (root.dataset.credit === "false" ? "" :
        '<div class="nk-credit">Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a> · tiles by <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a></div>');

    var $ = function (s) { return root.querySelector(s); };
    var latIn = $(".nk-lat"), lonIn = $(".nk-lon"), zoomIn = $(".nk-zoom"), zoomVal = $(".nk-zoomval");
    var themeBox = $(".nk-themes"), themeName = $(".nk-themename"), mapBox = $(".nk-map");
    var glDiv = $(".nk-gl"), markerDiv = $(".nk-marker"), status = $(".nk-status");
    var dlBtn = $(".nk-download"), sizeSel = $(".nk-size");
    var segBtns = root.querySelectorAll(".nk-seg button");

    var map = new maplibregl.Map({
      container: glDiv,
      style: buildStyle(themes[state.theme], mapBox.clientWidth || 512),
      center: [state.lon, state.lat],
      zoom: state.zoom,
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    function theme() { return themes[state.theme]; }

    function drawPreviewMarker() {
      var s = mapBox.clientWidth || 512;
      var c = document.createElement("canvas");
      c.width = c.height = s;
      c.style.width = c.style.height = s + "px";
      drawMarker(c.getContext("2d"), s, state.marker, theme().bg);
      markerDiv.replaceChildren(c);
      markerDiv.style.width = markerDiv.style.height = s + "px";
    }

    function syncInputs() {
      latIn.value = state.lat.toFixed(5);
      lonIn.value = state.lon.toFixed(5);
      zoomIn.value = state.zoom;
      zoomVal.textContent = state.zoom.toFixed(1);
    }

    function applyTheme() {
      themeName.textContent = theme().name;
      themeBox.querySelectorAll(".nk-theme").forEach(function (b) {
        b.setAttribute("aria-pressed", b.dataset.key === state.theme);
      });
      map.setStyle(buildStyle(theme(), mapBox.clientWidth || 512));
      drawPreviewMarker();
    }

    function applyMarker() {
      segBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.m === state.marker); });
      drawPreviewMarker();
    }

    Object.keys(themes).forEach(function (key) {
      var t = themes[key];
      var b = el("button", "nk-theme");
      b.type = "button";
      b.dataset.key = key;
      b.style.background = t.bg;
      b.innerHTML = '<div class="nk-dots">' + [t.motorway, t.primary, t.secondary, t.water]
        .map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") +
        '</div><span style="color:' + t.motorway + '">' + t.name + "</span>";
      b.addEventListener("click", function () { state.theme = key; applyTheme(); });
      themeBox.appendChild(b);
    });

    segBtns.forEach(function (b) {
      b.addEventListener("click", function () { state.marker = b.dataset.m; applyMarker(); });
    });

    function readCoords() {
      var lat = parseFloat(latIn.value), lon = parseFloat(lonIn.value);
      var okLat = isFinite(lat) && Math.abs(lat) <= 85, okLon = isFinite(lon) && Math.abs(lon) <= 180;
      latIn.classList.toggle("nk-bad", !okLat);
      lonIn.classList.toggle("nk-bad", !okLon);
      if (okLat && okLon) {
        state.lat = lat; state.lon = lon;
        map.jumpTo({ center: [lon, lat] });
      }
    }
    latIn.addEventListener("change", readCoords);
    lonIn.addEventListener("change", readCoords);

    zoomIn.addEventListener("input", function () {
      state.zoom = parseFloat(zoomIn.value);
      zoomVal.textContent = state.zoom.toFixed(1);
      map.setZoom(state.zoom);
    });

    // Dragging or scrolling the map keeps the inputs in sync
    map.on("moveend", function () {
      var c = map.getCenter();
      state.lat = c.lat; state.lon = c.lng; state.zoom = map.getZoom();
      latIn.classList.remove("nk-bad"); lonIn.classList.remove("nk-bad");
      syncInputs();
    });

    // Line widths depend on the map size, so restyle when the box is resized
    var lastW = mapBox.clientWidth, timer;
    new ResizeObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var w = mapBox.clientWidth;
        if (w && Math.abs(w - lastW) > 8) { lastW = w; applyTheme(); }
      }, 200);
    }).observe(mapBox);

    // What you see is what you get: same ground area at a larger pixel size
    function exportPng() {
      var size = parseInt(sizeSel.value, 10);
      var preview = mapBox.clientWidth || 512;
      var c = map.getCenter();
      var holder = document.createElement("div");
      holder.style.cssText = "position:fixed;left:-100000px;top:0;width:" + size + "px;height:" + size + "px";
      document.body.appendChild(holder);
      var big = new maplibregl.Map({
        container: holder,
        style: buildStyle(theme(), size),
        center: [c.lng, c.lat],
        zoom: map.getZoom() + Math.log2(size / preview),
        interactive: false,
        attributionControl: false,
        pixelRatio: 1,
        preserveDrawingBuffer: true,
        fadeDuration: 0,
      });
      return new Promise(function (resolve, reject) {
        var done = false;
        var cleanup = function () { big.remove(); holder.remove(); };
        var fail = function (msg) { if (!done) { done = true; cleanup(); reject(new Error(msg)); } };
        var timeout = setTimeout(function () { fail("Timed out loading map tiles"); }, 45000);
        big.on("error", function (e) { if (e && e.error && !/tile/i.test(String(e.error.message))) fail(e.error.message); });
        big.once("idle", function () {
          if (done) return;
          big.once("render", function () {
            if (done) return;
            done = true;
            clearTimeout(timeout);
            var out = document.createElement("canvas");
            out.width = out.height = size;
            var ctx = out.getContext("2d");
            ctx.drawImage(big.getCanvas(), 0, 0, size, size);
            drawMarker(ctx, size, state.marker, theme().bg);
            cleanup();
            out.toBlob(function (blob) { blob ? resolve(blob) : reject(new Error("PNG encode failed")); }, "image/png");
          });
          big.triggerRepaint();
        });
      });
    }

    dlBtn.addEventListener("click", function () {
      dlBtn.disabled = true;
      status.textContent = "Rendering…";
      exportPng().then(function (blob) {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "map_" + state.lat.toFixed(4) + "_" + state.lon.toFixed(4) + "_" + state.theme + ".png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 10000);
        status.textContent = "Downloaded.";
      }).catch(function (e) {
        status.textContent = "Could not render: " + e.message + (sizeSel.value > 1024 ? " (try 1024 px)" : "");
      }).finally(function () { dlBtn.disabled = false; });
    });

    root.__nakshe = { map: map, state: state, exportPng: exportPng };
    syncInputs();
    applyMarker();
    applyTheme();
  }

  function init() {
    document.querySelectorAll(".nakshe-app").forEach(function (r) { if (!r.__nakshe) mount(r); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
