import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import App from "./App.jsx"
import { ToastProvider } from "./context/ToastContext.jsx"
import { PreferencesProvider } from "./context/PreferencesContext.jsx"
import { store } from "./store/store.js"
import "./styles/global.css"

// one stylesheet per surface — imported in cascade order
import "./styles/shell.css"        // frame, sidebar, header, buttons, modal, toast
import "./styles/knowledge.css"    // graph toolbar, canvas, nodes, inspector
import "./styles/dashboard.css"    // dashboard page
import "./styles/memory.css"       // knowledge health page
import "./styles/subjects.css"     // subjects page
import "./styles/notes.css"        // notes library (.nlib)
import "./styles/notes-extra.css"  // notes: form modal, buttons, note detail page
import "./styles/landing.css"      // marketing landing page
import "./styles/profile.css"      // profile page + menu

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Redux store -> notes data | ToastProvider (Context) -> toast messages | PreferencesProvider (Context) -> app theme preference */}
      <Provider store={store}>
        <PreferencesProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PreferencesProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)