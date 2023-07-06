import Nav from '../../router/Nav'
import { getClientes } from '../../components/firebase/apiClientes'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Button, Form, Table, Spinner, Card } from 'react-bootstrap'
import { isMobile } from '../../components/utils'
import SinPermiso from '../../components/SinPermiso'

export default function Clientes () {
  const [Clientes, setClientes] = useState([])
  const [ClientesFilter, setClientesFilter] = useState(Clientes)
  const [searchPhone, setSearchPhone] = useState('')
  const [searchName, setSearchName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()

  const AllClientes = async () => {
    try {
      const querySnapshot = await getClientes()
      const docs = []
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id })
      })
      setClientes(docs.filter((x) => x.estado === 'activo'))
      setIsLoading(false)
      setClientesFilter(docs.filter((x) => x.estado === 'activo').sort((x, y) => x.nombre.localeCompare(y.nombre)))
    } catch (error) {
      setIsLoading(false)
      setIsError(true)
    }
  }

  useEffect(() => {
    AllClientes()
  }, [])

  if (isLoading) {
    return (
      <>
        <Nav />
        <Container style={{ marginBottom: 80 }}>
          <h4 className='mt-3'>Cargando...</h4>
          <Spinner animation='border' variant='primary' />
        </Container>
      </>
    )
  }

  // search filter
  const SearchPhone = (e) => {
    setSearchPhone(e.target.value)
  }
  const SearchName = (e) => {
    setSearchName(e.target.value)
  }
  // search filter end

  let listadoClientes = []

  const nameAndNumberFilter = () => {
    const filterOne = [...ClientesFilter.filter((x) => x.nombre.toLowerCase().includes(searchName.toLowerCase()))]
    const filterTwo = [...ClientesFilter.filter((x) => x.telefono.toLowerCase().includes(searchPhone.toLowerCase()))]
    filterOne.forEach((x) => {
      if (filterTwo.some((y) => x.id === y.id)) {
        listadoClientes.push(x)
      }
    })
  }

  if (searchName !== '' || searchPhone !== '') {
    if (searchName !== '' && searchPhone !== '') {
      nameAndNumberFilter()
    } else if (searchName !== '') {
      listadoClientes = ClientesFilter.filter((x) => x.nombre.toLowerCase().includes(searchName.toLowerCase()))
    } else if (searchPhone !== '') {
      listadoClientes = ClientesFilter.filter((x) => x.telefono.includes(searchPhone))
    }
  } else {
    listadoClientes = ClientesFilter
  }
  if (isError) {
    return (<SinPermiso />)
  }
  if (!isMobile) {
    return (
      <>
        <Nav active='Clientes' />
        <div className='container mt-3 text-center' style={{ marginBottom: 100 }}>
          <div style={{ display: 'flex', marginBottom: 5 }}>
            <Button variant='success' onClick={() => navigate('/Cliente')}>
              Nuevo Cliente
            </Button>
          </div>
          <Table bordered hover size='sm'>
            <thead>
              <tr style={{ border: 0 }}>
                <th scope='col'>
                  <Form.Control placeholder='Buscar Cliente' onChange={SearchName} />
                </th>
                <th scope='col'>
                  <Form.Control placeholder='Buscar por Tlf.' onChange={SearchPhone} />
                </th>
              </tr>
              <tr style={{ border: 0 }}>
                <th scope='col' style={{ width: 150 }}>
                  Nombre:
                </th>
                <th scope='col' style={{ width: 100 }}>
                  Telefono 1:
                </th>
                <th scope='col' style={{ width: 100 }}>
                  Telefono 2:
                </th>
                <th scope='col' style={{ width: 350 }}>
                  Dirección:
                </th>
              </tr>
            </thead>
            <tbody align='center'>
              {listadoClientes.map((item) => (
                <tr style={{ cursor: 'pointer' }} key={item.id} onClick={() => navigate('/Cliente?id=' + item.id, { state: item })}>
                  <td style={{ background: item.color }}>{item.nombre.toUpperCase()}</td>
                  <td style={{ background: item.color }}>{item.telefono}</td>
                  <td style={{ background: item.color }}>{item.telefono2}</td>
                  <td style={{ background: item.color }}> {item.direccion}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {listadoClientes.length === 0 ? <h5>Sin resultados</h5> : null}
        </div>
      </>
    )
  }
  if (isMobile) {
    return (
      <>
        <Nav active='Clientes' />
        <div style={{ display: 'flex', marginBottom: 5, marginTop: 10 }}>
          <Button variant='success' onClick={() => navigate('/Cliente')}>
            Nuevo Cliente
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
          <Form.Control placeholder='Buscar Cliente' onChange={SearchName} />
          <Form.Control placeholder='Buscar por Tlf.' onChange={SearchPhone} />
        </div>
        {listadoClientes.length === 0 ? <h5>Sin resultados</h5> : <h5>*Doble tap para ver el cliente</h5>}
        <div className='listMobile mt-3'>
          {listadoClientes.length === 0 ? <h5>Sin resultados</h5> : null}
          {listadoClientes.map((item) => (
            <Card onDoubleClick={() => navigate('/Cliente?id=' + item.id, { state: item })} key={item.id} className='mb-2 cardHome'>
              <Card.Header style={{ background: item.color }}>{item.nombre.toUpperCase()}</Card.Header>
              <Card.Body style={{ background: item.color }}>
                <Card.Text>Tlf:{item.telefono}</Card.Text>
                <Card.Text>Tlf:2{item.telefono2}</Card.Text>
                <Card.Text>Dirección:{item.direccion}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      </>
    )
  }
}
