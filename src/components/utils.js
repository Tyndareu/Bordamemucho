import { useEffect, useMemo, useState } from 'react'
import { getClientes } from './firebase/apiClientes'

export const today = new Date().getDate().toLocaleString('es-ES', { minimumIntegerDigits: 2 }) + '/' + ((new Date().getMonth()) + 1).toLocaleString('es-ES', { minimumIntegerDigits: 2 }) + '/' + new Date().getFullYear()

export const textRed = {
  color: 'red'
}

export const estadoPedido = ['Avisado', ' Por avisar', 'Listo', 'En curso', 'Picaje', 'Pendiente', 'Enviado']

export const isMobile = window.innerWidth <= 800

// * Función para ordenar un array de objetos según el valor de una propiedad HOME
export const usePedidos = (initialPedidos) => {
  const [pedidos, setPedidos] = useState(initialPedidos)
  const [sortBy, setSortBy] = useState('Ascendente')
  const [searchPedido, setSearchPedido] = useState('')
  const [searchName, setSearchName] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('Todos')

  useEffect(() => {
    setPedidos(initialPedidos)
  }, [initialPedidos])

  const handleOnSortBy = () => {
    const newSortBy = sortBy === 'Ascendente' ? 'Descendente' : 'Ascendente'
    setSortBy(newSortBy)
    setPedidos(sortPedidos(pedidos, newSortBy))
  }

  const handleOnEstadoFilter = (e) => {
    setEstadoFilter(e.target.id)
    if (e.target.id !== 'Todos') {
      setPedidos(initialPedidos.filter((x) => x.estadoPedido === e.target.id))
    } else {
      setPedidos(initialPedidos)
    }
  }

  const handleOnSearchPedido = (e) => {
    setSearchPedido(e.target.value)
  }

  const handleOnSearchName = (e) => {
    setSearchName(e.target.value)
  }

  const filteredPedidos = useMemo(() => {
    const lowerCaseSearchPedido = searchPedido.toLowerCase()
    const lowerCaseSearchName = searchName.toLowerCase()

    return pedidos.filter((x) => {
      const matchPedido = !searchPedido || x.pedido.toLowerCase().includes(lowerCaseSearchPedido)
      const matchName = !searchName || x.nombre.toLowerCase().includes(lowerCaseSearchName)
      const matchEstado = estadoFilter === 'Todos' || x.estadoPedido === estadoFilter

      return matchPedido && matchName && matchEstado
    }).sort((a, b) => sortPedidos(a, b, sortBy))
  }, [pedidos, searchPedido, searchName, estadoFilter, sortBy])

  return {
    pedidos: filteredPedidos,
    sortBy,
    handleOnSortBy,
    handleOnEstadoFilter,
    handleOnSearchPedido,
    handleOnSearchName,
    estadoFilter
  }
}

export function useAllClientes () {
  const [clientesFilter, setClientesFilter] = useState([])

  useEffect(() => {
    const fetchClientes = async () => {
      const querySnapshot = await getClientes()
      const docs = querySnapshot.docs.map((doc) => ({
        idCliente: doc.id,
        ...doc.data()
      }))
      const filteredClientes = docs
        .sort((x, y) => x.nombre.localeCompare(y.nombre))
      setClientesFilter(filteredClientes)
    }

    fetchClientes()
  }, [])

  return clientesFilter
}

const sortOrders = {
  Ascendente: (x, y) => new Date(x.fechaEnrega) - new Date(y.fechaEnrega),
  Descendente: (x, y) => new Date(y.fechaEnrega) - new Date(x.fechaEnrega)
}
export const sortPedidos = (pedidos, sortOrder) => {
  const sortFunction = sortOrders[sortOrder]
  return sortFunction ? pedidos.sort(sortFunction) : pedidos
}

export const presupuesto = {
  cliente: '',
  fecha: '',
  observaciones: '',
  estado: 'activo',
  color: '#198754'
}

export const whiteValues = {
  idCliente: '',
  color: '#198754',
  pedido: '',
  nombre: '',
  estadoPedido: 'Pendiente',
  fechaPedido: today,
  fechaEnrega: '',
  detalleDelPedido: '',
  estado: 'activo',
  telefono: '',
  telefono2: '',
  email: '',
  direccion: '',
  observaciones: '',
  descripcionLarga: '',
  posicionamiento: {
    polo: {
      right: false,
      left: false
    },
    camisa: {
      right: false,
      left: false
    }
  },
  tallas: {
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    XXXL: 0
  }
}

export const cliente = {
  idCliente: '',
  color: '#198754',
  nombre: '',
  estado: 'activo',
  telefono: '',
  telefono2: '',
  email: '',
  direccion: '',
  observacionesCliente: ''
}

//* Puntadas

// Puntadas
export function calculateTimePerEmbroidery ({ puntadas, velocidad, segundos, cortes }) {
  const totalTimeInSeconds = (puntadas / velocidad * 60) + (segundos * cortes)
  const formattedTime = formatTime(totalTimeInSeconds)
  return formattedTime
}
export function calculateTotalTime (inputs) {
  const totalTimeInSeconds = (inputs.puntadas / inputs.velocidad * 60) + (inputs.segundos * inputs.cortes)
  const totalTimeWithPrendas = totalTimeInSeconds * inputs.prendas
  const formattedTime = formatTime(totalTimeWithPrendas)
  return formattedTime
}
function formatTime (totalTimeInSeconds) {
  const days = Math.floor(totalTimeInSeconds / 86400)
  const hours = Math.floor((totalTimeInSeconds % 86400) / 3600)
  const minutes = Math.floor((totalTimeInSeconds % 3600) / 60)
  const seconds = Math.floor(totalTimeInSeconds % 60)

  const formattedDays = String(days).padStart(2, '0')
  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  if (days > 0) {
    return `${formattedDays}d ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  } else {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }
}

export function calculateEmbroideryPerHour (inputs) {
  return (3600 / ((inputs.puntadas / inputs.velocidad * 60) + (inputs.segundos * inputs.cortes))).toFixed(2)
}

export function calculateEmbroideryPrice (inputs) {
  return (inputs.precio / 3600 * ((inputs.puntadas / inputs.velocidad * 60) + (inputs.segundos * inputs.cortes))).toFixed(2)
}

export function calculateTotalPrice (inputs) {
  return ((inputs.precio / 3600 * ((inputs.puntadas / inputs.velocidad * 60) + (inputs.segundos * inputs.cortes))) * inputs.prendas).toFixed(2)
}
