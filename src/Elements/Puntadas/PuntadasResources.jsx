import { ListGroup, Form, Table } from 'react-bootstrap'
import { calculateTimePerEmbroidery, calculateEmbroideryPerHour, calculateEmbroideryPrice, calculateTotalTime, calculateTotalPrice, isMobile } from '../../components/utils'

const listItemStyle = { width: '65%', marginTop: 3 }
const listItemInfoStyle = { width: '35%', marginTop: 3 }

export function PuntadasCalculations ({ inputs }) {
  return (
    <div style={{ textAlignLast: 'left', width: '350px' }}>
      <ListGroup horizontal>
        <ListGroup.Item variant="success" style={listItemStyle}>Tiempo por Bordado:</ListGroup.Item>
        <ListGroup.Item variant="info" style={listItemInfoStyle}>{calculateTimePerEmbroidery(inputs)}</ListGroup.Item>
      </ListGroup>
      <ListGroup horizontal>
        <ListGroup.Item variant="success" style={listItemStyle}>Bordados por hora:</ListGroup.Item>
        <ListGroup.Item variant="info" style={listItemInfoStyle}>{calculateEmbroideryPerHour(inputs)}</ListGroup.Item>
      </ListGroup>
      <ListGroup horizontal>
        <ListGroup.Item variant="success" style={listItemStyle}>Precio por Bordado:</ListGroup.Item>
        <ListGroup.Item variant="info" style={listItemInfoStyle}>{calculateEmbroideryPrice(inputs)}€</ListGroup.Item>
      </ListGroup>
      <ListGroup horizontal>
        <ListGroup.Item variant="success" style={listItemStyle}>Tiempo Total {inputs.prendas} Prenda/s:</ListGroup.Item>
        <ListGroup.Item variant="info" style={listItemInfoStyle}>{calculateTotalTime(inputs)}</ListGroup.Item>
      </ListGroup>
      <ListGroup horizontal>
        <ListGroup.Item variant="success" style={listItemStyle}>Precio Total {inputs.prendas} Prenda/s:</ListGroup.Item>
        <ListGroup.Item variant="info" style={listItemInfoStyle}>{calculateTotalPrice(inputs)}€</ListGroup.Item>
      </ListGroup>
    </div>
  )
}
export function PuntadasForm ({ formElements, handleInputChange }) {
  return (
    <>
      <div style={{ width: '300px' }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPrecio">
            {formElements.map((element, index) => (
              <div style={{ display: 'flex', justifyContent: 'space-between' }} key={element.name}>
                <ListGroup horizontal>
                  <ListGroup.Item style={{ width: '190px', textAlign: 'right' }} variant="success">{element.label}</ListGroup.Item>
                </ListGroup>
                <Form.Control
                  style={{ width: '90px' }}
                  name={element.name}
                  value={element.value}
                  onChange={handleInputChange}
                  type={element.type} />
              </div>
            ))}
          </Form.Group>
        </Form>
      </div>

    </>
  )
}

export const EmbroideryPricingTable = ({ inputs, handleInputChange, formCliente }) => {
  return (
    <>
      <div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPrecio">
            {formCliente.map((element) => (
              <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }} key={element.name}>
                <ListGroup horizontal>
                  <ListGroup.Item style={{ width: '90px' }} variant="success">{element.label}</ListGroup.Item>
                </ListGroup>
                <Form.Control
                  style={{ width: '180px' }}
                  name={element.name}
                  value={element.value}
                  onChange={handleInputChange}
                  type={element.type} />
              </div>
            ))}
          </Form.Group>
        </Form>
      </div>
      <div style={{ width: '100%', backgroundColor: 'white', padding: 30, borderRadius: 15 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className='logo'></div>
          </div>
          <Table striped>
            <thead>
              <tr>
                <th colSpan={2}>Descuento por cantidad</th>
                <th>Descuento %</th>
                <th>Precio Unidad</th>
              </tr>
            </thead>
            <tbody>
              {generateTableRows(inputs)}
            </tbody>
          </Table>
          <ListGroup horizontal style={{ justifyContent: 'center' }}>
            <ListGroup.Item variant="success" style={!isMobile && { padding: 20, fontSize: '1.8rem' }}>{inputs.cliente}</ListGroup.Item>
            <ListGroup.Item variant="success" style={!isMobile && { padding: 20, fontSize: '1.8rem' }}>Bordado: {inputs.bordado}</ListGroup.Item>
            <ListGroup.Item variant="success" style={!isMobile && { padding: 20, fontSize: '1.8rem' }}>Bastidor: {inputs.bastidor}</ListGroup.Item>
          </ListGroup>
        </div>
      </div>
    </>
  )
}
function generateTableRows (inputs) {
  const price = calculateEmbroideryPrice(inputs)
  const discountTableData = [[1, 9, ''], [10, 25, 5], [26, 49, 10], [50, 99, 15], [100, '', 20]]

  function calculateDiscountedPrice (discount) {
    return (price - (price * discount / 100)).toFixed(2)
  }

  return discountTableData.map((row, index) => (
    <tr key={index}>
      {row.map((cell, index) => (
        <td key={index}>{cell}</td>
      ))}
      <td>{calculateDiscountedPrice(row[2])}€</td>
    </tr>
  ))
}
