import { useEffect, useState, useContext } from "react";

import { ShowFriendList } from "./Friend/ShowFriendList";
import { ShowChatRoom } from "./Friend/ShowChatRoom";

import cmpConfig from "./Friend/config";
import { ShowUserProfileOnRequestReceived } from "./Friend/ShowUserProfileOnRequestReceived";
import { ShowUserProfileOnRequestSent } from "./Friend/ShowUserProfileOnRequestSent";
import { approveRequest, rejectRequest } from "../fn/db/requestHandler";

import { AppRouteContext } from "../AppRoute";
import { updateUserDocObjectData } from "../fn/db/updateHandler";

export const FriendHandler = (props) => {
  const { showLoadingModal, showConfirmModal, showErrorModal, eraceModal } =
    useContext(AppRouteContext);
  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);
  const [selectedUserDocState, setSelectedUserDocState] = useState(null);
  const [selectedChatRoomDataState, setSelectedChatRoomDataState] =
    useState(null);

  // フレンドリスト画面に戻ってきたらselectedUserDocStateを初期化
  useEffect(() => {
    if (viewState === cmpConfig.state.view["001"]) {
      setSelectedUserDocState(null);
      setSelectedChatRoomDataState(null);
    }
  }, [viewState]);

  /**
   * リクエスト拒否を処理する
   */
  const handleRejectRequest = () => {
    if (selectedUserDocState === null)
      throw new Error(
        "handleRejectRequest Error: リクエストをハンドルする対象ユーザーのデータがありません。"
      );

    // リクエスト拒否操作を行う側のユーザーデータ
    const rejectingUserUid = props.nowUserDoc.uid;

    // リクエスト拒否をされる側のユーザーデータ
    const rejectedUserUid = selectedUserDocState.uid;
    const rejectedUserName = selectedUserDocState.name;

    (async () => {
      showLoadingModal();
      try {
        await rejectRequest(rejectingUserUid, rejectedUserUid);
        setViewState(cmpConfig.state.view["001"]);
        showConfirmModal({
          content: {
            title: rejectedUserName + " さんの友達リクエストを拒否しました。",
          },
        });
      } catch (e) {
        //リクエスト受諾失敗
        console.log(e);

        showErrorModal({
          content: {
            title: "エラーが発生しました。",
            text: [
              "相手がアカウントを消去したか、",
              "通信エラーが発生した可能性があります。",
            ],
          },
        });
      }
    })();
  };

  /**
   * リクエスト許可を処理する
   */
  const handleApproveRequest = async () => {
    if (selectedUserDocState === null)
      throw new Error(
        "handleRejectRequest Error: リクエストをハンドルする対象ユーザーのデータがありません。"
      );

    const approvingUserUid = props.nowUserDoc.uid;
    const approvedUserUid = selectedUserDocState.uid;
    const approvedUserName = selectedUserDocState.name;

    (async () => {
      showLoadingModal();
      try {
        await approveRequest(approvingUserUid, approvedUserUid);
        setViewState(cmpConfig.state.view["001"]);
        showConfirmModal({
          content: {
            title: approvedUserName + " さんと友達になりました。",
          },
        });
      } catch (e) {
        console.log(e);

        //もし自分の友達リスト内に相手のuidがあったら削除
        if (Object.keys(props.nowUserDoc.friend).includes(approvedUserUid)) {
          updateUserDocObjectData(
            "deleteField",
            approvingUserUid,
            "friend" + approvedUserUid
          );
        }

        showErrorModal({
          closable: false,
          content: {
            title: "エラーが発生しました。",
            text: [
              "相手がアカウントを消去したか、",
              "通信エラーが発生した可能性があります。",
            ],
          },
          children: (
            <button
              className="btn-gray"
              onClick={() => {
                setViewState(cmpConfig.state.view["001"]);
                eraceModal();
              }}
            >
              前のページに戻る
            </button>
          ),
        });
      }
    })();
  };

  /**
   * 該当するチャットルームを削除する
   * relatedUserDocsから、該当ユーザーのuserDocも削除する
   */
  const handleEraceChatRoom = (friendUid, chatRoomID) => {
    //chatRoomDataから該当するchatRooomを消去
    const newChatRoomData = { ...props.chatRoomData };
    delete newChatRoomData[chatRoomID];
    props.handleChatRoom(newChatRoomData);

    //relatedUserDocsから該当するuserDocsを削除
    const newRelatedUserDocsState = { ...props.allUserDocs };
    delete newRelatedUserDocsState[friendUid];
    props.handleRelatedUserDocs(newRelatedUserDocsState);
  };

  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return (
          <ShowFriendList
            nowUserDoc={props.nowUserDoc}
            relatedUserDocs={props.allUserDocs}
            handleSelectedUserDoc={setSelectedUserDocState}
            handleViewState={setViewState}
            handlePageContent={props.handlePageContent}
            handleTargetChatRoomData={setSelectedChatRoomDataState}
            chatRoomData={props.chatRoomData}
          />
        );

      case cmpConfig.state.view["002"]:
        return (
          <ShowChatRoom
            handleViewState={setViewState}
            chatRoomData={props.chatRoomData}
            handleEraceChatRoom={handleEraceChatRoom}
            metaData={selectedChatRoomDataState}
          />
        );

      case cmpConfig.state.view["003"]:
        return (
          <ShowUserProfileOnRequestReceived
            targetUserDoc={selectedUserDocState}
            handleViewState={setViewState}
            handleRejectRequest={handleRejectRequest}
            handleApproveRequest={handleApproveRequest}
          />
        );

      case cmpConfig.state.view["004"]:
        return (
          <ShowUserProfileOnRequestSent
            targetUserDoc={selectedUserDocState}
            handleViewState={setViewState}
          />
        );

      default:
        return undefined;
    }
  };

  return <>{handleView()}</>;
};
