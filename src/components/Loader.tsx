import type { LoaderProps } from "../types"
import "../styles/Loader.css"

function Loader({ message = "Cargando datos..." }: LoaderProps) {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>{message}</p>
    </div>
  )
}

export default Loader
