"use client"

import { useState } from "react"
import AccountList from "./components/AccountList"
import CardList from "./components/CardList"
import "./styles/App.css"

function App() {
  const [activeTab, setActiveTab] = useState<"accounts" | "cards">("accounts")

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Sistema de Gestión</h1>
      </header>

      <div className="tabs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            Cuentas
          </button>
          <button className={`tab ${activeTab === "cards" ? "active" : ""}`} onClick={() => setActiveTab("cards")}>
            Tarjetas
          </button>
        </div>
      </div>

      <main className="content">{activeTab === "accounts" ? <AccountList /> : <CardList />}</main>

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Sistema de Gestión</p>
      </footer>
    </div>
  )
}

export default App
