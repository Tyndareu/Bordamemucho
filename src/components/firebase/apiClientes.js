import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import app, { db } from './config'

const collectionName = 'clientes'

export const saveCliente = (newCliente) =>
  addDoc(collection(db, collectionName), newCliente)

export const updateCliente = (id, updatedFields) =>
  updateDoc(doc(db, collectionName, id), updatedFields)

export const onGetLinks = (callback) => {
  const unsub = onSnapshot(collection(db, collectionName), callback)
  return unsub
}

export const getClientes = () => getDocs(collection(db, collectionName))

export const deleteCliente = (id) => deleteDoc(doc(db, collectionName, id))

export const getCliente = (id) => getDoc(doc(db, collectionName, id))

export const auth = getAuth(app)
export const firebaseSignOut = () => signOut(auth)
export const signInWithGoogle = () => {
  signInWithPopup(getAuth(app), new GoogleAuthProvider())
}
