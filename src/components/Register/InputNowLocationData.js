import { useContext } from "react";
import { AppRouteContext } from "../../AppRoute";
import { setGeolocation } from "../../fn/app/geolocation";
import { ChoiceActionButton } from "../UI/Button";
import { Header } from "../UI/Header";

export const InputNowLocationData = (props) => {
  const { showLoadingModal, showErrorModal, eraceModal } =
    useContext(AppRouteContext);

  const handleGoNext = () => {
    if (
      props.registerUserData.location.lat !== "" &&
      props.registerUserData.location.lng !== ""
    ) {
      props.handleGoNext();
    } else {
      showErrorModal({
        content: {
          title: "現在地が取得されていません。",
          text: [
            "現在地の設定がない場合はマッチングを行うことができません。",
            "現在地の取得を許可してください。",
          ],
        },
      });
    }
  };

  const handleGoBack = () => {
    props.handleGoBack();
  };

  return (
    <>
      <Header title="現在地を登録" handleBack={handleGoBack} />

      <div className="register-form-container">
        <h2>あなたの現在地を登録</h2>

        <p className="description">
          本アプリは、近場にいるユーザー検索を行う際、<br></br>
          アプリユーザーの位置情報の登録が必要です。<br></br>
        </p>

        <p className="description">
          下部のボタンを押して現在地を登録してください。<br></br>
          なお、本設定はアカウント登録後も変更可能です。
        </p>

        <button
          className={`getNowLocation ${
            props.registerUserData.location?.lat &&
            props.registerUserData.location?.lng
              ? "btn-gray"
              : "btn-orange"
          }`}
          type="button"
          disabled={
            props.registerUserData.location?.lat &&
            props.registerUserData.location?.lng
          }
          onClick={() => {
            showLoadingModal();
            setGeolocation((value) => {
              props.dispatchUserData({
                type: "set",
                value: {
                  location: { ...value },
                },
              });
              eraceModal();
            });
          }}
        >
          {props.registerUserData.location?.lat &&
          props.registerUserData.location?.lng
            ? "現在地を取得しました。"
            : "現在地を設定（後からでも設定可能です）"}
        </button>
        <ChoiceActionButton
          callback={{
            yes: handleGoNext,
            no: handleGoBack,
          }}
          text={{
            yes: "次へ進む >",
            no: "< 前に戻る",
          }}
          reverseOrder={true}
        />
      </div>
    </>
  );
};
