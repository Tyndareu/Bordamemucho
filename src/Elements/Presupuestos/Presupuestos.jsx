import Nav from '../../router/Nav'
import { getPresupuestos } from '../../components/firebase/apiPresupuesto'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Button, Form, Spinner, Card, ListGroup } from 'react-bootstrap'
import { isMobile } from '../../components/utils'
import SinPermiso from '../../components/SinPermiso'
let filterPresupuesto = []

export default function Presupuestos () {
  const [presupuestos, setPresupuestos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [searchName, setSearchName] = useState('')
  const navigate = useNavigate()

  const AllPresupuestos = async () => {
    try {
      const querySnapshot = await getPresupuestos()
      const docs = []
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id })
      })
      setPresupuestos(docs.sort((y, x) => new Date(y.fecha) - new Date(x.fecha)))
      setIsLoading(false)
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    AllPresupuestos()
  }, [])

  if (isLoading) {
    return (
      <>
        <Nav />
        <Container>
          <h4 className='mt-3'>Cargando...</h4>
          <Spinner style={{ marginBottom: 200 }} animation='border' variant='primary' />
        </Container>
      </>
    )
  }

  // search filter
  const SearchNameFunction = (e) => {
    setSearchName(e.target.value)
  }

  if (searchName === '') { filterPresupuesto = presupuestos } else { filterPresupuesto = presupuestos.filter((x) => x.nombre.toLowerCase().includes(searchName.toLowerCase())) }
  // search filter end

  if (isError) {
    return (<SinPermiso />)
  }
  if (!isMobile) {
    return (
      <>
        <Nav active='Presupuestos' />
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          <Button className='mt-3' variant='success' onClick={() => navigate('/Presupuesto')}>
            Nuevo Presupuesto
          </Button>
          <Form.Control style={{ width: 200 }} className='mt-3' placeholder='Buscar por Cliente' onChange={SearchNameFunction} />
        </div>

        <div className='text-center mt-3' style={{ marginBottom: 100, justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}>
          {filterPresupuesto.map((item) => (
            <ListGroup horizontal style={{ cursor: 'pointer', width: '90%' }} key={item.id} onClick={() => navigate('/Presupuesto?id=' + item.id, { state: item })}>
              <ListGroup.Item style={{ width: '30%', background: item.color }}>{item.cliente}</ListGroup.Item>
              <ListGroup.Item style={{ width: '15%', background: item.color }}>{item.fecha.split('-').reverse().join('/')}</ListGroup.Item>
              <ListGroup.Item style={{ width: '55%', background: item.color }}>{item.observaciones}</ListGroup.Item>
            </ListGroup>
          ))}

          {filterPresupuesto.length === 0
            ? <h5 className='mt-5'>Sin resultados, modifique los filtros</h5>
            : null}
        </div>
      </>
    )
  }

  if (isMobile) {
    return (
      <>
        <Nav active='Presupuestos' />
        <div className='mt-3 text-center'>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            <Button variant='success' onClick={() => navigate('/Presupuesto')}>
              Nuevo Presupuesto
            </Button>
            <div style={{ display: 'flex', gap: 5 }}>
              <Form.Control placeholder='Buscar por Cliente' onChange={SearchNameFunction} />
            </div>
          </div>
          <div className=' mt-3'>
            {filterPresupuesto.length === 0 ? <h5>Sin resultados</h5> : <h5>*Doble tap para ver el Presupuesto</h5>}

            <div style={{ textAlign: 'center' }} className='listMobile mt-3'>
              {filterPresupuesto.map((item) => (
                <Card onDoubleClick={() => navigate('/Presupuesto?id=' + item.id, { state: item })} key={item.id} className='mb-2 cardHome'>
                  <Card.Header style={{ background: item.color }}>{item.cliente.toUpperCase()}</Card.Header>
                  <Card.Body style={{ background: item.color }}>
                    <Card.Text>{item.fecha}</Card.Text>
                    <Card.Text>{item.observaciones}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }
}
