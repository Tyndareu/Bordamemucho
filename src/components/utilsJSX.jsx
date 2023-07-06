import { Dropdown, Modal, Button, Form } from 'react-bootstrap'
import 'react-toastify/dist/ReactToastify.css'

export const ClientesDropdown = ({ clientes, onSearchName, onGetCliente }) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Clientes
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Form.Control
          style={{ margin: 3 }}
          placeholder="Buscar"
          onChange={onSearchName}
        />
        {clientes.map((item) => (
          <Dropdown.Item
            onClick={() => onGetCliente(item)}
            key={item.idCliente}
          >
            {item.nombre.toUpperCase()}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export function ActionModal ({ show, onHide, action, values }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>¿Confirma que quiere realizar esta acción?</Modal.Title>
      </Modal.Header>
      <Modal.Footer>
        <Button variant='primary' onClick={onHide}>
          Cancelar
        </Button>
        <Button variant='danger' onClick={() => action(values)}>
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
