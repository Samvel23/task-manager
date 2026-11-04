window.addEventListener("error", (event) => {
  console.error(
    "TaskFlow uncaught client error.",
    event.error ?? event.message,
  );
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("TaskFlow unhandled client rejection.", event.reason);
});
