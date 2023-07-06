
import { Card } from 'react-bootstrap'
import { EstadoPedido } from '../../components/EstadoPedido'
import { useNavigate } from 'react-router-dom'

export const RenderMobileOrderList = ({ pedidos }) => {
  const navigate = useNavigate()
  return (
        <>
            {pedidos.map((item) => (
                <Card onDoubleClick={() => navigate('/Pedido?id=' + item.id, { state: item })} key={item.id} className='mb-2 cardHome'>
                    <Card.Header style={{ background: item.color }}>{item.nombre.toUpperCase()}</Card.Header>
                    <Card.Body style={{ background: item.color }}>
                        <Card.Text>{item.pedido}</Card.Text>
                        <Card.Text>{item.fechaEnrega.split('-').reverse().join('/')}</Card.Text>
                        <EstadoPedido item={item.estadoPedido} />
                        <Card.Text>{item.observaciones}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </>
  )
}
