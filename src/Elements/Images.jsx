import { ref, uploadBytesResumable, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '../components/firebase/apiPedidos'
import { useState, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

const Images = () => {
  const [images, setImages] = useState([])
  const [progress, setProgress] = useState([])
  const aRef = useRef(null)
  const [disableButton, setDisableButton] = useState(true)
  const { state: item } = useLocation()
  const [imageList, setImageList] = useState([])
  const imagesListFolderRef = ref(storage, `${item.nombre}/${item.fechaPedido.replaceAll('/', '_')}`)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    setImageList([])
    listAll(imagesListFolderRef).then(async (response) => {
      const urls = await Promise.all(response.items.map((item) => getDownloadURL(item)))
      setImageList(urls)
    })
  }, [reload])

  const handleFileChange = (e) => {
    const files = e.target.files
    setImages(Array.from(files))
    setDisableButton(false)
  }

  const handleUpload = async () => {
    aRef.current.value = null
    setDisableButton(true)
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const storageRef = ref(storage, `${item.nombre}/${item.fechaPedido.replaceAll('/', '_')}/${uuidv4()}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setProgress((prevProgress) => {
            const newProgress = [...prevProgress]
            newProgress[i] = progress.toFixed(2)
            return newProgress
          })
        },
        (error) => {
          console.error(error.message)
        },
        () => {
          setReload((prevReload) => !prevReload)
        }
      )
    }
  }

  return (
    <>
      {item.estado === 'Finalizado'
        ? null
        : (
        <>
          <div className='galeria mt-3'>
            {imageList.map((url) => (
              <a target='_blank' rel='noopener noreferrer' href={url} key={url}>
                <img src={url} alt='Fotos del pedido' />
              </a>
            ))}
          </div>
          <div className='mt-3' style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: 5 }}>
            <Form.Group controlId='formFile'>
              <Form.Control ref={aRef} multiple onChange={handleFileChange} type='file' />
            </Form.Group>
            <Button variant='success' disabled={disableButton} onClick={handleUpload}>
              Upload File
            </Button>
          </div>
        </>
          )}

      {progress.map((progress, i) => (
        <h5 style={{ color: 'white', margin: 10, maxWidth: 285 }} key={i}>
          {images[i].name} <ProgressBar style={{ marginTop: 5 }} variant='info' now={progress} />
        </h5>
      ))}
    </>
  )
}

export default Images
