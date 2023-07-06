import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  orderBy
} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import app, { db } from './config'
import { getStorage } from 'firebase/storage'

export const collectionName = 'pedidos'

export const savePedido = (newPedido) =>
  addDoc(collection(db, collectionName), newPedido)

export const updatePedido = (id, updatedFields) =>
  updateDoc(doc(db, collectionName, id), updatedFields)

export const onGetLinks = (callback) => {
  const unsub = onSnapshot(collection(db, collectionName), callback)
  return unsub
}

const q = query(collection(db, collectionName), where('estado', '==', 'activo'))
export const getPedidos = () => getDocs(q)
const qFinalizado = query(collection(db, collectionName), where('fechaFinalizacion', '!=', ''), orderBy('fechaFinalizacion', 'desc'))
export const getPedidosFinalizados = () => getDocs(qFinalizado)

export const deletePedido = (id) => deleteDoc(doc(db, collectionName, id))

export const getPedido = (id) => getDoc(doc(db, collectionName, id))

export const auth = getAuth(app)
export const firebaseSignOut = () => signOut(auth)
export const signInWithGoogle = async () => {
  signInWithPopup(getAuth(app), new GoogleAuthProvider())
}
// Create a root reference
export const storage = getStorage()
