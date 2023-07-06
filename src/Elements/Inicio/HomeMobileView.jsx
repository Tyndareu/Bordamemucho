import Nav from '../../router/Nav'
import { Dropdown, Button, Form } from 'react-bootstrap'
import { estadoPedido, usePedidos } from '../../components/utils'
import { Link } from 'react-router-dom'
import { RenderMobileOrderList } from './HomePedidosListMobile'

const flexWrap = { display: 'flex', flexWrap: 'wrap', gap: 5 }

export default function HomeMobileView ({ initialPedidos }) {
  const { pedidos, sortBy, handleOnSortBy, handleOnEstadoFilter, handleOnSearchPedido, handleOnSearchName, estadoFilter } = usePedidos(initialPedidos)
  return (
        <>
            <Nav active='Inicio' />
            <div className='mt-3 text-center'>
                <div style={flexWrap}>
                    <Link to='/Pedido' className='btn btn-success'>
                        Nuevo Pedido
                    </Link>
                    <div style={flexWrap}>
                        <Form.Control placeholder='Buscar Pedido' onChange={handleOnSearchPedido} />
                        <Form.Control placeholder='Buscar por Cliente' onChange={handleOnSearchName} />
                    </div>
                    <div className='mt-1' style={flexWrap}>
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
                </div>
                <div className=' mt-3'>
                    {pedidos.length === 0 ? <h5>Sin resultados</h5> : <h5>*Doble tap para ver el pedido</h5>}
                    <div style={{ textAlign: 'center' }} className='listMobile mt-3'>
                        <RenderMobileOrderList pedidos={pedidos} />
                    </div>
                </div>
            </div>
        </>
  )
}
