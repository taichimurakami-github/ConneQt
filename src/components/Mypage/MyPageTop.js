import { Header } from "../UI/Header";
import { cmpConfig } from "./config";
import { ListMenu } from "../UI/Menu";
import { AppRouteContext } from "../../AppRoute";
import { useContext } from "react";
import { ModalConfirmButton } from "../UI/Button";
import { deleteAuthUserDoc } from "../../fn/db/firestore.handler";
import { setGeolocation } from "../../fn/app/geolocation";

export const MypageTop = (props) => {
  const {
    eraceModal,
    showLoadingModal,
    showConfirmModal,
    showErrorModal,
    signOutFromApp,
  } = useContext(AppRouteContext);

  const handleDeleteAccount = async () => {
    showLoadingModal();
    console.log("deleting your account...");
    await deleteAuthUserDoc(props.nowUserDoc);
    eraceModal();
    signOutFromApp();
  };

  const handleSetGeolocation = () => {
    console.log("set your location ...");
    showConfirmModal({
      content: {
        title: "現在地を取得します",
        text: ["現在地の取得を許可してください。"],
      },
      children: (
        <button
          className="btn-orange"
          onClick={() => {
            showLoadingModal();
            navigator.geolocation.getCurrentPosition(
              successCallback,
              errorCallback
            );
          }}
        >
          現在地を取得して設定
        </button>
      ),
    });

    const successCallback = (data) => {
      props.handleExecUpdate(
        {
          location: {
            lat: data.coords.latitude,
            lng: data.coords.longitude,
          },
        },
        {
          content: {
            title: "現在地の取得と設定に成功しました",
          },
        }
      );
    };

    const errorCallback = (e) => {
      const errorData = e;
      let errorMessage = "位置情報の取得中にエラーが発生しました。";

      if (e.code === 1) errorMessage = "現在地の取得を許可してください。";

      showErrorModal({
        content: {
          title: "現在地の取得に失敗しました。",
          text: [errorMessage],
        },
      });
    };
  };

  const confirmDeleteAccount = () => {
    showConfirmModal({
      // closable: false,
      content: {
        title: "アカウントを削除しますか？",
        text: ["この操作は取り消せません。", "本当に実行しますか？"],
      },
      children: (
        <ModalConfirmButton
          callback={{
            yes: handleDeleteAccount,
            no: eraceModal,
          }}
        />
      ),
    });
  };

  return (
    <>
      <Header title="マイページ" backable={false} />

      <ul className="mypage-top-wrapper">
        <img className="user-icon" src={props.nowUserDoc?.photo}></img>

        <ListMenu
          id={cmpConfig.state.view["003"]}
          handleClick={() => props.handleViewState(cmpConfig.state.view["003"])}
          title="お名前を編集："
          content={props.nowUserDoc?.name}
        />

        <ListMenu
          id={cmpConfig.state.view["004"]}
          handleClick={() => props.handleViewState(cmpConfig.state.view["004"])}
          title="年齢を編集："
          content={props.nowUserDoc?.age}
        />

        <ListMenu
          id={cmpConfig.state.view["005"]}
          handleClick={() => props.handleViewState(cmpConfig.state.view["005"])}
          title="プロフィールを編集："
          content={props.nowUserDoc?.profile}
        />

        {/* <ListMenu
          id={cmpConfig.state.view["006"]}
          handleClick={() =>
            props.handleViewState(cmpConfig.state.view["005"])
          }
          title="出身地を編集："
          content={
            props.nowUserDoc?.hometown.prefecture + " " + props.nowUserDoc?.hometown.city
          }
        />

        <ListMenu
          id={cmpConfig.state.view["007"]}
          handleClick={() =>
            props.handleViewState(cmpConfig.state.view["005"])
          }
          title="出身大学を編集："
          content={props.nowUserDoc?.history?.university}
        /> */}

        <ListMenu
          id="EDIT_ACCOUNT_LOCATION"
          handleClick={handleSetGeolocation}
          title="位置情報を設定"
        />

        {/* <ListMenu
          id={cmpConfig.state.view["010"]}
          handleClick={() => props.handleViewState(cmpConfig.state.view["005"])}
          title="チケットを追加"
        /> */}

        <ListMenu
          id="DELETE_ACCOUNT"
          handleClick={confirmDeleteAccount}
          title="アカウントを削除"
        />
      </ul>
      <button className="btn-gray" onClick={signOutFromApp}>
        ログアウトする
      </button>
    </>
  );
};
