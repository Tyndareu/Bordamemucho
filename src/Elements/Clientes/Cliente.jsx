import Nav from '../../router/Nav'
import { useState, useEffect } from 'react'
import { saveCliente, updateCliente } from '../../components/firebase/apiClientes'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import Form from 'react-bootstrap/Form'
import { Container } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import 'react-toastify/dist/ReactToastify.css'
// import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify'
import { cliente } from '../../components/utils'

export default function FormikBasic () {
  const [initialValues, setCliente] = useState(cliente)
  const [goURL, setGoURL] = useState(false)
  const { state: Cliente } = useLocation()
  const ClienteID = new URLSearchParams(document.location.search).get('id')
  const navigate = useNavigate()

  useEffect(() => {
    if (goURL) {
      const timeout = setTimeout(() => {
        window.location.replace('/Clientes')
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [goURL])

  // Comprobar si nos llega una ID y cargar el Cliente
  useEffect(() => {
    if (ClienteID) {
      setCliente(Cliente)
    }
  }, [])
  // End

  const { handleSubmit, getFieldProps } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      uploadCliente(values)
    }
  })

  // Crear Modifica Cliente
  async function uploadCliente (values) {
    if (window.confirm('Confirma que quiere realizar esta operación?')) {
      if (ClienteID === null) {
        await saveCliente(values)
        toast.success('Cliente Creado !', {
          position: toast.POSITION.TOP_CENTER
        })
        setGoURL(true)
      } else {
        await updateCliente(ClienteID, values)
        toast.success('Cliente Actualizado !', {
          position: toast.POSITION.TOP_CENTER
        })
        setGoURL(true)
      }
    }
  }
  async function handleDeactivate (e) {
    if (window.confirm('Confirma que quiere realizar esta operación?')) {
      const values = {
        estado: e.target.id
      }
      await updateCliente(ClienteID, values)
      toast.success('Desactivado!', {
        position: toast.POSITION.TOP_CENTER
      })
      setGoURL(true)
    }
  }
  // END

  return (
    <>
      <Nav active='Cliente' />
      <Container className='mt-3' style={{ textAlign: 'left' }}>
        <Form noValidate onSubmit={handleSubmit}>
          <h5>Datos del Cliente:</h5>
          <Form.Group className='formGroup mt-3' style={{ display: 'flex', gap: 10 }}>
            <div>
              <Form.Label>Nombre:</Form.Label>
              <Form.Control style={{ maxWidth: 450 }} name='telefono' type='tel' placeholder='Nombre' {...getFieldProps('nombre')} />
            </div>
            <div style={{ maxWidth: 90 }}>
              <Form.Label>Color:</Form.Label>
              <Form.Control type='color' {...getFieldProps('color')} />
            </div>
          </Form.Group>
          <Form.Group className='formGroup mt-3' style={{ display: 'flex', gap: 10 }}>
            <div>
              <Form.Label>Teléfono 1</Form.Label>
              <Form.Control style={{ maxWidth: 125 }} name='telefono' type='tel' placeholder='Teléfono' {...getFieldProps('telefono')} />
            </div>
            <div>
              <Form.Label>Teléfono 2</Form.Label>
              <Form.Control style={{ maxWidth: 125 }} name='telefono' type='tel' placeholder='Teléfono' {...getFieldProps('telefono2')} />
            </div>
          </Form.Group>
          <Form.Group className='formGroup mt-3'>
            <div style={{ maxWidth: 450 }}>
              <Form.Label>Dirección:</Form.Label>
              <Form.Control as='textarea' {...getFieldProps('direccion')} />
            </div>
          </Form.Group>
          <Form.Group className='formGroup mt-3'>
            <div style={{ maxWidth: 450 }}>
              <Form.Label>Observaciones Cliente:</Form.Label>
              <Form.Control as='textarea' {...getFieldProps('observacionesCliente')} />
            </div>
          </Form.Group>
          <Button className='mt-3' variant='success' type='submit'>
            {ClienteID === null ? 'Crear Cliente' : 'Actulizar Cliente'}
          </Button>
          <Button onClick={() => navigate(-1)} className='mt-3 ms-3' variant='warning'>
            Volver
          </Button>
        </Form>
        <div style={{ display: 'flex' }}>
          <Button hidden={!ClienteID} id='Borrado' onClick={handleDeactivate} className='mt-3' variant='danger'>
            Borrar Cliente
          </Button>
        </div>
      </Container>
      <ToastContainer />
      <div style={{ marginBottom: 50 }} />
    </>
  )
}
