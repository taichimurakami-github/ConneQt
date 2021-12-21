import { useEffect, useState } from "react";
import { appConfig } from "../app.config";

import "../styles/usersList.scss";

//import components
import { ShowUsersList } from "./FindUsers/ShowUsersList";
import { ShowUserProfile } from "./FindUsers/ShowUserProfile";
import { ShowRequestForm } from "./FindUsers/ShowRequestForm";

//import firebase fn
import { getAllUserDocs, registerRequest } from "../fn/db/firestore.handler";


//import config
import cmpConfig from "./FindUsers/config";



export const FindUserHandler = (props) => {

  const [selectedUserState, setSelectedUserState] = useState(null);
  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);

  const fetchAndRenewAllUserDocs = async () => {
    console.log("handle fetch");

    //モーダルを表示
    props.handleModalState({
      display: true,
      closable: false,
      type: appConfig.components.modal.type["001"]
    });

    //すべてのユーザーデータを取得し、App.allUserDocsStateを変更
    const fetchResult = await getAllUserDocs();
    props.handleAllUserDocsState(fetchResult);

    //モーダルを消去
    props.handleModalState({ display: false });

    return true;
  }



  /**
   * sendRequest
   */
  const sendRequest = () => {


    // 送信元の新たなユーザーデータを作成
    // request_sentに受信者のユーザーデータを追加
    const senderData = {
      ...props.user, //送信者のデータをコピー
      request_sent: [
        ...props.user.request_sent, //送信者のrequest_sentデータをコピー
        selectedUserState.uid //送信者のrequest_sentに、受信者のuidを追加
      ]
    };

    // 受信者の新たなユーザーデータを作成
    // request_receivedに送信者のユーザーデータを追加
    const receiverData = {
      ...selectedUserState,
      request_received: [
        ...selectedUserState.request_received,
        props.user.uid
      ]
    };

    // console.log(senderData);
    // console.log(receiverData);

    (async () => {
      await registerRequest(senderData, receiverData);
      setViewState(cmpConfig.state.view["001"]);
    })();
  }


  useEffect(() => {
    // viewStateが初期値に戻ったら、selectedUserStateを初期化
    if (viewState === cmpConfig.state.view["001"]) setSelectedUserState(null);
  }, [viewState]);


  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return <ShowUsersList
          allUserDocs={props.allUserDocs}
          nowUserDoc={props.user}
          handleSelectedUser={setSelectedUserState}
          handleViewState={setViewState}
          handleFetchAndRenewAllUserDocs={fetchAndRenewAllUserDocs}
        />;

      case cmpConfig.state.view["002"]:
        return <ShowUserProfile
          nowUserDoc={props.user}
          targetUserDoc={selectedUserState}
          handleViewState={setViewState}
        />;

      case cmpConfig.state.view["003"]:
        return <ShowRequestForm
          targetUserDoc={selectedUserState}
          handleRequest={sendRequest}
          handleViewState={setViewState}
        />;


      default:
        return undefined;
    }
  }

  return (
    <>
      {handleView()}
    </>
  )
}