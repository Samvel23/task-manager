try {
  const savedTheme = window.localStorage.getItem("taskflow-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }
} catch {
  // Keep the server-rendered theme when storage is unavailable.
}
