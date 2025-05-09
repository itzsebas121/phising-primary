// Definición de tipos para la aplicación

// Tipo para las cuentas
export interface Account {
  id: number
  correo_electronico: string
  contrasena: string
}

// Tipo para las tarjetas
export interface Card {
  id: number
  numero_tarjeta: string
  fecha_expiracion: string
  codigo_seguridad: string
}

// Tipo para nueva cuenta
export interface NewAtack {
  email: string
  typeAtack: string
}

// Tipo para props de paginación
export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Tipo para props del modal de agregar cuenta
export interface AddAccountModalProps {
  onClose: () => void
  onAddAccount: (account: NewAtack) => void
}

// Tipo para props del componente Loader
export interface LoaderProps {
  message?: string
}

// Tipo para el estado de visibilidad
export interface VisibilityState {
  [key: number]: boolean
}
