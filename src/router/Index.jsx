import { createBrowserRouter } from 'react-router-dom'
import Home from '../Elements/Inicio/Home'
import Pedido from '../Elements/Inicio/Pedido'
import PedidosDesactivados from '../Elements/PedidosFinalizados'
import Clientes from '../Elements/Clientes/Clientes'
import Cliente from '../Elements/Clientes/Cliente'
import Presupuestos from '../Elements/Presupuestos/Presupuestos'
import Presupuesto from '../Elements/Presupuestos/Presupuesto'
import Puntadas from '../Elements/Puntadas/Puntadas'
import CambiarFecha from '../Elements/CambiarFecha'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/Inicio',
    element: <Home />
  },
  {
    path: '/Clientes',
    element: <Clientes />
  },
  {
    path: '/Cliente',
    element: <Cliente />
  },
  {
    path: '/Pedido',
    element: <Pedido />
  },
  {
    path: '/Finalizados',
    element: <PedidosDesactivados />
  },
  {
    path: '/Presupuestos',
    element: <Presupuestos />
  },
  {
    path: '/Presupuesto',
    element: <Presupuesto />
  },
  {
    path: '/Puntadas',
    element: <Puntadas />
  },
  {
    path: '/CambiarFecha',
    element: <CambiarFecha />
  },
  {
    path: '*',
    element: <h2 style={{ marginBottom: 80 }}>404, mira a ver que has escrito, 😅 </h2>
  }

])
