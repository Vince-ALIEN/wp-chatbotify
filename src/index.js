import { createRoot } from "@wordpress/element";
import "./app.css";
import App from "./app";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("wpui-sample-plugin");
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});