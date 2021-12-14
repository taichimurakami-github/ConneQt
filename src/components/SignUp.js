import { signInWithGoogle } from "../fn/auth/firebase.auth"
import { Header } from "./Header";

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
        backable={false}
      />
      <h1>ユーザー登録画面</h1>
      <h2>あなたはまだログインしていません</h2>
      <button className="btn-orange" onClick={handleSignUp}>googleログインはこちら</button>
    </>
  )
}