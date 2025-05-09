import { useState, useEffect } from "react"
import Pagination from "./Pagination"
import Loader from "./Loader"
import type { Card, VisibilityState } from "../types"
import "../styles/List.css"
import { Url } from "../config"

function CardList() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [numberFilter, setNumberFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [showCardNumber, setShowCardNumber] = useState<VisibilityState>({})
  const [showSecurityCode, setShowSecurityCode] = useState<VisibilityState>({})
  const itemsPerPage = 15

  
  // Cargar tarjetas desde localhost
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${Url}/tarjetas`)

        if (!response.ok) {
          throw new Error("Error al cargar las tarjetas")
        }

        const data: Card[] = await response.json()
        setCards(data)
        setError(null)
      } catch (err) {
        console.error("Error:", err)
        setError("No se pudieron cargar las tarjetas. Usando datos de ejemplo.")
        // Datos de ejemplo en caso de error
        setCards([
          {
            id: 1,
            numero_tarjeta: "4111111111111111",
            fecha_expiracion: "2025-12-01T00:00:00.000Z",
            codigo_seguridad: "123",
          },
          {
            id: 2,
            numero_tarjeta: "411111145111111",
            fecha_expiracion: "2026-12-31T00:00:00.000Z",
            codigo_seguridad: "123",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  // Filtrar tarjetas
  const filteredCards = cards.filter((card) => card.numero_tarjeta.includes(numberFilter))

  // Obtener tarjetas para la página actual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCards = filteredCards.slice(indexOfFirstItem, indexOfLastItem)

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredCards.length / itemsPerPage)

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [numberFilter])

  // Alternar visibilidad del número de tarjeta
  const toggleCardNumberVisibility = (id: number) => {
    setShowCardNumber({
      ...showCardNumber,
      [id]: !showCardNumber[id],
    })
  }

  // Alternar visibilidad del código de seguridad
  const toggleSecurityCodeVisibility = (id: number) => {
    setShowSecurityCode({
      ...showSecurityCode,
      [id]: !showSecurityCode[id],
    })
  }

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getFullYear()}`
  }

  // Enmascarar número de tarjeta
  const maskCardNumber = (number: string, id: number): string => {
    if (showCardNumber[id]) {
      return number
    }
    return number.slice(0, 4) + " **** **** " + number.slice(-4)
  }

  if (loading && cards.length === 0) {
    return <Loader />
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Gestión de Tarjetas</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="number-filter">Filtrar por número:</label>
          <input
            id="number-filter"
            type="text"
            value={numberFilter}
            onChange={(e) => setNumberFilter(e.target.value)}
            placeholder="Buscar por número de tarjeta..."
            className="filter-input"
          />
        </div>
      </div>

      {currentCards.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron resultados</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Número de Tarjeta</th>
                <th>Fecha de Expiración</th>
                <th>CVV</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCards.map((card) => (
                <tr key={card.id}>
                  <td>{card.id}</td>
                  <td>
                    <span className="card-number">{maskCardNumber(card.numero_tarjeta, card.id)}</span>
                  </td>
                  <td>{formatDate(card.fecha_expiracion)}</td>
                  <td>
                    <span>{showSecurityCode[card.id] ? card.codigo_seguridad : "***"}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-button" onClick={() => toggleCardNumberVisibility(card.id)}>
                        {showCardNumber[card.id] ? "Ocultar número" : "Mostrar número"}
                      </button>
                      <button className="action-button" onClick={() => toggleSecurityCodeVisibility(card.id)}>
                        {showSecurityCode[card.id] ? "Ocultar CVV" : "Mostrar CVV"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  )
}

export default CardList
