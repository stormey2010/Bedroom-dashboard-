const MARKUP = "\n  <div class=\"app\">\n    <header class=\"top\">\n      <div class=\"brand\">\n        <h1>Hello, Parker</h1>\n        <p class=\"sub\" id=\"greeting\">Welcome back</p>\n      </div>\n      <div class=\"top-right\">\n        <div class=\"stat temp\" id=\"statTemp\"><i data-lucide=\"thermometer\"></i><span>\u00e2\u20ac\u201d</span></div>\n        <div class=\"stat hum\" id=\"statHum\"><i data-lucide=\"droplets\"></i><span>\u00e2\u20ac\u201d</span></div>\n        <div class=\"stat\" id=\"statPresence\"><span class=\"presence-dot\" id=\"presenceDot\"></span><span>\u00e2\u20ac\u201d</span></div>\n        <div class=\"clock\" id=\"clock\">\u00e2\u20ac\u201d</div>\n      </div>\n    </header>\n\n    <section class=\"hero\" id=\"hero\"></section>\n\n    <div class=\"dashboard\">\n      <section class=\"panel d1 bento-lights\">\n        <div class=\"panel-head\">\n          <h2>Lights</h2>\n        </div>\n        <div class=\"light-grid\" id=\"lights\"></div>\n      </section>\n\n      <section class=\"panel d2 bento-modes\">\n        <div class=\"panel-head\">\n          <h2>Modes</h2>\n        </div>\n        <div class=\"modes\" id=\"modes\"></div>\n      </section>\n\n      <section class=\"panel d3 bento-fan\">\n        <div class=\"panel-head\">\n          <h2>Fan</h2>\n        </div>\n        <div id=\"fan\"></div>\n      </section>\n\n      <section class=\"panel d3 bento-plugs\">\n        <div class=\"panel-head\">\n          <h2>Plugs</h2>\n        </div>\n        <div class=\"plug-grid\" id=\"plugs\"></div>\n      </section>\n\n      <section class=\"wally bento-wally\" id=\"wally\"></section>\n\n      <section class=\"panel d4 bento-windows\">\n        <div class=\"panel-head\">\n          <h2>Security</h2>\n        </div>\n        <div class=\"win-grid\" id=\"windows\"></div>\n      </section>\n\n      <section class=\"panel d5 bento-media\">\n        <div class=\"panel-head\">\n          <h2>Media</h2>\n        </div>\n        <div class=\"media-grid\" id=\"mediaDevices\"></div>\n        <div class=\"announcement\">\n          <input id=\"announcementText\" type=\"text\" maxlength=\"240\" placeholder=\"Announcement message\">\n          <button type=\"button\" id=\"announceDot\"><i data-lucide=\"message-square\"></i> Echo Dot</button>\n          <button type=\"button\" id=\"announceShow\"><i data-lucide=\"message-square\"></i> Echo Show</button>\n        </div>\n      </section>\n\n      <section class=\"panel d5 bento-pc\">\n        <div class=\"panel-head\">\n          <h2>PC</h2>\n        </div>\n        <div class=\"pc-card\" id=\"pcCard\"></div>\n      </section>\n    </div>\n  </div>\n\n  <div class=\"modal-backdrop\" id=\"modalBackdrop\">\n    <div class=\"modal\" id=\"modal\"></div>\n  </div>\n\n  <div class=\"toasts\" id=\"toasts\"></div>\n  <div class=\"confirm-backdrop\" id=\"confirm\">\n    <div class=\"confirm\">\n      <h3 id=\"confirmTitle\">Confirm</h3>\n      <p id=\"confirmBody\"></p>\n      <div class=\"confirm-actions\">\n        <button type=\"button\" id=\"confirmCancel\">Cancel</button>\n        <button type=\"button\" class=\"go\" id=\"confirmGo\">Confirm</button>\n      </div>\n    </div>\n  </div>";

function initializeDashboard(root) {
      "use strict";

      const LIGHTS = [
        { id: "light.all_lights", name: "All Lights", icon: "lightbulb" },
        { id: "light.fan_light", name: "Fan Light", icon: "lightbulb", expand: "fanLights" },
        { id: "light.corner_lamp", name: "Corner Lamp", icon: "lamp" },
        { id: "light.nightstand_light_light", name: "Nightstand", icon: "lamp" },
      ];
      const FAN_LIGHTS = [
        { id: "light.smart_rgbtw_bulb_3", name: "Fan Light 1", icon: "lightbulb" },
        { id: "light.fan_light_2_2", name: "Fan Light 2", icon: "lightbulb" },
      ];
      const GROUP_MEMBERS = {
        "light.all_lights": ["light.fan_light", "light.corner_lamp", "light.nightstand_light_light"],
        "light.fan_light": ["light.smart_rgbtw_bulb_3", "light.fan_light_2_2"],
      };
      const FAN = {
        id: "fan.fan",
        speeds: [
          { label: "Off", pct: 0 },
          { label: "Low", pct: 33 },
          { label: "Med", pct: 67 },
          { label: "High", pct: 100 },
        ],
      };
      const SWATCHES = [
        [255, 80, 80], [255, 150, 60], [255, 214, 100], [90, 214, 140], [80, 150, 255], [170, 110, 255], [255, 255, 255],
      ];
      const SECURITY = [
        { id: "binary_sensor.left_window", name: "Left Window", icon: "panel-left-open", kind: "opening" },
        { id: "binary_sensor.right_window", name: "Right Window", icon: "panel-right-open", kind: "opening" },
        { id: "binary_sensor.motion_dector", name: "Motion Detector", icon: "person-standing", kind: "motion" },
        { id: "binary_sensor.aqara_motion_sensor_p1_occupancy", name: "Aqara Motion", icon: "scan", kind: "motion" },
      ];
      const PLUGS = [
        { id: "switch.airpods", name: "AirPods Charger", icon: "headphones" },
        { id: "switch.bookshelf_plug", name: "Bookshelf Plug", icon: "book-open" },
        { id: "switch.alexa_plug", name: "Alexa Plug", icon: "speaker" },
        { id: "switch.computer_plug", name: "Computer", icon: "monitor", confirmOff: true, confirmTitle: "Cut computer power?", confirmBody: "Only use this if the PC is already off. Prefer Shutdown for a running PC." },
        { id: "switch.3d_printer_plug", name: "3D Printer", icon: "printer", confirmOff: true, confirmTitle: "Cut printer power?", confirmBody: "Make sure the printer is idle before cutting power." },
      ];
      const MEDIA = [
        { id: "media_player.parker_s_echo_dot", name: "Parker's Echo Dot", icon: "speaker" },
        { id: "media_player.parker_s_echo_show", name: "Parker's Echo Show", icon: "monitor-speaker" },
      ];
      const MODES = [
        { id: "input_boolean.automations", name: "Automations", icon: "zap" },
        { id: "input_boolean.guest_mode", name: "Guest Mode", icon: "users" },
      ];
      const SUCTION = ["quiet", "balanced", "turbo", "max", "gentle"];
      const WALLY_ACTIONS = [
        { id: "start", label: "Start", icon: "play", service: "start", primary: true },
        { id: "pause", label: "Pause", icon: "pause", service: "pause" },
        { id: "dock", label: "Dock", icon: "home", service: "return_to_base" },
        { id: "locate", label: "Locate", icon: "radar", service: "locate" },
        { id: "spot", label: "Spot", icon: "focus", service: "clean_spot" },
      ];

      let currentHass = null;
      const optimisticTimers = new Map();
      let optimistic = new Proxy({}, {
        set(target, entityId, value) {
          target[entityId] = value;
          const oldTimer = optimisticTimers.get(entityId);
          if (oldTimer) clearTimeout(oldTimer);
          optimisticTimers.set(entityId, setTimeout(() => {
            clearOptimistic(entityId);
            renderForEntities([entityId]);
          }, 8000));
          return true;
        },
      });
      let openTune = {};
      let wallyMoreOpen = false;
      let activeModal = null;
      let confirmCb = null;

      function icon(name, size) {
        const i = document.createElement("i");
        i.setAttribute("data-lucide", name);
        if (size) i.style.fontSize = size + "px";
        return i;
      }
      function mountIcons(root) {
        if (window.lucide?.createIcons) lucide.createIcons({ attrs: { "stroke-width": 2 }, root: root || root });
      }
      function el(tag, cls, kids) {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        (kids || []).forEach((c) => c && n.appendChild(c));
        return n;
      }
      function txt(s) { return document.createTextNode(s); }

      function getRaw(id) {
        const base = currentHass?.states?.[id];
        const over = optimistic[id];
        if (!base && !over) return null;
        if (!base) return over;
        if (!over) return base;
        return {
          ...base,
          state: over.state !== undefined ? over.state : base.state,
          attributes: { ...base.attributes, ...(over.attributes || {}) },
        };
      }
      function get(id) {
        const entity = getRaw(id);
        const members = GROUP_MEMBERS[id];
        if (!members?.length) return entity;

        // Home Assistant group entities can arrive after their bulbs. Derive
        // their on/off state from the members so Fan Light and All Lights can
        // never briefly show the stale group state.
        const availableMembers = members.map((memberId) => get(memberId)).filter((member) => !unavailable(member));
        if (!availableMembers.length) return entity;
        return {
          ...(entity || {}),
          state: availableMembers.some((member) => member.state === "on") ? "on" : "off",
          attributes: entity?.attributes || {},
        };
      }
      function unavailable(e) {
        return !e || e.state === "unavailable" || e.state === "unknown";
      }
      function on(e) { return e && e.state === "on"; }
      function val(id, fallback = "—") {
        const e = get(id);
        if (unavailable(e)) return fallback;
        return e.state;
      }
      function num(id) {
        const e = get(id);
        if (unavailable(e)) return null;
        const n = parseFloat(e.state);
        return Number.isFinite(n) ? n : null;
      }

      function lightTargets(entityId) {
        const targets = new Set();
        const add = (id) => {
          if (targets.has(id)) return;
          targets.add(id);
          (GROUP_MEMBERS[id] || []).forEach(add);
        };
        add(entityId);
        return [...targets];
      }
      function applyOptimistic(entityIds, state, attributes = {}, confirmationAttributes = attributes) {
        entityIds.forEach((entityId) => {
          const current = get(entityId);
          optimistic[entityId] = {
            ...(current || {}),
            state,
            attributes: { ...(current?.attributes || {}), ...attributes },
            // Keep only the values this action actually chose. Existing HA
            // attributes are display data, not part of the confirmation test.
            predictedAttributes: confirmationAttributes,
          };
        });
        renderForEntities(entityIds);
      }
      function optimisticMatches(entityId, real) {
        const predicted = optimistic[entityId];
        if (!predicted || !real || predicted.state !== real.state) return false;
        const sameValue = (expected, actual) => {
          if (Array.isArray(expected) && Array.isArray(actual)) {
            return expected.length === actual.length && expected.every((value, index) => sameValue(value, actual[index]));
          }
          if (typeof expected === "number" && typeof actual === "number") {
            return Math.abs(expected - actual) <= 0.011;
          }
          return expected === actual;
        };
        return Object.entries(predicted.predictedAttributes || {}).every(([key, value]) => sameValue(value, real.attributes?.[key]));
      }

      async function callService(domain, service, data = {}, affectedEntities = []) {
        if (!currentHass) { toast("Home Assistant is not connected", "error"); return false; }
        try { await currentHass.callService(domain, service, data); return true; }
        catch (err) {
          console.error(err);
          const affected = affectedEntities.length ? affectedEntities : Object.keys(optimistic);
          affected.forEach(clearOptimistic);
          if (affected.length) renderForEntities(affected);
          toast(err?.message || "Request failed", "error");
          return false;
        }
      }

      function toast(message, type = "error") {
        const box = root.getElementById("toasts");
        const node = el("div", `toast ${type}`, [
          icon(type === "error" ? "triangle-alert" : "check", 16),
          el("span", "", [txt(message)]),
        ]);
        box.appendChild(node);
        mountIcons(node);
        setTimeout(() => {
          node.classList.add("leaving");
          setTimeout(() => node.remove(), 200);
        }, 3200);
      }

      function askConfirm(title, body, onYes) {
        root.getElementById("confirmTitle").textContent = title;
        root.getElementById("confirmBody").textContent = body;
        confirmCb = onYes;
        root.getElementById("confirm").classList.add("show");
      }
      root.getElementById("confirmCancel").onclick = () => {
        confirmCb = null;
        root.getElementById("confirm").classList.remove("show");
      };
      root.getElementById("confirmGo").onclick = () => {
        const cb = confirmCb;
        confirmCb = null;
        root.getElementById("confirm").classList.remove("show");
        if (cb) cb();
      };

      function openModal(type) {
        activeModal = type;
        renderModal();
        root.getElementById("modalBackdrop").classList.add("show");
      }
      function closeModal() {
        activeModal = null;
        root.getElementById("modalBackdrop").classList.remove("show");
      }
      root.getElementById("modalBackdrop").addEventListener("click", (e) => {
        if (e.target.id === "modalBackdrop") closeModal();
      });

      async function toggle(entityId) {
        const domain = entityId.split(".")[0];
        const map = { light: "toggle", switch: "toggle", fan: "toggle", input_boolean: "toggle" };
        const service = map[domain];
        if (!service) return;
        const cur = get(entityId);
        const next = cur && cur.state === "on" ? "off" : "on";
        const affected = domain === "light" ? lightTargets(entityId) : [entityId];
        applyOptimistic(affected, next);
        await callService(domain, service, { entity_id: entityId }, affected);
      }

      function togglePlug(cfg) {
        const e = get(cfg.id);
        if (unavailable(e)) return;
        if (cfg.confirmOff && on(e)) {
          askConfirm(cfg.confirmTitle, cfg.confirmBody, () => toggle(cfg.id));
          return;
        }
        toggle(cfg.id);
      }

      async function setBrightness(id, pct) {
        const affected = lightTargets(id);
        const brightness = Math.round(pct * 2.55);
        applyOptimistic(affected, "on", { brightness_pct: pct, brightness }, { brightness });
        await callService("light", "turn_on", { entity_id: id, brightness_pct: pct }, affected);
      }
      async function setKelvin(id, k) {
        const affected = lightTargets(id);
        applyOptimistic(affected, "on", { color_temp_kelvin: k });
        await callService("light", "turn_on", { entity_id: id, color_temp_kelvin: k }, affected);
      }
      async function setColor(id, rgb) {
        const affected = lightTargets(id);
        applyOptimistic(affected, "on", { rgb_color: rgb });
        await callService("light", "turn_on", { entity_id: id, rgb_color: rgb }, affected);
      }
      async function setFan(pct) {
        if (pct <= 0) {
          applyOptimistic([FAN.id], "off", { percentage: 0 });
          await callService("fan", "turn_off", { entity_id: FAN.id }, [FAN.id]);
          return;
        }
        applyOptimistic([FAN.id], "on", { percentage: pct });
        await callService("fan", "set_percentage", { entity_id: FAN.id, percentage: pct }, [FAN.id]);
      }
      async function curtains(open) {
        const left = get("cover.left_curtain");
        const right = get("cover.right_curtain");
        const state = open ? "open" : "closed";
        applyOptimistic(["cover.left_curtain", "cover.right_curtain"], state);
        const service = open ? "curtains_silent_open" : "curtains_silent_close";
        await callService("script", service, {}, ["cover.left_curtain", "cover.right_curtain"]);
      }
      async function vacuumAction(service) {
        const next = { start: "cleaning", clean_spot: "cleaning", pause: "paused", return_to_base: "returning" }[service];
        if (next) applyOptimistic(["vacuum.wally"], next);
        await callService("vacuum", service, { entity_id: "vacuum.wally" }, ["vacuum.wally"]);
      }
      async function setSuction(speed) {
        applyOptimistic(["vacuum.wally"], get("vacuum.wally")?.state || "idle", { fan_speed: speed });
        await callService("vacuum", "set_fan_speed", { entity_id: "vacuum.wally", fan_speed: speed }, ["vacuum.wally"]);
      }
      async function mediaCommand(entityId, service, data = {}) {
        const current = get(entityId);
        if (service === "media_play_pause") applyOptimistic([entityId], current?.state === "playing" ? "paused" : "playing");
        if (service === "volume_mute") applyOptimistic([entityId], current?.state || "idle", { is_volume_muted: !!data.is_volume_muted });
        await callService("media_player", service, { entity_id: entityId, ...data }, [entityId]);
      }
      async function setMediaVolume(entityId, value) {
        const current = get(entityId);
        applyOptimistic([entityId], current?.state || "idle", { volume_level: value });
        await callService("media_player", "volume_set", { entity_id: entityId, volume_level: value }, [entityId]);
      }
      async function announceOn(entityId) {
        const input = root.getElementById("announcementText");
        const message = input.value.trim();
        if (!message) {
          toast("Enter an announcement first", "error");
          return;
        }
        const ok = await callService("notify", "alexa_media", { message, target: [entityId], data: { type: "announce" } });
        if (ok) {
          input.value = "";
          toast("Announcement sent", "ok");
        }
      }
      async function selectOption(entityId, option) {
        optimistic[entityId] = { state: option };
        renderForEntities([entityId]);
        await callService("select", "select_option", { entity_id: entityId, option }, [entityId]);
      }
      async function setNumber(entityId, value) {
        optimistic[entityId] = { state: String(value) };
        renderForEntities([entityId]);
        await callService("number", "set_value", { entity_id: entityId, value }, [entityId]);
      }
      async function wakePc() {
        if (await callService("button", "press", { entity_id: "button.wake_on_lan_d8_43_ae_6e_e7_88" })) {
          toast("Wake sent", "ok");
          
        }
      }
      async function shutdownPc() {
        askConfirm("Shut down PC?", "This will gracefully shut down the computer.", async () => {
          if (await callService("script", "turn_on", { entity_id: "script.shutdown_pc" })) toast("Shutdown started", "ok");
        });
      }

      function brightnessPct(e) {
        if (!e?.attributes) return 100;
        if (e.attributes.brightness_pct != null) return Math.round(e.attributes.brightness_pct);
        if (e.attributes.brightness != null) return Math.round((e.attributes.brightness / 255) * 100);
        return 100;
      }
      function kelvin(e) {
        if (e?.attributes?.color_temp_kelvin) return Math.round(e.attributes.color_temp_kelvin);
        if (e?.attributes?.color_temp) return Math.round(1000000 / e.attributes.color_temp);
        return 4000;
      }
      function curtainState() {
        const L = get("cover.left_curtain");
        const R = get("cover.right_curtain");
        const states = [L?.state, R?.state].filter(Boolean);
        if (!states.length) return { label: "Unknown", open: false, closed: false };
        if (states.every((s) => s === "open" || s === "opening")) return { label: "Open", open: true, closed: false };
        if (states.every((s) => s === "closed" || s === "closing")) return { label: "Closed", open: false, closed: true };
        return { label: "Partly open", open: true, closed: false };
      }
      function coverLabel(id) {
        const e = get(id);
        if (unavailable(e)) return "Unavailable";
        const s = e.state;
        if (s === "open") return "Open";
        if (s === "closed") return "Closed";
        if (s === "opening") return "Opening…";
        if (s === "closing") return "Closing…";
        return String(s);
      }
      function titleCase(s) {
        return String(s || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      }
      function hoursLeft(id) {
        const n = num(id);
        if (n == null) return "—";
        return `${Math.round(n)}h`;
      }

      function updateStat(id, value, muted) {
        const node = root.getElementById(id);
        if (!node) return;
        let span = [...node.querySelectorAll("span")].find((s) => !s.classList.contains("presence-dot"));
        if (!span) {
          span = document.createElement("span");
          node.appendChild(span);
        }
        span.className = muted ? "muted" : "";
        span.textContent = value;
      }

      function updateClock() {
        const now = new Date();
        root.getElementById("clock").textContent = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        root.getElementById("greeting").textContent = "Welcome back";
      }

      function renderHeaderStats() {
        const temp = get("sensor.room_temperature_sensor");
        const hum = get("sensor.room_humidity_sensor_humidity");
        const presence = get("binary_sensor.aqara_presence_multisensor_fp300_occupancy")
          || get("binary_sensor.whole_room_sensor");

        updateStat("statTemp", unavailable(temp) ? "—" : `${Math.round(parseFloat(temp.state))}°`);
        updateStat("statHum", unavailable(hum) ? "—" : `${Math.round(parseFloat(hum.state))}%`);
        const occupied = presence && presence.state === "on";
        const dot = root.getElementById("presenceDot");
        if (dot) dot.classList.toggle("on", !!occupied && !unavailable(presence));
        updateStat("statPresence", unavailable(presence) ? "—" : occupied ? "Occupied" : "Empty");
      }

      function renderLightCard(cfg, opts = {}) {
        const e = get(cfg.id);
        const isOn = on(e);
        const un = unavailable(e);
        const card = el("div", `light${isOn ? " on" : ""}${un ? " dim" : ""}`);
        const top = el("div", "light-top");
        const left = el("div", "light-left");
        left.appendChild(el("div", "light-ico", [icon(cfg.icon, 15)]));
        const names = el("div");
        names.appendChild(el("div", "light-name", [txt(cfg.name)]));
        names.appendChild(el("div", "light-meta", [txt(un ? "Unavailable" : isOn ? `${brightnessPct(e)}%` : "Off")]));
        left.appendChild(names);
        top.appendChild(left);

        const actions = el("div", "light-actions");
        if (!un) {
          if (cfg.expand) {
            const expand = el("button", "icon-btn sky", [icon("panels-top-left", 12)]);
            expand.type = "button";
            expand.title = "Expand";
            expand.onclick = (ev) => { ev.stopPropagation(); openModal(cfg.expand); };
            actions.appendChild(expand);
          }
          if (!opts.hideTune) {
            const tune = el("button", `icon-btn${openTune[cfg.id] ? " active" : ""}`, [icon("palette", 12)]);
            tune.type = "button";
            tune.onclick = (ev) => {
              ev.stopPropagation();
              openTune[cfg.id] = !openTune[cfg.id];
              renderForEntities(Object.keys(optimistic));
            };
            actions.appendChild(tune);
          }
          actions.appendChild(el("div", `switch${isOn ? " on" : ""}`));
        }
        top.appendChild(actions);
        card.appendChild(top);

        if (!un) {
          const bright = el("div", "bright");
          const range = document.createElement("input");
          range.type = "range"; range.min = "1"; range.max = "100"; range.value = String(brightnessPct(e));
          range.onclick = (ev) => ev.stopPropagation();
          range.onchange = () => setBrightness(cfg.id, parseInt(range.value, 10));
          bright.appendChild(range);
          bright.appendChild(icon("sun", 13));
          card.appendChild(bright);

          if (!opts.hideTune) {
            const tune = el("div", `tune${openTune[cfg.id] ? " open" : ""}`);
            tune.appendChild(el("div", "tune-label", [txt("Temperature")]));
            const kRow = el("div", "kelvin");
            const k = kelvin(e);
            const kRange = document.createElement("input");
            kRange.type = "range"; kRange.min = "2000"; kRange.max = "6500"; kRange.step = "100"; kRange.value = String(k);
            kRange.onclick = (ev) => ev.stopPropagation();
            const kVal = el("span", "kelvin-val", [txt(`${k}K`)]);
            kRange.oninput = () => { kVal.textContent = `${kRange.value}K`; };
            kRange.onchange = () => setKelvin(cfg.id, parseInt(kRange.value, 10));
            kRow.appendChild(kRange); kRow.appendChild(kVal);
            tune.appendChild(kRow);
            tune.appendChild(el("div", "tune-label", [txt("Color")]));
            const sw = el("div", "swatches");
            SWATCHES.forEach((rgb) => {
              const d = el("div", "swatch");
              d.style.background = `rgb(${rgb.join(",")})`;
              d.onclick = (ev) => { ev.stopPropagation(); setColor(cfg.id, rgb); };
              sw.appendChild(d);
            });
            tune.appendChild(sw);
            card.appendChild(tune);
          }

          card.onclick = (ev) => {
            if (ev.target.tagName === "INPUT" || ev.target.closest(".icon-btn")) return;
            toggle(cfg.id);
          };
        }
        return card;
      }

      function renderHero() {
        const container = root.getElementById("hero");
        container.innerHTML = "";

        const all = get("light.all_lights");
        const allOn = on(all);
        const lights = el("div", `hero-card action amber${allOn ? " on" : ""}`);
        lights.appendChild(el("div", "hero-top", [
          el("div", "hero-label", [txt("Master")]),
          el("div", "hero-icon", [icon("lightbulb", 18)]),
        ]));
        lights.appendChild(el("div", "hero-title", [txt("All Lights")]));
        lights.appendChild(el("div", "hero-state", [txt(unavailable(all) ? "Unavailable" : allOn ? `${brightnessPct(all)}% · On` : "Off")]));
        if (!unavailable(all)) lights.onclick = () => toggle("light.all_lights");
        container.appendChild(lights);

        const fanE = get(FAN.id);
        const fanOn = on(fanE);
        const pct = fanE?.attributes?.percentage ?? 0;
        const fan = el("div", `hero-card action mint${fanOn ? " on" : ""}`);
        fan.appendChild(el("div", "hero-top", [
          el("div", "hero-label", [txt("Airflow")]),
          el("div", "hero-icon", [icon("fan", 18)]),
        ]));
        fan.appendChild(el("div", "hero-title", [txt("Fan")]));
        fan.appendChild(el("div", "hero-state", [txt(unavailable(fanE) ? "Unavailable" : fanOn ? `On · ${Math.round(pct)}%` : "Off")]));
        if (!unavailable(fanE)) fan.onclick = () => toggle(FAN.id);
        container.appendChild(fan);

        const cs = curtainState();
        const curt = el("div", "hero-card sky");
        curt.appendChild(el("div", "hero-top", [
          el("div", "hero-label", [txt("Coverings")]),
          el("div", "hero-icon", [icon("blinds", 18)]),
        ]));
        curt.appendChild(el("div", "hero-title", [txt("Curtains")]));
        curt.appendChild(el("div", "hero-state", [txt(cs.label)]));
        const actions = el("div", "curtain-actions");
        const openBtn = el("button", `curtain-btn${cs.open && !cs.closed ? " active" : ""}`, [icon("chevron-up", 14), txt("Open")]);
        const closeBtn = el("button", `curtain-btn${cs.closed ? " active" : ""}`, [icon("chevron-down", 14), txt("Close")]);
        const moreBtn = el("button", "curtain-btn ghost", [icon("panels-top-left", 14)]);
        openBtn.type = "button"; closeBtn.type = "button"; moreBtn.type = "button";
        moreBtn.title = "Details";
        openBtn.onclick = (e) => { e.stopPropagation(); curtains(true); };
        closeBtn.onclick = (e) => { e.stopPropagation(); curtains(false); };
        moreBtn.onclick = (e) => { e.stopPropagation(); openModal("curtains"); };
        actions.appendChild(openBtn); actions.appendChild(closeBtn); actions.appendChild(moreBtn);
        curt.appendChild(actions);
        container.appendChild(curt);
      }

      function renderLights() {
        const container = root.getElementById("lights");
        container.innerHTML = "";
        LIGHTS.forEach((cfg) => container.appendChild(renderLightCard(cfg)));
      }

      function renderFan() {
        const container = root.getElementById("fan");
        container.innerHTML = "";
        const e = get(FAN.id);
        const isOn = on(e);
        const un = unavailable(e);
        const pct = e?.attributes?.percentage ?? 0;
        const body = el("div", `fan-body${isOn ? " on" : ""}`);
        const top = el("div", "fan-top");
        const left = el("div", "fan-left");
        left.appendChild(el("div", "fan-ico", [icon("fan", 17)]));
        const names = el("div");
        names.appendChild(el("div", "fan-name", [txt("Ceiling Fan")]));
        names.appendChild(el("div", "fan-meta", [txt(un ? "Unavailable" : isOn ? `${Math.round(pct)}%` : "Off")]));
        left.appendChild(names);
        top.appendChild(left);
        if (!un) {
          top.appendChild(el("div", `switch mint${isOn ? " on" : ""}`));
          top.style.cursor = "pointer";
          top.onclick = () => toggle(FAN.id);
        }
        body.appendChild(top);
        if (!un) {
          const speeds = el("div", "speeds");
          FAN.speeds.forEach((s) => {
            const active = isOn ? Math.abs(pct - s.pct) <= 16 : s.pct === 0;
            const btn = el("div", `speed${active ? " active" : ""}`, [txt(s.label)]);
            btn.onclick = (ev) => { ev.stopPropagation(); setFan(s.pct); };
            speeds.appendChild(btn);
          });
          body.appendChild(speeds);
        }
        container.appendChild(body);
      }

      function renderWindows() {
        const container = root.getElementById("windows");
        container.innerHTML = "";
        SECURITY.forEach((cfg) => {
          const e = get(cfg.id);
          const un = unavailable(e);
          const active = e && e.state === "on";
          const card = el("div", `win${un ? "" : active ? " open" : " closed"}`);
          card.appendChild(el("div", "win-ico", [icon(cfg.icon, 14)]));
          const names = el("div");
          names.appendChild(el("div", "win-name", [txt(cfg.name)]));
          const activeLabel = cfg.kind === "motion" ? "Detected" : "Open";
          const inactiveLabel = cfg.kind === "motion" ? "Clear" : "Closed";
          names.appendChild(el("div", "win-meta", [txt(un ? "—" : active ? activeLabel : inactiveLabel)]));
          card.appendChild(names);
          container.appendChild(card);
        });
      }

      function renderPlugs() {
        const container = root.getElementById("plugs");
        container.innerHTML = "";
        PLUGS.forEach((cfg) => {
          const e = get(cfg.id);
          const isOn = on(e);
          const un = unavailable(e);
          const card = el("div", `plug${isOn ? " on" : ""}${un ? " dim" : ""}`);
          const top = el("div", "plug-top");
          top.appendChild(el("div", "plug-ico", [icon(cfg.icon, 15)]));
          if (!un) top.appendChild(el("div", `switch sky${isOn ? " on" : ""}`));
          card.appendChild(top);
          card.appendChild(el("div", "plug-name", [txt(cfg.name)]));
          card.appendChild(el("div", "plug-meta", [txt(un ? "Unavailable" : isOn ? "On" : "Off")]));
          if (!un) card.onclick = () => togglePlug(cfg);
          container.appendChild(card);
        });
      }

      function renderMedia() {
        const container = root.getElementById("mediaDevices");
        if (!container) return;
        container.innerHTML = "";
        MEDIA.forEach((cfg) => {
          const e = get(cfg.id);
          const un = unavailable(e);
          const attrs = e?.attributes || {};
          const playing = e?.state === "playing";
          const muted = !!attrs.is_volume_muted;
          const volume = Math.round((attrs.volume_level ?? 0) * 100);
          const card = el("div", `media-device${un ? " dim" : ""}`);
          const head = el("div", "media-head");
          const identity = el("div", "media-identity");
          identity.appendChild(el("div", "media-ico", [icon(cfg.icon, 16)]));
          const names = el("div");
          names.appendChild(el("div", "media-name", [txt(cfg.name)]));
          names.appendChild(el("div", "media-state", [txt(un ? "Unavailable" : titleCase(e.state))]));
          identity.appendChild(names); head.appendChild(identity);
          card.appendChild(head);

          const now = el("div", "media-now");
          now.appendChild(el("div", "media-label", [txt("Current media")]));
          now.appendChild(el("div", "media-title", [txt(attrs.media_title || (playing ? "Playing" : "Nothing playing"))]));
          now.appendChild(el("div", "media-artist", [txt(attrs.media_artist || attrs.source || "Ready")]));
          card.appendChild(now);

          const bottom = el("div", "media-bottom");
          const controls = el("div", "media-controls");
          const actions = [
            ["skip-back", "Previous", "media_previous_track"],
            [playing ? "pause" : "play", playing ? "Pause" : "Play", "media_play_pause"],
            ["skip-forward", "Next", "media_next_track"],
          ];
          actions.forEach(([iconName, label, service]) => {
            const button = el("button", `media-control${service === "media_play_pause" && playing ? " active" : ""}`, [icon(iconName, 14)]);
            button.type = "button"; button.title = label; button.disabled = un;
            if (!un) button.onclick = () => mediaCommand(cfg.id, service);
            controls.appendChild(button);
          });
          const mute = el("button", `media-control${muted ? " active" : ""}`, [icon(muted ? "volume-x" : "volume-2", 14)]);
          mute.type = "button"; mute.title = muted ? "Unmute" : "Mute"; mute.disabled = un;
          if (!un) mute.onclick = () => mediaCommand(cfg.id, "volume_mute", { is_volume_muted: !muted });
          controls.appendChild(mute); bottom.appendChild(controls);

          const volumeRow = el("div", "media-volume", [icon("volume-1", 13)]);
          const slider = document.createElement("input");
          slider.type = "range"; slider.min = "0"; slider.max = "1"; slider.step = ".01"; slider.value = String(attrs.volume_level ?? 0); slider.disabled = un;
          slider.onchange = () => setMediaVolume(cfg.id, Number(slider.value));
          volumeRow.appendChild(slider); volumeRow.appendChild(el("span", "", [txt(`${volume}%`)]));
          bottom.appendChild(volumeRow); card.appendChild(bottom); container.appendChild(card);
        });
        mountIcons(container);
      }

      function renderModes() {
        const container = root.getElementById("modes");
        container.innerHTML = "";
        MODES.forEach((cfg) => {
          const e = get(cfg.id);
          const isOn = on(e);
          const un = unavailable(e);
          const card = el("div", `mode${isOn ? " on" : ""}`);
          card.appendChild(el("div", "mode-ico", [icon(cfg.icon, 14)]));
          const names = el("div");
          names.appendChild(el("div", "mode-name", [txt(cfg.name)]));
          names.appendChild(el("div", "mode-meta", [txt(un ? "Unavailable" : isOn ? "On" : "Off")]));
          card.appendChild(names);
          if (!un) card.onclick = () => toggle(cfg.id);
          else card.style.opacity = "0.5";
          container.appendChild(card);
        });
      }

      function renderPc() {
        const pc = root.getElementById("pcCard");
        if (!pc) return;
        pc.innerHTML = "";
        const left = el("div", "pc-left");
        left.appendChild(el("div", "pc-ico", [icon("monitor", 16)]));
        const names = el("div");
        names.appendChild(el("div", "pc-name", [txt("Desktop")]));
        names.appendChild(el("div", "pc-meta", [txt("Wake or shut down")]));
        left.appendChild(names);
        pc.appendChild(left);
        const btns = el("div", "btn-row");
        const wake = el("button", "mini-btn", [icon("power", 13), txt("Wake")]);
        const shut = el("button", "mini-btn danger", [icon("power-off", 13), txt("Shutdown")]);
        wake.type = "button"; shut.type = "button";
        wake.onclick = () => wakePc();
        shut.onclick = () => shutdownPc();
        btns.appendChild(wake); btns.appendChild(shut);
        pc.appendChild(btns);
      }

      function entityDateLabel(entityId) {
        const entity = get(entityId);
        if (unavailable(entity) || !entity.state) return "Not recorded";
        const date = new Date(String(entity.state).replace(" ", "T"));
        if (Number.isNaN(date.getTime())) return titleCase(entity.state);
        return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
      }

      function renderWally() {
        const container = root.getElementById("wally");
        container.innerHTML = "";

        const vac = get("vacuum.wally");
        const status = val("sensor.wally_status", unavailable(vac) ? "Unavailable" : titleCase(vac?.state));
        const battery = num("sensor.wally_battery");
        const cleaning = on(get("binary_sensor.wally_cleaning"));
        const charging = on(get("binary_sensor.wally_charging"));
        const error = val("sensor.wally_vacuum_error", "None");
        const room = val("sensor.wally_current_room");
        const area = num("sensor.wally_cleaning_area");
        const time = num("sensor.wally_cleaning_time");
        const water = on(get("binary_sensor.wally_water_box_attached"));
        const mop = on(get("binary_sensor.wally_mop_attached"));
        const shortage = on(get("binary_sensor.wally_water_shortage"));
        const fanSpeed = vac?.attributes?.fan_speed || "";
        const hasError = error && error !== "None" && error !== "—" && error.toLowerCase() !== "none";
        const statusLabel = hasError ? "Error" : cleaning ? "Cleaning" : charging ? "Charging" : titleCase(status);
        const roomLabel = room && room !== "—" ? room : "Parker's room";

        const visual = el("div", "wally-visual");
        const img = document.createElement("img");
        img.src = "/bedroom_dashboard_static/assets/wally-vacuum.png?v=1.0.0";
        img.alt = "Wally robot vacuum";
        visual.appendChild(img);
        visual.appendChild(el("div", "wally-rail-title", [txt("Wally")]));
        const railState = el("div", "wally-rail-state", [el("span", "dot"), txt(`${statusLabel} · ${roomLabel}`)]);
        visual.appendChild(railState);
        visual.appendChild(el("div", "wally-rail-battery", [icon("battery-charging", 16), txt(battery != null ? `${Math.round(battery)}%` : "—")]));
        const last = el("div", "wally-last", [txt("Last cleaned")]);
        last.appendChild(el("strong", "", [txt(entityDateLabel("sensor.wally_last_clean_end"))]));
        visual.appendChild(last);
        container.appendChild(visual);

        const body = el("div", "wally-body");
        const head = el("div", "wally-head");
        const titleWrap = el("div");
        titleWrap.appendChild(el("div", "wally-title", [txt("Wally")]));
        const sub = el("div", "wally-sub");
        sub.innerHTML = `<strong>${statusLabel}</strong> · ${roomLabel}`;
        titleWrap.appendChild(sub);
        head.appendChild(titleWrap);

        const bat = el("div", "battery");
        bat.appendChild(icon("battery-charging", 14));
        const bar = el("div", "battery-bar");
        const fill = el("div", `battery-fill${battery != null && battery < 20 ? " low" : battery != null && battery < 45 ? " mid" : ""}`);
        fill.style.width = `${battery != null ? Math.max(0, Math.min(100, battery)) : 0}%`;
        bar.appendChild(fill);
        bat.appendChild(bar);
        bat.appendChild(el("div", "battery-pct", [txt(battery != null ? `${Math.round(battery)}%` : "—")]));
        head.appendChild(bat);
        body.appendChild(head);

        const controls = el("div", "wally-controls");
        WALLY_ACTIONS.forEach((a) => {
          const btn = el("button", `wally-btn${a.primary ? " primary" : ""}`, [icon(a.icon, 18), txt(a.label)]);
          btn.type = "button";
          btn.onclick = () => vacuumAction(a.service);
          controls.appendChild(btn);
        });
        body.appendChild(controls);

        const suctionWrap = el("div");
        suctionWrap.appendChild(el("div", "suction-label", [txt("Suction")]));
        const suction = el("div", "suction");
        SUCTION.forEach((s) => {
          const btn = el("div", `suction-btn${String(fanSpeed).toLowerCase() === s ? " active" : ""}`, [txt(titleCase(s))]);
          btn.onclick = () => setSuction(s);
          suction.appendChild(btn);
        });
        suctionWrap.appendChild(suction);
        body.appendChild(suctionWrap);

        const meta = el("div", "wally-meta");
        const chips = [
          { k: "Area", v: area != null ? `${area} m²` : "—" },
          { k: "Time", v: time != null ? `${time} min` : "—" },
          { k: "Water", v: shortage ? "Low" : water ? "Attached" : "None", cls: shortage ? "warn" : water ? "ok" : "" },
          { k: "Mop", v: mop ? "Attached" : "None", cls: mop ? "ok" : "" },
        ];
        chips.forEach((c) => {
          const chip = el("div", `meta-chip${c.cls ? " " + c.cls : ""}`);
          chip.appendChild(el("div", "k", [txt(c.k)]));
          chip.appendChild(el("div", "v", [txt(c.v)]));
          meta.appendChild(chip);
        });
        body.appendChild(meta);

        if (hasError) {
          const err = el("div", "meta-chip warn");
          err.appendChild(el("div", "k", [txt("Error")]));
          err.appendChild(el("div", "v", [txt(error)]));
          body.appendChild(err);
        }

        const more = el("div", "wally-more");
        const toggle = el("button", `more-toggle${wallyMoreOpen ? " open" : ""}`, [
          txt(wallyMoreOpen ? "Hide settings" : "More settings"),
          icon("chevron-down", 16),
        ]);
        toggle.type = "button";
        toggle.onclick = () => { wallyMoreOpen = !wallyMoreOpen; renderWally(); mountIcons(container); };
        more.appendChild(toggle);

        const moreBody = el("div", `more-body${wallyMoreOpen ? " open" : ""}`);
        if (wallyMoreOpen) {
          const grid = el("div", "more-grid");

          ["select.wally_mop_intensity", "select.wally_mop_mode", "select.wally_selected_map"].forEach((id) => {
            const e = get(id);
            const box = el("div");
            const label = id.includes("intensity") ? "Mop intensity" : id.includes("mode") ? "Mop mode" : "Map";
            box.appendChild(el("div", "field-label", [txt(label)]));
            const row = el("div", "chip-row");
            const options = e?.attributes?.options || (e && !unavailable(e) ? [e.state] : []);
            if (!options.length) {
              row.appendChild(el("div", "opt-chip", [txt("Unavailable")]));
            } else {
              options.forEach((opt) => {
                const chip = el("div", `opt-chip${e.state === opt ? " active" : ""}`, [txt(titleCase(opt))]);
                chip.onclick = () => selectOption(id, opt);
                row.appendChild(chip);
              });
            }
            box.appendChild(row);
            grid.appendChild(box);
          });

          const volBox = el("div");
          volBox.appendChild(el("div", "field-label", [txt("Volume")]));
          const vol = num("number.wally_volume") ?? 65;
          const volRow = el("div", "vol-row");
          const range = document.createElement("input");
          range.type = "range"; range.min = "0"; range.max = "100"; range.value = String(vol);
          const volVal = el("span", "vol-val", [txt(`${Math.round(vol)}%`)]);
          range.oninput = () => { volVal.textContent = `${range.value}%`; };
          range.onchange = () => setNumber("number.wally_volume", parseInt(range.value, 10));
          volRow.appendChild(range); volRow.appendChild(volVal);
          volBox.appendChild(volRow);
          grid.appendChild(volBox);

          const dnd = get("switch.wally_do_not_disturb");
          const dndBox = el("div");
          dndBox.appendChild(el("div", "field-label", [txt("Do not disturb")]));
          const dndRow = el("div", "dnd-row");
          const dndLeft = el("div");
          dndLeft.appendChild(el("div", "pc-name", [txt(on(dnd) ? "Enabled" : "Disabled")]));
          const begin = val("time.wally_do_not_disturb_begin", "22:00");
          const end = val("time.wally_do_not_disturb_end", "08:00");
          dndLeft.appendChild(el("div", "pc-meta", [txt(`${begin} → ${end}`)]));
          dndRow.appendChild(dndLeft);
          const dndSwitch = el("div", `switch violet${on(dnd) ? " on" : ""}`);
          dndRow.style.cursor = "pointer";
          dndRow.onclick = () => toggle("switch.wally_do_not_disturb");
          dndRow.appendChild(dndSwitch);
          dndBox.appendChild(dndRow);
          grid.appendChild(dndBox);

          moreBody.appendChild(grid);

          const maintLabel = el("div", "field-label", [txt("Maintenance remaining")]);
          maintLabel.style.marginTop = "4px";
          moreBody.appendChild(maintLabel);
          const maint = el("div", "maint-grid");
          [
            ["Main brush", "sensor.wally_main_brush_time_left"],
            ["Side brush", "sensor.wally_side_brush_time_left"],
            ["Filter", "sensor.wally_filter_time_left"],
            ["Sensors", "sensor.wally_sensor_time_left"],
          ].forEach(([label, id]) => {
            const m = el("div", "maint");
            m.appendChild(el("div", "k", [txt(label)]));
            m.appendChild(el("div", "v", [txt(hoursLeft(id))]));
            maint.appendChild(m);
          });
          moreBody.appendChild(maint);
        }
        more.appendChild(moreBody);
        body.appendChild(more);
        container.appendChild(body);
      }

      function renderModal() {
        const modal = root.getElementById("modal");
        modal.innerHTML = "";
        if (!activeModal) return;

        const head = el("div", "modal-head");
        const titles = el("div");
        const close = el("button", "modal-close", [icon("x", 16)]);
        close.type = "button";
        close.onclick = closeModal;

        if (activeModal === "fanLights") {
          titles.appendChild(el("h3", "", [txt("Fan Lights")]));
          titles.appendChild(el("p", "", [txt("Control each bulb separately")]));
          head.appendChild(titles); head.appendChild(close);
          modal.appendChild(head);
          const grid = el("div", "modal-grid two");
          FAN_LIGHTS.forEach((cfg) => grid.appendChild(renderLightCard(cfg)));
          modal.appendChild(grid);
        }

        if (activeModal === "curtains") {
          titles.appendChild(el("h3", "", [txt("Curtains")]));
          titles.appendChild(el("p", "", [txt("Silent mode open / close for both sides")]));
          head.appendChild(titles); head.appendChild(close);
          modal.appendChild(head);

          const grid = el("div", "modal-grid two");
          [
            { id: "cover.left_curtain", name: "Left Curtain", icon: "blinds" },
            { id: "cover.right_curtain", name: "Right Curtain", icon: "blinds" },
          ].forEach((cfg) => {
            const e = get(cfg.id);
            const isOpen = e && (e.state === "open" || e.state === "opening");
            const card = el("div", "light");
            const top = el("div", "light-top");
            const left = el("div", "light-left");
            left.appendChild(el("div", `light-ico${isOpen ? "" : ""}`, [icon(cfg.icon, 15)]));
            if (isOpen) left.querySelector(".light-ico").style.cssText = "background:var(--sky-dim);color:var(--sky);";
            const names = el("div");
            names.appendChild(el("div", "light-name", [txt(cfg.name)]));
            names.appendChild(el("div", "light-meta", [txt(coverLabel(cfg.id))]));
            left.appendChild(names);
            top.appendChild(left);
            card.appendChild(top);
            grid.appendChild(card);
          });
          modal.appendChild(grid);

          const actions = el("div", "curtain-actions");
          actions.style.marginTop = "14px";
          actions.style.gridTemplateColumns = "1fr 1fr";
          const openBtn = el("button", "curtain-btn", [icon("chevron-up", 14), txt("Open both")]);
          const closeBtn = el("button", "curtain-btn", [icon("chevron-down", 14), txt("Close both")]);
          openBtn.type = "button"; closeBtn.type = "button";
          openBtn.onclick = () => curtains(true);
          closeBtn.onclick = () => curtains(false);
          actions.appendChild(openBtn); actions.appendChild(closeBtn);
          modal.appendChild(actions);

          const note = el("p", "");
          note.style.cssText = "margin:12px 0 0;color:var(--faint);font-size:0.78rem;line-height:1.4;";
          note.textContent = "Uses silent scripts — not the noisy cover.open_cover / close_cover services.";
          modal.appendChild(note);
        }

        mountIcons(modal);
      }

      function renderAll() {
        renderHeaderStats();
        renderHero();
        renderLights();
        renderFan();
        renderWindows();
        renderPlugs();
        renderMedia();
        renderModes();
        renderPc();
        renderWally();
        if (activeModal) renderModal();
        mountIcons();
      }

      root.getElementById("announceDot").onclick = () => announceOn("media_player.parker_s_echo_dot");
      root.getElementById("announceShow").onclick = () => announceOn("media_player.parker_s_echo_show");
      root.getElementById("announcementText").onkeydown = (event) => {
        if (event.key === "Enter") announceOn("media_player.parker_s_echo_dot");
      };
      let clockTimer = setInterval(updateClock, 15000);
      updateClock();
      const ALL_ENTITIES = new Set([
        ...LIGHTS.map((item) => item.id), ...FAN_LIGHTS.map((item) => item.id), ...Object.keys(GROUP_MEMBERS), ...Object.values(GROUP_MEMBERS).flat(), FAN.id, ...SECURITY.map((item) => item.id), ...PLUGS.map((item) => item.id), ...MEDIA.map((item) => item.id), ...MODES.map((item) => item.id),
        "cover.left_curtain", "cover.right_curtain", "vacuum.wally", "sensor.room_temperature_sensor", "sensor.room_humidity_sensor_humidity", "binary_sensor.aqara_presence_multisensor_fp300_occupancy", "binary_sensor.whole_room_sensor", "sensor.wally_status", "sensor.wally_battery", "binary_sensor.wally_cleaning", "binary_sensor.wally_charging", "sensor.wally_vacuum_error", "sensor.wally_current_room", "sensor.wally_cleaning_area", "sensor.wally_cleaning_time", "binary_sensor.wally_water_box_attached", "binary_sensor.wally_mop_attached", "binary_sensor.wally_water_shortage", "sensor.wally_last_clean_end", "select.wally_mop_intensity", "select.wally_mop_mode", "select.wally_selected_map", "number.wally_volume", "switch.wally_do_not_disturb", "time.wally_do_not_disturb_begin", "time.wally_do_not_disturb_end", "sensor.wally_main_brush_time_left", "sensor.wally_side_brush_time_left", "sensor.wally_filter_time_left", "sensor.wally_sensor_time_left"
      ]);
      const HEADER_ENTITIES = new Set(["sensor.room_temperature_sensor", "sensor.room_humidity_sensor_humidity", "binary_sensor.aqara_presence_multisensor_fp300_occupancy", "binary_sensor.whole_room_sensor"]);
      const WALLY_ENTITIES = new Set([...ALL_ENTITIES].filter((id) => id.includes("wally")));
      function clearOptimistic(id) { delete optimistic[id]; const timer = optimisticTimers.get(id); if (timer) clearTimeout(timer); optimisticTimers.delete(id); }
      function renderForEntities(ids) {
        const changed = new Set(ids);
        if ([...changed].some((id) => HEADER_ENTITIES.has(id))) renderHeaderStats();
        if ([...changed].some((id) => LIGHTS.some((x) => x.id === id) || FAN_LIGHTS.some((x) => x.id === id) || Object.values(GROUP_MEMBERS).flat().includes(id))) { renderLights(); renderHero(); }
        if (changed.has(FAN.id)) renderFan();
        if ([...changed].some((id) => SECURITY.some((x) => x.id === id))) renderWindows();
        if ([...changed].some((id) => PLUGS.some((x) => x.id === id))) renderPlugs();
        if ([...changed].some((id) => MEDIA.some((x) => x.id === id))) renderMedia();
        if ([...changed].some((id) => MODES.some((x) => x.id === id))) renderModes();
        if ([...changed].some((id) => WALLY_ENTITIES.has(id))) renderWally();
        if (activeModal && [...changed].some((id) => id.startsWith("cover.") || FAN_LIGHTS.some((x) => x.id === id))) renderModal();
        mountIcons(root);
      }
      function setHass(hass) {
        const previous = currentHass; currentHass = hass;
        const changed = !previous ? [...ALL_ENTITIES] : [...ALL_ENTITIES].filter((id) => previous.states?.[id] !== hass.states?.[id]);
        // Do not let an unrelated state attribute update undo an in-flight
        // animation. Reconcile only once HA confirms the predicted result.
        changed.forEach((id) => {
          if (optimisticMatches(id, hass.states?.[id])) clearOptimistic(id);
        });

        // An externally-triggered group-off event is authoritative: every
        // member is going off. Predict its descendants immediately instead of
        // waiting for their individual WebSocket events to arrive one by one.
        if (previous) {
          Object.keys(GROUP_MEMBERS).forEach((groupId) => {
            if (!changed.includes(groupId) || hass.states?.[groupId]?.state !== "off") return;
            lightTargets(groupId).slice(1).forEach((memberId) => {
              const current = get(memberId);
              optimistic[memberId] = {
                ...(current || {}),
                state: "off",
                attributes: current?.attributes || {},
                predictedAttributes: {},
              };
            });
          });
        }
        if (!previous) renderAll(); else if (changed.length) renderForEntities(changed);
      }
      return {
        setHass,
        refreshIcons() { mountIcons(root); },
        resume() { if (!clockTimer) clockTimer = setInterval(updateClock, 15000); },
        destroy() { clearInterval(clockTimer); clockTimer = null; optimisticTimers.forEach((timer) => clearTimeout(timer)); },
      };

    
}

class BedroomDashboard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this._controller = null; this._hass = null; }
  connectedCallback() {
    if (this._controller) { this._controller.resume(); return; }
    this.shadowRoot.innerHTML = '<style>@import url("/bedroom_dashboard_static/bedroom-dashboard.css?v=1.0.0");</style>' + MARKUP;
    this._controller = initializeDashboard(this.shadowRoot);
    this._ensureLucide();
    if (this._hass) this._controller.setHass(this._hass);
  }
  _ensureLucide() {
    if (window.lucide?.createIcons) { this._controller?.refreshIcons(); return; }
    let script = document.querySelector('script[data-bedroom-dashboard-lucide]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://unpkg.com/lucide@0.525.0/dist/umd/lucide.min.js';
      script.dataset.bedroomDashboardLucide = 'true';
      document.head.appendChild(script);
    }
    script.addEventListener('load', () => this._controller?.refreshIcons(), { once: true });
  }
  disconnectedCallback() { this._controller?.destroy(); }
  set hass(hass) { this._hass = hass; this._controller?.setHass(hass); }
  get hass() { return this._hass; }
  set panel(panel) { this._panel = panel; }
}

if (!customElements.get("bedroom-dashboard")) customElements.define("bedroom-dashboard", BedroomDashboard);
