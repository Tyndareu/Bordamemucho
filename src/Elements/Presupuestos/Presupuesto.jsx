import Nav from '../../router/Nav'
import { useState, useEffect, useCallback } from 'react'
import { savePresupuesto, updatePresupuesto, deletePresupuesto } from '../../components/firebase/apiPresupuesto'
import { getClientes } from '../../components/firebase/apiClientes'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import Form from 'react-bootstrap/Form'
import { Container, Button } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
// import * as Yup from 'yup'
import { ToastContainer, toast } from 'react-toastify'
import { presupuesto } from '../../components/utils'
import { ClientesDropdown, ActionModal } from '../../components/utilsJSX'

export default function FormikPresupuesto () {
  const { state: Presupuesto } = useLocation()
  const PresupuestoID = new URLSearchParams(document.location.search).get('id')
  const [initialValues, setPresupuesto] = useState(PresupuestoID ? Presupuesto : presupuesto)
  const [goURL, setGoURL] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [ClientesFilter, setClientesFilter] = useState([])
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleSearchName = useCallback((e) => {
    setSearchName(e.target.value)
  }, [setSearchName])

  useEffect(() => {
    const AllClientes = async () => {
      const querySnapshot = await getClientes()
      const docs = []
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), idCliente: doc.id })
      })
      setClientesFilter(
        docs
          .filter((x) => x.estado === 'activo')
          .sort((x, y) => x.nombre.localeCompare(y.nombre))
      )
    }
    AllClientes()
  }, [])

  useEffect(() => {
    if (goURL) {
      const timeout = setTimeout(() => {
        navigate('/Presupuestos')
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [goURL])

  // End
  const handleOnGetCliente = (item) => {
    item.cliente = item.nombre
    item.estado = 'activo'
    item.observaciones = ''
    item.fecha = ''
    setPresupuesto(item)
  }
  const { handleSubmit, getFieldProps } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      uploadPresupuesto(values)
    }
  })

  // Crear Modifica Presupuesto
  async function uploadPresupuesto (values) {
    if (window.confirm('Confirma que quiere realizar esta operación?')) {
      if (PresupuestoID === null) {
        await savePresupuesto(values)
        toast.success('Presupuesto Creado !', {
          position: toast.POSITION.TOP_CENTER
        })
        setGoURL(true)
      } else {
        await updatePresupuesto(PresupuestoID, values)
        toast.success('Presupuesto Actualizado !', {
          position: toast.POSITION.TOP_CENTER
        })
        setGoURL(true)
      }
    }
  }
  async function handleDeactivate () {
    handleClose()
    await deletePresupuesto(PresupuestoID)
    toast.success('Borrado!', {
      position: toast.POSITION.TOP_CENTER
    })
    setGoURL(true)
  }
  // END
  let ListadoClientes = []
  if (searchName !== '') {
    ListadoClientes = ClientesFilter.filter((x) =>
      x.nombre.toLowerCase().includes(searchName.toLowerCase())
    )
  } else {
    ListadoClientes = ClientesFilter
  }
  return (
    <>
      <ActionModal show={show} onHide={handleClose} action={handleDeactivate} />
      <Nav active='Presupuesto' />
      <Container className='mt-3' style={{ textAlign: 'left' }}>
        <Form noValidate onSubmit={handleSubmit}>
          <h5>Datos del Presupuesto:</h5>
          <div style={{ display: 'flex', gap: 20 }}>
            <div>
              <Form.Label style={{ maxWidth: 350 }}>
                Base de Datos:
              </Form.Label>
              <ClientesDropdown
                clientes={ListadoClientes}
                onSearchName={handleSearchName}
                onGetCliente={handleOnGetCliente}
              />
            </div>
            <div style={{ maxWidth: 100 }}>
              <Form.Label>Color:</Form.Label>
              <Form.Control type="text" {...getFieldProps('color')} />
            </div>
          </div>
          <Form.Group className='formGroup mt-3' style={{ display: 'flex', gap: 10 }}>
            <div>
              <Form.Label>Nombre:</Form.Label>
              <Form.Control style={{ maxWidth: 450 }} type='text' placeholder='Cliente' {...getFieldProps('cliente')} />
            </div>
            <div style={{ maxWidth: 170 }}>
              <Form.Label>Fecha:</Form.Label>
              <Form.Control type='date' {...getFieldProps('fecha')} />
            </div>
          </Form.Group>

          <Form.Group className='formGroup mt-3'>
            <div style={{ maxWidth: 450 }}>
              <Form.Label>Observaciones:</Form.Label>
              <Form.Control style={{ height: 150 }} as='textarea' {...getFieldProps('observaciones')} />
            </div>
          </Form.Group>
          <Button className='mt-3' variant='success' type='submit'>
            {PresupuestoID === null ? 'Crear Presupuesto' : 'Actualizar Presupuesto'}
          </Button>
          <Button onClick={() => navigate(-1)} className='mt-3 ms-3' variant='warning'>
            Volver
          </Button>
        </Form>
        <div style={{ display: 'flex' }}>
          <Button hidden={!PresupuestoID} id='Borrado' onClick={handleShow} className='mt-3' variant='danger'>
            Borrar Presupuesto
          </Button>
        </div>
      </Container>
      <ToastContainer />
      <div style={{ marginBottom: 50 }} />
    </>
  )
}
