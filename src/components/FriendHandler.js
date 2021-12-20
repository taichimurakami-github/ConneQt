import { Header } from "./UI/Header";
import { useState } from "react"

import { ShowFriendList } from "./Friend/ShowFriendList";
import { ShowChatRoom } from "./Friend/ShowChatRoom";

import cmpConfig from "./Friend/config";

export const FriendHandler = (props) => {

  const [viewState, setViewState] = useState(cmpConfig.state.view["001"]);

  const handleView = () => {
    switch (viewState) {
      case cmpConfig.state.view["001"]:
        return <ShowFriendList
          nowUserDoc={props.nowUserDoc}
          allUserDocs={props.allUserDocs}
        />;

      case cmpConfig.state.view["002"]:
        return <ShowChatRoom

        />;

      default:
        return undefined;
    }
  }

  return (
    <>
      <Header
        title="フレンドリスト"
        backable={false}
      />
      {handleView()}
    </>
  );
}