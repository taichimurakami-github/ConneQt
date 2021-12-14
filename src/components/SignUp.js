import { signInWithGoogle } from "../fn/auth/firebase.auth"
import { Header } from "./Header";

import logo from "../images/logo-1x.png";

export const SignUp = () => {

  const handleSignUp = () => {
    (async () => {
      //sign in する
      await signInWithGoogle();
    })();
  }

  return (
    <>
      <Header
        title="hey! へようこそ"
        backable={false}
      />
      <p>version: demo-template-with-cra.2021.12.15</p>
      <img src={logo} alt="hey! ~コミュニケーション促進サービス~"></img>
      <h2>まずはログインしましょう！</h2>
      <button className="btn-orange" onClick={handleSignUp}>googleでログイン</button>
    </>
  )
}