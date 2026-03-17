(function () {
  var root = document.documentElement;
  var storageKey = "eisenflugel-theme";
  var toggle = document.querySelector("[data-theme-toggle]");
  var label = document.querySelector("[data-theme-label]");
  var icon = document.querySelector("[data-theme-icon]");
  var locale = document.body.getAttribute("data-locale") || "en";
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var labels = {
    en: {
      light: "Light",
      dark: "Dark",
      button: "Switch color theme"
    },
    es: {
      light: "Claro",
      dark: "Oscuro",
      button: "Cambiar tema de color"
    }
  };

  function getStoredTheme() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch (error) {
      // Ignore storage failures and keep the active theme in-memory only.
    }
  }

  function getTheme() {
    var stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
      return stored;
    }

    return prefersDark.matches ? "dark" : "light";
  }

  function updateToggle(theme) {
    if (!toggle || !label || !icon) {
      return;
    }

    var copy = labels[locale] || labels.en;
    label.textContent = theme === "dark" ? copy.dark : copy.light;
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.setAttribute("aria-label", copy.button + ": " + (theme === "dark" ? copy.dark : copy.light));
    icon.textContent = theme === "dark" ? "☾" : "☼";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    updateToggle(theme);
  }

  function syncToSystem(event) {
    var stored = getStoredTheme();
    if (stored === "light" || stored === "dark") {
      return;
    }

    applyTheme(event.matches ? "dark" : "light");
  }

  applyTheme(getTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var nextTheme = current === "dark" ? "light" : "dark";
      setStoredTheme(nextTheme);
      applyTheme(nextTheme);
    });
  }

  if (typeof prefersDark.addEventListener === "function") {
    prefersDark.addEventListener("change", syncToSystem);
  } else if (typeof prefersDark.addListener === "function") {
    prefersDark.addListener(syncToSystem);
  }

  if (!prefersReducedMotion.matches) {
    document.body.classList.add("enhanced-motion");

    window.addEventListener("load", function () {
      var items = document.querySelectorAll(".reveal");

      items.forEach(function (item, index) {
        window.setTimeout(function () {
          item.classList.add("is-visible");
        }, 120 + index * 110);
      });
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (item) {
      item.classList.add("is-visible");
    });
  }
})();
