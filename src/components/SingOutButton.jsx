import { firebaseSignOut } from './firebase/apiPedidos'

export const SignOutButton = () => {
  return <button className="reg" style={{ marginRight: 20 }} onClick={firebaseSignOut} >Sing Out</button>
}
