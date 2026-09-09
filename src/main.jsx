import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Seleciona o elemento 'root' no HTML e inicializa o React 18+ utilizando createRoot
createRoot(document.getElementById("root")).render(
  /* StrictMode ativa verificações e avisos adicionais para potenciais problemas durante o desenvolvimento */
  <StrictMode>
    <App />
  </StrictMode>,
);
