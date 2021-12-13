import { signInWithGoogle } from "../fn/auth/firebsae.auth"

export const SignIn = () => {

  const handleSignUp = () => {
    (async () => {
      //sign in する
      await signInWithGoogle();
    })();
  }

  return (
    <>
      <h1>ユーザー登録画面</h1>
      <h2>あなたはまだログインしていません</h2>
      <button onClick={handleSignUp}>googleログインはこちら</button>
    </>
  )
}