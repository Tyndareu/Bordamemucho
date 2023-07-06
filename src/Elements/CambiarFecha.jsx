import { Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { collectionName, getPedidosFinalizados } from '../components/firebase/apiPedidos'
import { db } from '../components/firebase/config'
import Loading from '../components/Loading'
import {
  collection,
  query
} from 'firebase/firestore'
import Nav from '../router/Nav'

export default function ListadoGeneral () {
  const [pedidos, setPedidos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const q = query(collection(db, collectionName))

  const AllPedidos = async (q) => {
    const querySnapshot = await getPedidosFinalizados(q)
    const docs = []
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id })
    })
    setPedidos(docs)
    setIsLoading(false)
  }

  useEffect(() => {
    AllPedidos(q)
  }, [])
  if (isLoading) {
    <Loading />
  }

  pedidos.forEach(element => {
    element.fechaPedido = element.fechaPedido.split('/')
    element.fechaPedido[1] = ((element.fechaPedido[1]) * 1)
    element.fechaPedido = element.fechaPedido.join('/')
    console.log(element)
    console.log(element.id)
  })
  return (
    <>
      <Nav />
      <div className='mb-5 text-center'>
        <Table className='mt-3' bordered hover size='sm'>
          <thead>
            <tr style={{ border: 0 }}>
              <th style={{ border: 0, width: 90 }} scope='col'>Nº Pedido</th>
              <th style={{ border: 0, width: 90 }} scope='col'>Fecha de Pedido</th>
              <th style={{ border: 0, width: 90 }} scope='col'>Fecha de Entrega</th>
              <th style={{ border: 0, width: 90 }} scope='col'>Fecha Finalizado</th>
            </tr>
          </thead>
          <tbody align='center'>
            {pedidos.map((item) => (
              <tr
                style={{ cursor: 'pointer' }}
                key={item.id}
              >
                <td>{item.n_pedido}</td>
                <td>{item.fechaPedido}</td>
                <td>{item.fechaEnrega}</td>
                <td>{item.fechaEnrega}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

    </>
  )
}
