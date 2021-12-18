import { signInWithGoogle } from "../fn/auth/firebase.auth"
import { Header } from "./UI/Header";

import logo from "../images/logo-1x.png";

export const SignUp = () => {

  return (
    <>
      <Header
        title="hey! へようこそ"
        backable={false}
      />
      <p>version: demo-template-with-cra.2021.12.15</p>
      <img src={logo} alt="hey! ~コミュニケーション促進サービス~"></img>
      <h2>まずはログインしましょう！</h2>
      <button className="btn-orange" onClick={signInWithGoogle}>googleでログイン</button>
    </>
  )
}