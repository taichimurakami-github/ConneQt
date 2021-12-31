import { signInWithGoogle } from "../fn/auth/firebase.auth";
import { Header } from "./UI/Header";

import "../styles/SignIn.scss";
import logo from "../images/logo-1x.png";

export const SignUp = () => {
  return (
    <>
      <Header title="Hey!" backable={false} />
      <div className="sign-up-content-container">
        <img
          className="app-logo"
          src={logo}
          alt="Hey! コミュニケーション促進サービス"
        ></img>
        <button className="btn-orange btn-sign-up" onClick={signInWithGoogle}>
          googleアカウントでログイン
        </button>
        <p className="copyright">
          &copy; 2021 team ConneQt all rights reserved.
        </p>
      </div>
    </>
  );
};
