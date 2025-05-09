"use client"

import { useState, useEffect } from "react"
import Pagination from "./Pagination"
import AddAccountModal from "./AddAccountModal"
import Loader from "./Loader"
import type { Account, NewAccount, VisibilityState } from "../types"
import "../styles/List.css"

import { Url } from "../config"

function AccountList() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [emailFilter, setEmailFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<VisibilityState>({})
  const itemsPerPage = 15

  // Cargar cuentas desde el servidor
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${Url}/cuentas-facebook`)

        if (!response.ok) {
          throw new Error("Error al cargar las cuentas")
        }

        const data: Account[] = await response.json()
        setAccounts(data)
        setError(null)
      } catch (err) {
        console.error("Error:", err)
        setError("No se pudieron cargar las cuentas.")
        setAccounts([]) // No usar datos de ejemplo
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const filteredAccounts = accounts.filter((account) =>
    account.correo_electronico.toLowerCase().includes(emailFilter.toLowerCase())
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [emailFilter])

  const handleAddAccount = async (newAccount: NewAccount) => {
    try {
      setLoading(true)
      const addedAccount: Account = {
        id: accounts.length > 0 ? Math.max(...accounts.map((a) => a.id)) + 1 : 1,
        correo_electronico: newAccount.email,
        contrasena: newAccount.password,
      }

      setAccounts([...accounts, addedAccount])
      setShowModal(false)
      setError(null)
    } catch (err) {
      console.error("Error:", err)
      setError("Error al agregar la cuenta")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (id: number) => {
    setShowPassword({
      ...showPassword,
      [id]: !showPassword[id],
    })
  }

  if (loading && accounts.length === 0) {
    return <Loader />
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Gestión de Cuentas</h2>
        <button className="add-button" onClick={() => setShowModal(true)}>
          + Nueva Cuenta
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="email-filter">Filtrar por correo:</label>
          <input
            id="email-filter"
            type="text"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            placeholder="Buscar por correo electrónico..."
            className="filter-input"
          />
        </div>
      </div>

      {currentAccounts.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron resultados</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Correo Electrónico</th>
                <th>Contraseña</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.correo_electronico}</td>
                  <td>
                    <div className="password-cell">
                      <span>{showPassword[account.id] ? account.contrasena : "••••••••"}</span>
                    </div>
                  </td>
                  <td>
                    <button className="action-button" onClick={() => togglePasswordVisibility(account.id)}>
                      {showPassword[account.id] ? "Ocultar" : "Mostrar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {showModal && <AddAccountModal onClose={() => setShowModal(false)} onAddAccount={handleAddAccount} />}
    </div>
  )
}

export default AccountList
