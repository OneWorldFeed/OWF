/* ============================================================
   OWF GLOBAL ENGINE — PHASE 4.4.4
   Handles global behaviors, accessibility modes, theme states,
   and app‑wide event listeners.
   ============================================================ */

/* ---------------------------------------------
   Reduced Motion Preference
--------------------------------------------- */
function applyReducedMotion() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.toggle("reduced-motion", prefersReduced);
}

/* ---------------------------------------------
   High Contrast Mode (User Toggle)
--------------------------------------------- */
function applyHighContrast() {
  const saved = localStorage.getItem("owf-high-contrast") === "true";
  document.documentElement.classList.toggle("high-contrast", saved);
}

export function toggleHighContrast() {
  const enabled = document.documentElement.classList.toggle("high-contrast");
  localStorage.setItem("owf-high-contrast", enabled);
}

/* ---------------------------------------------
   Dark Mode (System Preference)
--------------------------------------------- */
function applyDarkMode() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", prefersDark);
}

/* ---------------------------------------------
   Global Resize Listener (optional future use)
--------------------------------------------- */
function handleResize() {
  // Reserved for responsive behaviors if needed later
}

/* ---------------------------------------------
   Initialize Global Engine
--------------------------------------------- */
function initGlobal() {
  applyReducedMotion();
  applyHighContrast();
  applyDarkMode();

  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", applyReducedMotion);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyDarkMode);

  window.addEventListener("resize", handleResize);
}

/* ---------------------------------------------
   Auto‑mount
--------------------------------------------- */
document.addEventListener("DOMContentLoaded", initGlobal);
