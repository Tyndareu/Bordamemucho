import { signInWithGoogle } from './firebase/apiPedidos'

export const SignInButton = () => {
  return <button className="log" style={{ marginRight: 20 }} onClick={signInWithGoogle} >Log In</button>
}
