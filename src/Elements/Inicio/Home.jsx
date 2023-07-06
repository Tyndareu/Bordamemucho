import { getPedidos } from '../../components/firebase/apiPedidos'
import { useEffect, useState } from 'react'
import { isMobile } from '../../components/utils'
import SinPermiso from '../../components/SinPermiso'
import Loading from '../../components/Loading'
import HomeMobileView from './HomeMobileView'
import HomeDesktopview from './HomeDesktopview'

export default function Home () {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [initialPedidos, setInitialPedidos] = useState([])

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const querySnapshot = await getPedidos()
        const docs = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        setInitialPedidos(docs)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsError(true)
        setIsLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <SinPermiso />
  }

  return (
    <>
      {isMobile
        ? (
        <HomeMobileView initialPedidos={initialPedidos} />
          )
        : (
        <HomeDesktopview initialPedidos={initialPedidos} />
          )}
    </>
  )
}
