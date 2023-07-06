import Nav from '../router/Nav'
import { getPedidosFinalizados } from '../components/firebase/apiPedidos'
import ColorPedidosFinalizados from './ColorPedidosFinalizados'
import { useEffect, useState } from 'react'
import { Form, Table, Card } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { isMobile } from '../components/utils'
import SinPermiso from '../components/SinPermiso'
import Loading from '../components/Loading'

export default function PedidosDesactivados () {
  const [pedidos, setPedidos] = useState([])
  const [searchPedido, setSearchPedido] = useState('')
  const [searchName, setSearchName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()
  let listadoPedidos = []

  useEffect(() => {
    const AllPedidos = async () => {
      try {
        const querySnapshot = await getPedidosFinalizados()
        const docs = []
        querySnapshot.forEach((doc) => {
          docs.push({ ...doc.data(), id: doc.id })
        })
        setPedidos(docs.sort((y, x) => new Date(x.fechaFinalizacion) - new Date(y.fechaFinalizacion)))
        setIsLoading(false)
      } catch (error) {
        alert('An error occurred. Please try again later.')
        setIsLoading(false)
        setIsError(true)
      }
    }
    AllPedidos()
  }, [])

  // *sort By

  // sort By End

  // search filter
  const SearcPedido = (e) => {
    setSearchPedido(e.target.value)
  }
  const SearchName = (e) => {
    setSearchName(e.target.value)
  }
  // search filter end

  if (searchName !== '' || searchPedido !== '') {
    listadoPedidos = pedidos.filter((x) => {
      const nombreIncludes = x.nombre.toLowerCase().includes(searchName.toLowerCase())
      const pedidoIncludes = x.pedido.toLowerCase().includes(searchPedido.toLowerCase())

      if (searchName !== '' && searchPedido !== '') {
        return nombreIncludes && pedidoIncludes
      } else if (searchName !== '') {
        return nombreIncludes
      } else if (searchPedido !== '') {
        return pedidoIncludes
      }
      return false
    })
  } else {
    listadoPedidos = pedidos
  }

  if (isLoading) {
    return <Loading />
  }
  if (isError) {
    return <SinPermiso />
  }
  if (!isMobile) {
    return (
      <>
        <Nav active="Pedidos Finalizados" />
        <div
          className="container mt-3 text-center"
          style={{ marginBottom: 100 }}
        >
          <Table bordered hover size="sm">
            <thead>
              <tr style={{ border: 0 }}>
                <th scope="col"/>
                <th scope="col">
                  <Form.Control
                    placeholder="Buscar Pedido"
                    onChange={SearcPedido}
                  />
                </th>
                <th scope="col">
                  <Form.Control
                    placeholder="Buscar por Cliente"
                    onChange={SearchName}
                  />
                </th>
              </tr>
              <tr style={{ border: 0 }}>
                <th scope="col" style={{ width: '10%' }}>
                  Fecha de Pedido
                </th>
                <th scope="col" style={{ width: '20%' }}>
                  Pedido
                </th>
                <th scope="col" style={{ width: '10%' }}>
                  Cliente
                </th>
                <th scope="col" style={{ width: '10%' }}>
                  Fecha de Entrega
                </th>
                <th scope="col" style={{ width: '10%' }}>
                  Entregado
                </th>
                <th scope="col" style={{ width: '30%' }}>
                  Observaciones/s
                </th>
              </tr>
            </thead>
            <tbody align="center">
              {listadoPedidos.map((item) => (
                <tr style={{ cursor: 'pointer' }} key={item.id} onClick={() => navigate('/Pedido?id=' + item.id + '&from=Finalizado', { state: item })}>
                  <td style={{ background: item.color }}>{item.fechaPedido}</td>
                  <td style={{ background: item.color }}>{item.pedido}</td>
                  <td style={{ background: item.color }}>
                    {item.nombre.toUpperCase()}
                  </td>
                  <td style={{ background: item.color }}>
                    {item.fechaEnrega && item.fechaEnrega.split('-').reverse().join('/')}
                  </td>
                  <ColorPedidosFinalizados item={item} />
                  <td style={{ background: item.color }}>
                    {item.observaciones}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {listadoPedidos.length === 0
            ? <h5 className='mt-5'>Sin resultados, modifique los filtros</h5>
            : null}
        </div>
        <ToastContainer />
      </>
    )
  }
  if (isMobile) {
    return (
      <>
        <Nav active="Pedidos Finalizados" />
        <div className="mt-3">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
            <Form.Control style={{ width: '45%' }} placeholder="Buscar Pedido" onChange={SearcPedido} />
            <Form.Control style={{ width: '45%' }} placeholder="Buscar por Cliente" onChange={SearchName} />
          </div>
          <div className="mt-3">
            {listadoPedidos.length === 0 ? <h5>Sin resultados</h5> : <h5>*Doble tap para ver el pedido</h5>}
            <div style={{ textAlign: 'center' }} className="listMobile mt-3">
              {listadoPedidos.map((item) => (
                <Card
                  onDoubleClick={() =>
                    navigate('/Pedido?id=' + item.id + '&from=Finalizado', { state: item })
                  }
                  key={item.id}
                  className="mb-2 cardHome"
                >
                  <Card.Header style={{ background: item.color }}>
                    {item.nombre.toUpperCase()}
                  </Card.Header>
                  <Card.Body style={{ background: item.color }}>
                    <Card.Text>
                    </Card.Text>
                    <Card.Text>{item.pedido}</Card.Text>
                    <Card.Text>{item.fechaEnrega.split('-').reverse().join('/')}</Card.Text>
                    <Card.Text>{item.observaciones}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <ToastContainer />
      </>
    )
  }
}
