import { useState, useEffect, useContext } from "react";
import { AppRouteContext } from "../../AppRoute";
import { getImageDataURL } from "../../fn/app/getImageDataURL";
import { ChoiceActionButton } from "../UI/Button";
import { Header } from "../UI/Header";
import { cmpConfig } from "./config";

export const ConfirmInputData = (props) => {
  const { eraceModal, showConfirmModal, showLoadingModal, showErrorModal } =
    useContext(AppRouteContext);

  const [previewImageDataURL, setPreviewImageDataURL] = useState(undefined);

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

  //previewImageDataURLを動的変更
  useEffect(() => {
    (async () => {
      if (!props.registerUserData.photoData) return;

      showLoadingModal();
      try {
        setPreviewImageDataURL(
          await getImageDataURL(props.registerUserData.photoData)
        );
        eraceModal();
      } catch (e) {
        console.log(e);
        showErrorModal({
          content: {
            title: "画像の取得に失敗しました。",
            text: ["お手数ですが、設定する画像を再選択してください。"],
          },
        });
      }
    })();
  }, []);

  return (
    <>
      <Header title="入力情報の確認" handleBack={props.handleGoBack} />
      <form className="register-form-container" onSubmit={handleSubmit}>
        <h2>入力内容は以下の通りです。</h2>
        <ul>
          <img
            src={previewImageDataURL || props.registerUserData.photo}
            className="user-icon"
            alt="アカウントプロフィール画像"
          ></img>
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
