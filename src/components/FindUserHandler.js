import { useEffect, useState, useContext } from "react";
// import { appConfig } from "../app.config";

//import components
import { ShowFoundUsersList } from "./FindUsers/ShowFoundUsersList";
import { ShowUserProfile } from "./FindUsers/ShowUserProfile";
import { ShowRequestForm } from "./FindUsers/ShowRequestForm";
import ErrorBoundary from "./ErrorBoundary";

//import firebase fn
import { getRelatedUserDocs } from "../fn/db/getHandler";
import { sendRequest } from "../fn/db/requestHandler";

//import config
import cmpConfig from "./FindUsers/config";

import { AppRouteContext } from "../AppRoute";

export const FindUserHandler = (props) => {
  const { eraceModal, showLoadingModal, showConfirmModal, showErrorModal } =
    useContext(AppRouteContext);
  const [selectedUserState, setSelectedUserState] = useState(null);
  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);

  const fetchAndRenewAllUserDocs = async () => {
    //モーダルを表示
    showLoadingModal();

    //すべてのユーザーデータを取得し、App.allUserDocsStateを変更
    const fetchResult = await getRelatedUserDocs(props.nowUserDoc);
    props.handleAllUserDocsState(fetchResult);

    //モーダルを消去
    eraceModal();

    return true;
  };

  /**
   * sendRequest
   */
  const handleSendRequest = () => {
    const senderUid = props.nowUserDoc.uid;
    const receiverUid = selectedUserState.uid;

    (async () => {
      showLoadingModal();
      try {
        await sendRequest(senderUid, receiverUid);
        setViewState(cmpConfig.state.view["001"]);
        showConfirmModal({
          content: {
            title: "友達申請を送信しました",
            text: [
              "申請状況は友達一覧から確認できます。",
              "申請が拒否された場合、友達一覧に表示されなくなります。",
            ],
          },
        });
      } catch (e) {
        console.log(e);
        showErrorModal({
          content: {
            title: "友達申請の送信に失敗しました。",
            text: [
              "このユーザーに友達申請を送ることはできません。",
              "アカウントが削除された可能性があります。",
            ],
          },
        });
      }
    })();
  };

  useEffect(() => {
    // viewStateが初期値に戻ったら、selectedUserStateを初期化
    if (viewState === cmpConfig.state.view["001"]) setSelectedUserState(null);
  }, [viewState]);

  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return (
          <ShowFoundUsersList
            allUserDocs={props.allUserDocs}
            nowUserDoc={props.nowUserDoc}
            handleSelectedUser={setSelectedUserState}
            handleViewState={setViewState}
            handleFetchAndRenewAllUserDocs={fetchAndRenewAllUserDocs}
          />
        );

      case cmpConfig.state.view["002"]:
        return (
          <ShowUserProfile
            nowUserDoc={props.nowUserDoc}
            targetUserDoc={selectedUserState}
            handleViewState={setViewState}
          />
        );

      case cmpConfig.state.view["003"]:
        return (
          <ShowRequestForm
            targetUserDoc={selectedUserState}
            handleRequest={handleSendRequest}
            handleViewState={setViewState}
          />
        );

      default:
        return undefined;
    }
  };

  return <ErrorBoundary>{handleView()}</ErrorBoundary>;
};
