import { useContext } from "react";
import { AppRouteContext } from "../../AppRoute";
import { ChoiceActionButton } from "../UI/Button";
import { Header } from "../UI/Header";
import { cmpConfig } from "./config";

export const ConfirmInputData = (props) => {
  const { eraceModal, showConfirmModal, showLoadingModal, showErrorModal } =
    useContext(AppRouteContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    showConfirmModal({
      content: {
        title: "この内容で登録します。よろしいですか？",
      },
      children: (
        <ChoiceActionButton
          callback={{
            yes: props.handleSubmit,
            no: eraceModal,
          }}
        />
      ),
    });
  };

  return (
    <>
      <Header title="入力情報の確認" handleBack={props.handleGoBack} />
      <form className="register-form-container" onSubmit={handleSubmit}>
        <h2>入力内容は以下の通りです。</h2>
        <p className="description">
          「※」のついているものは後から変更できません。
        </p>
        <ul>
          <img
            src={
              props.registerUserData.photoData || props.registerUserData.photo
            }
            className="user-icon"
            alt="アカウントプロフィール画像"
          ></img>
          <li className="description">
            <h3>お名前</h3>
            <p>{props.registerUserData.name}</p>
          </li>
          <li className="description">
            <h3>※性別</h3>
            <p>{props.registerUserData.gender === "male" ? "男性" : "女性"}</p>
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
            <h3>※出身地</h3>
            <p>
              {props.registerUserData.hometown.prefecture}{" "}
              {props.registerUserData.hometown.city}
            </p>
          </li>
          <li className="description">
            <h3>※出身校</h3>
            <p>{props.registerUserData.history.university}</p>
          </li>
          <li className="description">
            <h3>お名前</h3>
            <p>{props.registerUserData.name}</p>
          </li>
        </ul>

        <button
          className="btn-gray"
          onClick={() => {
            props.handleViewState(cmpConfig.state.view["001"]);
          }}
        >
          入力画面に戻る
        </button>
        <button type="submit" className="btn-orange">
          この内容で登録する
        </button>
      </form>
    </>
  );
};
