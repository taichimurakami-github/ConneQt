import { Header } from "./UI/Header";
import { useEffect, useState } from "react"

import { ShowFriendList } from "./Friend/ShowFriendList";
import { ShowChatRoom } from "./Friend/ShowChatRoom";

import cmpConfig from "./Friend/config";
import { ShowUserProfileOnRequestReceived } from "./Friend/ShowUserProfileOnRequestReceived";
import { ShowUserProfileOnRequestSent } from "./Friend/ShowUserProfileOnRequestSent";

export const FriendHandler = (props) => {

  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);
  const [selectedUserDocState, setSelectedUserDocState] = useState(null);

  // フレンドリスト画面に戻ってきたらselectedUserDocStateを初期化
  useEffect(() => {
    viewState === cmpConfig.state.view["001"] && setSelectedUserDocState(null);
  }, [viewState])

  const handleRejectRequest = (targetUserDoc) => {

  }

  const handleApproveRequest = (targetUserDoc) => {

  }

  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return <ShowFriendList
          nowUserDoc={props.nowUserDoc}
          allUserDocs={props.allUserDocs}
          handleSelectedUserDoc={setSelectedUserDocState}
          handleViewState={setViewState}
        />;

      case cmpConfig.state.view["002"]:
        return <ShowChatRoom
          handleViewState={setViewState}
        />;

      case cmpConfig.state.view["003"]:
        return <ShowUserProfileOnRequestReceived
          targetUserDoc={selectedUserDocState}
          handleViewState={setViewState}
          handleRejectRequest={handleRejectRequest}
          handleApproveRequest={handleApproveRequest}
        />;

      case cmpConfig.state.view["004"]:
        return <ShowUserProfileOnRequestSent
          targetUserDoc={selectedUserDocState}
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
  );
}