import Nav from '../router/Nav'
import { firebaseSignOut } from '../components/firebase/apiPedidos'
import { Container } from 'react-bootstrap'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default function SinPermiso () {
  const auth = getAuth()
  firebaseSignOut()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.reload()
    }
  })

  return (
      <>
        <Nav />
        <Container>
          <h4 className='mt-3' style={{ marginBottom: 80 }}>Sin permiso para acceder a la información, inicie sesión con una cuenta autorizada</h4>
        </Container>
      </>
  )
}
