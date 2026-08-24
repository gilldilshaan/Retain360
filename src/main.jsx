import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App.jsx"
import "./styles/global.css"

// one stylesheet per surface — imported in cascade order
import "./styles/shell.css"        // frame, sidebar, header, buttons, modal, toast
import "./styles/knowledge.css"    // graph toolbar, canvas, nodes, inspector
import "./styles/dashboard.css"    // dashboard page
import "./styles/memory.css"       // knowledge health page
import "./styles/subjects.css"     // subjects page
import "./styles/notes.css"        // notes library (.nlib)
import "./styles/landing.css"      // marketing landing page
import "./styles/profile.css"      // profile page + menu

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)