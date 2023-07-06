import Nav from 'react-bootstrap/Nav'
import { Navbar, Container } from 'react-bootstrap'
import { isMobile } from '../components/utils'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../components/firebase/apiPedidos'
import { SignInButton } from '../components/SingInButton'
import { SignOutButton } from '../components/SingOutButton'
import { Link } from 'react-router-dom'

export default function ResponsiveAppBar ({ active }) {
  const [user] = useAuthState(auth)
  const pages = {
    Inicio: 'noactive',
    Clientes: 'noactive',
    Pedido: 'noactive',
    Desactivados: 'noactive',
    Presupuestos: 'noactive',
    Puntadas: 'noactive'
  }
  switch (active) {
    case 'Inicio':
      pages.Inicio = 'active'
      break
    case 'Clientes':
      pages.Clientes = 'active'
      break
    case 'Pedido':
      pages.Pedido = 'active'
      break
    case 'Pedidos Finalizados':
      pages.Desactivados = 'active'
      break
    case 'Presupuestos':
      pages.Presupuestos = 'active'
      break
    case 'Puntadas':
      pages.Puntadas = 'active'
      break
  }

  return (
    <>
      <div className='mb-1' style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <a href='/'><div className='logo' /></a>
        <div className='buttonNav'>
          {user
            ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {isMobile ? null : <h5 style={{ marginRight: 5, marginTop: 7, color: '#198754' }}>Bienvenid@: {user.displayName} </h5>}
                <SignOutButton />
              </div>
              )
            : (
              <SignInButton />
              )}
        </div>
      </div>
      <Navbar bg='success' variant='dark' expand="lg" style={{ borderRadius: 8 }}>
        <Container fluid>
          {isMobile ? <Navbar.Brand>{active}</Navbar.Brand> : null}

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link className={pages.Inicio} as={Link} to='/'>Inicio</Nav.Link>
              <Nav.Link className={pages.Clientes} as={Link} to='/Clientes'>Clientes</Nav.Link>
              <Nav.Link className={pages.Presupuestos} as={Link} to='/Presupuestos'>Presupuestos</Nav.Link>
              <Nav.Link className={pages.Puntadas} as={Link} to='/Puntadas'>Puntadas</Nav.Link>
              <Nav.Link className={pages.Desactivados} as={Link} to='/Finalizados'>Pedidos Finalizados</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
