import { Card, ListGroup } from 'react-bootstrap'
import { isMobile, estadoPedido } from './utils'

export const EstadoPedido = ({ item }) => {
  const colorEstado = {}
  const colorEstadoMobile = {}

  const estadoStyles = {
    [estadoPedido[0]]: { background: '#bcece0' },
    [estadoPedido[1]]: { background: '#f3b668' },
    [estadoPedido[2]]: { background: '#78aa47' },
    [estadoPedido[3]]: { background: '#9ad3f8' },
    [estadoPedido[4]]: { background: '#f5f897' },
    [estadoPedido[5]]: { background: '#f6a8e5' },
    [estadoPedido[6]]: { background: '#f15137', color: 'white' },
    Borrado: { width: '10%', background: '#DC3545', color: 'white' },
    Finalizado: { width: '10%', background: '#FFC107' }
  }

  if (item in estadoStyles) {
    Object.assign(colorEstado, estadoStyles[item], { width: '10%' })
    Object.assign(colorEstadoMobile, estadoStyles[item], { borderRadius: 5 })
  }

  if (isMobile) {
    return <Card.Text style={colorEstadoMobile}>{item}</Card.Text>
  } else {
    return <ListGroup.Item style={colorEstado}>{item}</ListGroup.Item>
  }
}
