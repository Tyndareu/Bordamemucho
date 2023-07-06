import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { router } from './router/Index'
import './main.css'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

/*  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode> */
