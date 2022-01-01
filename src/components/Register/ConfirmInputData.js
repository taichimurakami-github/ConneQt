import { Header } from "../UI/Header";

export const ConfirmInputData = (props) => {
  return (
    <>
      <Header title="入力情報の確認" handleBack={props.handleGoBack} />
      <form className="register-form-container" onSubmit={props.onSubmit}>
        <ul>
          <li className="description">
            <h3>お名前</h3>
            <p>{props.registerUserData.name}</p>
          </li>
          <li className="description">
            <h3>年齢</h3>
            <p>{props.registerUserData.age}</p>
          </li>
          <li className="description">
            <h3>プロフィール</h3>
            <p>{props.registerUserData.profile}</p>
          </li>
          <li className="description">
            <h3>出身地</h3>
            <p>
              {props.registerUserData.hometown.prefecture}{" "}
              {props.registerUserData.hometown.city}
            </p>
          </li>
          <li className="description">
            <h3>出身校</h3>
            <p>{props.registerUserData.history.university}</p>
          </li>
          <li className="description">
            <h3>お名前</h3>
            <p>{props.registerUserData.name}</p>
          </li>
        </ul>

        <button type="submit" className="btn-orange">
          この内容で登録する
        </button>
      </form>
    </>
  );
};
