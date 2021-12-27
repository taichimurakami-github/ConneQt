import { useEffect, useState, useContext } from "react";

import { ShowFriendList } from "./Friend/ShowFriendList";
import { ShowChatRoom } from "./Friend/ShowChatRoom";

import cmpConfig from "./Friend/config";
import { ShowUserProfileOnRequestReceived } from "./Friend/ShowUserProfileOnRequestReceived";
import { ShowUserProfileOnRequestSent } from "./Friend/ShowUserProfileOnRequestSent";
import { approveRequest, rejectRequest } from "../fn/db/requestHandler";

import { AppRouteContext } from "../AppRoute";

export const FriendHandler = (props) => {
  const { modalState, setModalState, eraceModal } = useContext(AppRouteContext);
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

    (async () => {
      await rejectRequest(rejectingUserUid, rejectedUserUid);
      setViewState(cmpConfig.state.view["001"]);
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

    (async () => {
      await approveRequest(approvingUserUid, approvedUserUid);

      setViewState(cmpConfig.state.view["001"]);
    })();
  };

  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return (
          <ShowFriendList
            nowUserDoc={props.nowUserDoc}
            allUserDocs={props.allUserDocs}
            handleSelectedUserDoc={setSelectedUserDocState}
            handleViewState={setViewState}
            handleTargetChatRoomData={setSelectedChatRoomDataState}
            chatRoomData={props.chatRoomData}
          />
        );

      case cmpConfig.state.view["002"]:
        return (
          <ShowChatRoom
            handleViewState={setViewState}
            chatRoomData={props.chatRoomData}
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
