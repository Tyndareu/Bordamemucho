import Nav from '../router/Nav'
import { Container, Spinner } from 'react-bootstrap'

export default function Loading () {
  return (
    <>
      <Nav />
      <Container>
        <h4 className='mt-3'>Cargando...</h4>
        <Spinner style={{ marginBottom: '200px' }} animation='border' variant='primary' />
      </Container>
    </>
  )
}
