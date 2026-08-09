// Applies saved theme on page load
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

function setupThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;

  updateToggleIcon();

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateToggleIcon();
  });
}

function updateToggleIcon() {
  const toggleBtn = document.getElementById("themeToggle");
  if (!toggleBtn) return;
  const current = document.documentElement.getAttribute("data-theme");
  toggleBtn.textContent = current === "dark" ? "☀️ Light" : "🌙 Dark";
}

document.addEventListener("DOMContentLoaded", setupThemeToggle);