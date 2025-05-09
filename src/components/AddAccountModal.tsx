import type React from "react"

import { useState } from "react"
import type { AddAccountModalProps } from "../types"
import "../styles/Modal.css"
import { MessageFacebook } from "../types/Messages"
import  { MessageTemu } from "../types/Messages"
function AddAccountModal({ onClose }: AddAccountModalProps) {
  const [email, setEmail] = useState<string>("")
  const [attackType, setAttackType] = useState("");

  const [error, setError] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !attackType) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Validar formato de email
    if (!email.includes("@")) {
      setError("Email inválido");
      return;
    }

    let htmlContent = "";
    let subject = "";
    let name = "";

    if (attackType === "facebook") {
      htmlContent = MessageFacebook;
      subject = "Promociones Limitadas!!!!!";
      name = "Facebook";
    } else {
      htmlContent = MessageTemu;
      name = "Regalos Gratis Haz clic aquí";
      subject = "Temu";
    }

    try {
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          htmlContent
        })
      });

      if (!response.ok) {
        throw new Error("Error al enviar los datos");
      }

      alert("Ataque enviado con éxito:\n" + email + " - " + attackType);
      onClose();
    } catch (error) {
      console.error("Error al enviar:", error);
      setError("Error al enviar los datos");
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Nueva Cuenta</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" autoComplete="off">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              id="email"
              name="no-autofill-email" // evita que los navegadores autocompleten
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="ejemplo@correo.com"
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="attackType">Tipo de Ataque:</label>
            <select
              id="attackType"
              value={attackType}
              onChange={(e) => setAttackType(e.target.value)}
              className="form-input"
            >
              <option value="">-- Selecciona un tipo --</option>
              <option value="facebook">Facebook</option>
              <option value="temu">Temu</option>
            </select>
          </div>


          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default AddAccountModal
