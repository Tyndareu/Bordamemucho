import Nav from '../../router/Nav'
import { Dropdown, Button, Form, ListGroup } from 'react-bootstrap'
import { EstadoPedido } from '../../components/EstadoPedido'
import { estadoPedido, usePedidos } from '../../components/utils'
import { useNavigate } from 'react-router-dom'

export default function HomeDesktopview ({ initialPedidos }) {
  const { pedidos, sortBy, handleOnSortBy, handleOnEstadoFilter, handleOnSearchPedido, handleOnSearchName, estadoFilter } = usePedidos(initialPedidos)
  const navigate = useNavigate()

  return (
    <>
      <Nav active='Inicio' />
      <div className='mt-3 text-center' style={{ marginBottom: 100 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <Button variant='success' onClick={() => navigate('/Pedido')}>
            Nuevo Pedido
          </Button>
          <Form.Control style={{ width: '20%' }} placeholder='Buscar Pedido' onChange={handleOnSearchPedido} />
          <Form.Control style={{ width: '20%' }} placeholder='Buscar por Cliente' onChange={handleOnSearchName} />
          <Button onClick={handleOnSortBy} variant='success'>
            Fecha: {sortBy}
          </Button>
          <Dropdown>
            <Dropdown.Toggle variant='success' id='dropdown-basic'>
              {estadoFilter}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item id={'Todos'} onClick={handleOnEstadoFilter}>
                Todos
              </Dropdown.Item>
              {estadoPedido.map((x) => (
                <Dropdown.Item id={x} onClick={handleOnEstadoFilter} key={x}>
                  {x}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <strong>
          <ListGroup horizontal style={{ cursor: 'pointer', marginTop: 10, alignItems: 'center' }}>
            <ListGroup.Item style={{ width: '10%', background: 'transparent', border: 0 }}>Fecha de Pedido</ListGroup.Item>
            <ListGroup.Item style={{ width: '20%', background: 'transparent', border: 0 }}>Pedido</ListGroup.Item>
            <ListGroup.Item style={{ width: '20%', background: 'transparent', border: 0 }}>Cliente</ListGroup.Item>
            <ListGroup.Item style={{ width: '10%', background: 'transparent', border: 0 }}>Fecha de Entrega</ListGroup.Item>
            <ListGroup.Item style={{ width: '10%', background: 'transparent', border: 0 }}>Estado</ListGroup.Item>
            <ListGroup.Item style={{ width: '30%', background: 'transparent', border: 0 }}>Observaciones</ListGroup.Item>
          </ListGroup>
        </strong>
        {pedidos.map((item) => (
          <ListGroup horizontal style={{ cursor: 'pointer', marginTop: 2 }} key={item.id} onClick={() => navigate('/Pedido?id=' + item.id, { state: item })}>
            <ListGroup.Item style={{ width: '10%', background: item.color }}>{item.fechaPedido}</ListGroup.Item>
            <ListGroup.Item style={{ width: '20%', background: item.color }}>{item.pedido}</ListGroup.Item>
            <ListGroup.Item style={{ width: '20%', background: item.color }}>{item.nombre.toUpperCase()}</ListGroup.Item>
            <ListGroup.Item style={{ width: '10%', background: item.color }}>{item.fechaEnrega ? item.fechaEnrega.split('-').reverse().join('/') : null}</ListGroup.Item>
            <EstadoPedido item={item.estadoPedido} />
            <ListGroup.Item style={{ width: '30%', background: item.color }}>{item.observaciones}</ListGroup.Item>
          </ListGroup>
        ))}

        {pedidos.length === 0 && <h5 className='mt-5'>Sin resultados, modifique los filtros</h5>}
      </div>
    </>
  )
}
