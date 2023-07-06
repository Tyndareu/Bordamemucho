import Nav from '../../router/Nav'
import Images from '../Images'
import { useState, useEffect } from 'react'
import {
  savePedido,
  updatePedido,
  deletePedido
} from '../../components/firebase/apiPedidos'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { Container, Button, Form } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'
import * as Yup from 'yup'
import { today, textRed, estadoPedido, isMobile, whiteValues, useAllClientes } from '../../components/utils'
import { ToastContainer, toast } from 'react-toastify'
import { ClientesDropdown } from '../../components/utilsJSX'
import confetti from 'canvas-confetti'

export default function formPedido () {
  const pedidoID = new URLSearchParams(document.location.search).get('id')
  const { state: pedido } = useLocation()
  const [initialValues, setPedido] = useState(pedidoID ? pedido : whiteValues)
  const [goURL, setGoURL] = useState(false)
  const pedidoFinalizado = new URLSearchParams(document.location.search).get('from')
  const navigate = useNavigate()
  const [searchName, setSearchName] = useState('')

  const handleSearchName = (e) => {
    setSearchName(e.target.value)
  }
  const handleOnGetCliente = (item) => {
    item.fechaPedido = today
    item.pedido = ''
    item.estadoPedido = 'Pendiente'
    item.fechaEnrega = ''
    item.detalleDelPedido = ''
    item.estado = 'activo'
    item.observaciones = ''
    item.descripcionLarga = ''
    setPedido(item)
  }
  const ClientesFilter = useAllClientes()

  useEffect(() => {
    if (goURL) {
      const timeout = setTimeout(() => {
        navigate('/')
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [goURL])

  const { handleSubmit, errors, getFieldProps } = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      pedido: Yup.string().required('Required'),
      // cliente: Yup.string().required('Required'),
      fechaEnrega: Yup.string().required('Required')
    }),
    onSubmit: (values) => {
      uploadPedido(values)
    }
  })

  // Crear Modifica Pedido
  async function uploadPedido (values) {
    if (window.confirm('Confirma que quiere realizar esta operación?')) {
      if (pedidoID === null) {
        await savePedido(values)
          .then(
            toast.success('Pedido Creado !', {
              position: toast.POSITION.TOP_CENTER
            }),
            setGoURL(true)
          )
      } else {
        await updatePedido(pedidoID, values)
          .then(
            toast.success('Pedido Actualizado !', {
              position: toast.POSITION.TOP_CENTER
            }),
            setGoURL(true)
          )
      }
    }
  }
  async function handleDeactivate (e) {
    if (window.confirm('Confirma que quiere realizar esta operación?')) {
      const values = {
        estado: e.target.id,
        fechaFinalizacion: today.split('/').reverse().join('-')
      }
      await updatePedido(pedidoID, values)
        .then(
          toast.success('Desactivado!', {
            position: toast.POSITION.TOP_CENTER
          }),
          confetti(),
          setGoURL(true)
        )
    }
  }
  async function handleOnDelete () {
    if (
      window.confirm(
        'Confirma que quieres realizar esta operación?'
      )
    ) {
      try {
        await (pedidoFinalizado ? deletePedido(pedidoID) : deletePedido(pedidoID))
          .then(
            toast.success('Pedido Borrado !', {
              position: toast.POSITION.TOP_CENTER
            }),
            setTimeout(() => navigate(pedidoFinalizado ? '/Desactivados' : '/'), 4000)
          )
      } catch (error) {
        toast.error(
          'Error al borrar el pedido, intentelo mas tarde !',
          {
            position: toast.POSITION.TOP_CENTER
          }
        )
      }
    }
  }
  let ListadoClientes = []
  if (searchName !== '') {
    ListadoClientes = ClientesFilter.filter((x) =>
      x.nombre.toLowerCase().includes(searchName.toLowerCase())
    )
  } else {
    ListadoClientes = ClientesFilter
  }
  // END
  return (
    <>
      <Nav active="Pedido" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <Container className="mt-3" >
            <Form noValidate onSubmit={handleSubmit}>
              <h5>Datos del Pedido:</h5>
              <Form.Group className="formGroup">
                <div style={{ maxWidth: 350 }}>
                  <Form.Label style={errors.pedido ? textRed : null}>
                    Pedido:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Campo Obligatorio"
                    {...getFieldProps('pedido')}
                  />
                </div>
              </Form.Group>
              <Form.Group
                className="formGroup mt-3"
                style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
              >
                <div style={{ maxWidth: 350 }}>
                  <Form.Label style={errors.cliente ? textRed : null}>
                    Cliente:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Campo Obligatorio"
                    {...getFieldProps('nombre')}
                  />
                </div>
                <div style={{ maxWidth: 90 }}>
                  <Form.Label>Color:</Form.Label>
                  <Form.Control type="color" {...getFieldProps('color')} />
                </div>
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
                <div>
                  <Button
                    style={{ marginTop: 31 }}
                    variant="success"
                    onClick={() => navigate('/Cliente')}
                  >
                    Nuevo Cliente
                  </Button>
                </div>
              </Form.Group>
              <Form.Group
                className="formGroup mt-3"
                style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}
              >
                <div>
                  <Form.Label>Teléfono 1</Form.Label>
                  <Form.Control
                    style={{ maxWidth: 125 }}
                    name="telefono"
                    type="tel"
                    placeholder="Teléfono"
                    {...getFieldProps('telefono')}
                  />
                </div>
                <div>
                  <Form.Label>Teléfono 2</Form.Label>
                  <Form.Control
                    style={{ maxWidth: 125 }}
                    name="telefono"
                    type="tel"
                    placeholder="Teléfono"
                    {...getFieldProps('telefono2')}
                  />
                </div>
                <div>
                  <Form.Label>Dirección:</Form.Label>
                  <Form.Control
                    style={{ width: 285, height: 80 }}
                    as="textarea"
                    {...getFieldProps('direccion')}
                  />
                </div>
              </Form.Group>
              <Form.Group
                style={{ display: 'flex', gap: 10 }}
                className="formGroup mt-3"
              >
                <div>
                  <Form.Label style={errors.fechaEnrega ? textRed : null}>
                    Fecha Entrega
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: 145 }}
                    name="fechaEnrega"
                    type="date"
                    placeholder="Fecha Enrega al Cliente"
                    {...getFieldProps('fechaEnrega')}
                  />
                </div>
                <div>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    id="Estado"
                    {...getFieldProps('estadoPedido')}
                    style={{ maxWidth: 150, height: 40 }}
                  >
                    {estadoPedido.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Form.Group>

              <Form.Group
                style={{ display: 'flex', gap: 40 }}
                className="formGroup mt-3"
              >
                <div>
                  <Form.Label>
                    Camisa
                  </Form.Label>
                  <Form.Check
                    defaultChecked={initialValues.posicionamiento ? initialValues.posicionamiento.camisa.left : false}
                    name="camisaLeft"
                    type="switch"
                    label="Izquierda"
                    {...getFieldProps('posicionamiento.camisa.left')}
                  />
                  <Form.Check
                   defaultChecked={initialValues.posicionamiento ? initialValues.posicionamiento.camisa.right : false}
                    name="camisaRight"
                    type="switch"
                    label="Derecha"
                    {...getFieldProps('posicionamiento.camisa.right')}
                  />
                </div>
                <div>
                  <Form.Label>
                    Polo
                  </Form.Label>
                  <Form.Check
                   defaultChecked={initialValues.posicionamiento ? initialValues.posicionamiento.polo.left : false}
                    name="camisaLeft"
                    type="switch"
                    label="Izquierda"
                    {...getFieldProps('posicionamiento.polo.left')}
                  />
                  <Form.Check
                    defaultChecked={initialValues.posicionamiento ? initialValues.posicionamiento.polo.right : false}
                    name="camisaRight"
                    type="switch"
                    label="Derecha"
                    {...getFieldProps('posicionamiento.polo.right')}
                  />
                </div>
              </Form.Group>

              <Form.Group
                style={{ display: 'flex', gap: 10 }}
                className="formGroup mt-3"
              >
                <div>
                  <Form.Label>
                    S
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: 70 }}
                    name="tallaS"
                    type="number"
                    {...getFieldProps('tallas.S')}
                  />
                </div>
                <div>
                  <Form.Label>
                    M
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: 70 }}
                    name="tallaM"
                    type="number"
                    {...getFieldProps('tallas.M')}
                  />
                </div>
                <div>
                  <Form.Label>
                    L
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: 70 }}
                    name="tallaL"
                    type="number"
                    {...getFieldProps('tallas.L')}
                  />
                </div>
                <div>
                  <Form.Label>
                    XL
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: 70 }}
                    name="tallaXL"
                    type="number"
                    {...getFieldProps('tallas.XL')}
                  />
                </div>
                <div>
                  <Form.Label>
                    2XL
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: 70 }}
                    name="tallaXXL"
                    type="number"
                    {...getFieldProps('tallas.XXL')}
                  />
                </div>
                <div>
                  <Form.Label>
                    3XL
                  </Form.Label>
                  <Form.Control
                    style={{ maxWidth: 70 }}
                    name="tallaXXL"
                    type="number"
                    {...getFieldProps('tallas.XXXL')}
                  />
                </div>
              </Form.Group>

              <Form.Group
                className="mt-3"
                style={{ display: 'flex', gap: 20 }}
              ></Form.Group>
              <Form.Group className="formGroup mt-3">
                <div style={{ maxWidth: 500 }}>
                  <Form.Label>Observaciones:</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...getFieldProps('observaciones')}
                  />
                </div>
              </Form.Group>
              <Form.Group className="formGroup mt-3">
                <div style={{ maxWidth: 500 }}>
                  <Form.Label>Descripcion Larga:</Form.Label>
                  <Form.Control
                    style={{ height: 120 }}
                    as="textarea"
                    {...getFieldProps('descripcionLarga')}
                  />
                </div>
              </Form.Group>
              <div style={{ justifyContent: 'left', display: 'flex' }}>
                <Button
                  hidden={pedidoFinalizado}
                  className="mt-3 me-3" variant="success" type="submit">
                  {pedidoID === null ? 'Crear Pedido' : 'Actualizar Pedido'}
                </Button>
                <Button
                  onClick={() => navigate(-1)}
                  className="mt-3"
                  variant="success"
                >
                  Volver
                </Button>
              </div>
            </Form>

            <div style={{ display: 'flex' }}>
              <Button
                hidden={!pedidoID || pedido.estado === 'Finalizado'}
                id="Finalizado"
                onClick={handleDeactivate}
                className="mt-3 me-3"
                variant="warning"
              >
                Finalizar Pedido
              </Button>
              <Button
              hidden={!pedidoID}
                id="Borrado"
                onClick={handleOnDelete}
                className="mt-3"
                variant="danger"
              >
                Borrar Pedido
              </Button>
            </div>
          </Container>
          <ToastContainer />
        </div>
        <div style={!isMobile ? { width: '45%' } : { width: '100%' }}>
          {pedidoID ? <Images item={pedido} /> : null}
        </div>
      </div>
      <div style={{ marginBottom: 50 }} />
    </>
  )
}
