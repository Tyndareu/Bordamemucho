import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs
} from 'firebase/firestore'
import { db } from './config'

const collectionName = 'presupuestos'

export const savePresupuesto = (newPresupuesto) =>
  addDoc(collection(db, collectionName), newPresupuesto)

export const updatePresupuesto = (id, updatedFields) =>
  updateDoc(doc(db, collectionName, id), updatedFields)

export const getPresupuestos = () => getDocs(collection(db, collectionName))

export const deletePresupuesto = (id) => deleteDoc(doc(db, collectionName, id))

export const getPresupuesto = (id) => getDoc(doc(db, collectionName, id))
