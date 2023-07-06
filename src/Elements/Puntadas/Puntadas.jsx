/* eslint-disable react/prop-types */
import { useState } from 'react'
import Nav from '../../router/Nav'
import { auth } from '../../components/firebase/apiPedidos'
import { useAuthState } from 'react-firebase-hooks/auth'
import Loading from '../../components/Loading'
import { PuntadasCalculations, PuntadasForm, EmbroideryPricingTable } from './PuntadasResources'

export default function Puntadas () {
  const [user] = useAuthState(auth)
  const [inputs, setInputs] = useState({ precio: '20', puntadas: '45000', velocidad: 750, cortes: '0', segundos: '3', prendas: '1' })
  const formElements = [
    { label: 'Precio por hora:', name: 'precio', value: inputs.precio, type: 'number' },
    { label: 'Puntadas:', name: 'puntadas', value: inputs.puntadas, type: 'number' },
    { label: 'Velocidad (PPM):', name: 'velocidad', value: inputs.velocidad, type: 'number' },
    { label: 'Cortes:', name: 'cortes', value: inputs.cortes, type: 'number' },
    { label: 'Segundos por Cortes:', name: 'segundos', value: inputs.segundos, type: 'number' },
    { label: 'Numero de Prendas:', name: 'prendas', value: inputs.prendas, type: 'number' }
  ]
  const formCliente = [
    { label: 'Cliente:', name: 'cliente', value: inputs.cliente, type: 'text' },
    { label: 'Bordado:', name: 'bordado', value: inputs.bordado, type: 'text' },
    { label: 'Bastidor:', name: 'bastidor', value: inputs.bastidor, type: 'text' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (e.target.name === 'velocidad') {
      if (e.target.value < 1) {
        setInputs(values => ({ ...values, [name]: 1 }))
      } else {
        setInputs(values => ({ ...values, [name]: value }))
      }
    } else {
      setInputs(values => ({ ...values, [name]: value }))
    }
  }

  if (user) {
    return (
      <>
        <Nav active='Puntadas' />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20, marginBottom: 80, gap: 30 }}>
          <PuntadasForm formElements={formElements} handleInputChange={handleInputChange} />
          <PuntadasCalculations inputs={inputs} />
          <EmbroideryPricingTable inputs={inputs} formCliente={formCliente} handleInputChange={handleInputChange} />
        </div>
      </>
    )
  } else {
    return (
      <Loading />
    )
  }
}
