import { useContext } from "react";
import { deleteAuthUserDoc } from "../../fn/db/deleteHandler";

import { Header } from "../UI/Header";
import { ListMenu } from "../UI/Menu";
import { ChoiceActionButton } from "../UI/Button";

import { cmpConfig } from "./config";
import { AppRouteContext } from "../../AppRoute";
import { appInfo } from "../../app.config";

export const MypageTop = (props) => {
  const {
    authUserDoc,
    eraceModal,
    showLoadingModal,
    showConfirmModal,
    showErrorModal,
    signOutFromApp,
  } = useContext(AppRouteContext);

  const handleDeleteAccount = async () => {
    const targetDoc = { ...authUserDoc };
    showLoadingModal();
    console.log("deleting your account...");
    await deleteAuthUserDoc(targetDoc);
    signOutFromApp();
    eraceModal();
    showConfirmModal({
      content: {
        title: "アカウントの削除が完了しました。",
        text: ["ご利用ありがとうございました。"],
      },
    });
  };

  const handleSetGeolocation = () => {
    console.log("set your location ...");
    showConfirmModal({
      content: {
        title: "現在地を取得します",
        text: ["現在地の取得を許可してください。"],
      },
      children: (
        <ChoiceActionButton
          text={{
            yes: "現在地を取得",
            no: "閉じる",
          }}
          callback={{
            yes: () => {
              showLoadingModal();
              navigator.geolocation.getCurrentPosition(
                successCallback,
                errorCallback
              );
            },
            no: eraceModal,
          }}
        />
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
        <ChoiceActionButton
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
        <h3 className="mypage-menu-list-title mg-top-0">ユーザー情報</h3>

        <img
          className="user-icon"
          src={props.nowUserDoc?.photo}
          alt={props.nowUserDoc?.name + "さんのプロフィール画像"}
        ></img>

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

        <ListMenu
          id="EDIT_ACCOUNT_LOCATION"
          handleClick={handleSetGeolocation}
          title="位置情報を現在地に設定"
        />

        <button className="btn-gray btn-sign-out" onClick={signOutFromApp}>
          ログアウトする
        </button>

        <h3 className="mypage-menu-list-title">マッチング設定</h3>

        <ListMenu
          id={cmpConfig.state.view["011"]}
          handleClick={() => props.handleViewState(cmpConfig.state.view["011"])}
          title="マッチングを許可する年齢幅を設定："
          content={`年上：${
            props.nowUserDoc?.setting?.matching?.age?.diff?.plus || ""
          } 歳まで / 年下：${
            props.nowUserDoc?.setting?.matching?.age?.diff?.minus
          } 歳まで `}
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
        <h3 className="mypage-menu-list-title">その他</h3>

        <ListMenu
          id={cmpConfig.state.view["000"]}
          handleClick={() => {
            showConfirmModal({
              content: {
                title: "アプリ情報",
              },
              children: (
                <div>
                  <p>version: {appInfo.version + "__" + appInfo.mode}</p>
                  <a href="mailto:conneqtu@gmail.com">
                    連絡先: conneqtu@gmail.com
                  </a>
                  <button onClick={eraceModal} className="btn-gray">
                    閉じる
                  </button>
                </div>
              ),
            });
          }}
          title="アプリ情報"
        />

        {/* <ListMenu
          id={cmpConfig.state.view["010"]}
          handleClick={() => props.handleViewState(cmpConfig.state.view["005"])}
          title="チケットを追加"
        /> */}
        <ListMenu
          id="DELETE_ACCOUNT"
          handleClick={confirmDeleteAccount}
          title={<span className="orange">アカウントを削除</span>}
        />
      </ul>
    </>
  );
};
