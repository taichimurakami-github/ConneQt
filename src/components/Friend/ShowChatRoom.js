import { useState, useReducer, useContext, useEffect } from "react";

import { updateChatRoomData } from "../../fn/db/updateHandler";
import {
  deleteExistingFriend,
  deleteWithdrawalFriend,
} from "../../fn/db/deleteHandler";

import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { AppRouteContext } from "../../AppRoute";

import "../../styles/ChatRoom.scss";
import { ChatView } from "../Chat/ChatView";
import { ChatMenu } from "../Chat/ChatMenu";
import { AppMenuContext } from "../../App";
import ErrorBoundary from "../ErrorBoundary";

export const ShowChatRoom = (props) => {
  const { showLoadingModal, eraceModal } = useContext(AppRouteContext);
  const { setAppMenuVisibleState } = useContext(AppMenuContext);
  setAppMenuVisibleState(false);

  const headerMetaDataReducerFunc = (state, action) => {
    switch (action.type) {
      case cmpConfig.ShowChatRoom.headerMetaDataAction["001"]:
        return {
          ...state,
          title: "チャットメニュー",
          handleBack: () => {
            setHeaderMenuViewState(false);
          },
          handleMenu: null,
        };

      case cmpConfig.ShowChatRoom.headerMetaDataAction["002"]:
        return {
          ...state,
          title: props.metaData.doc.with?.name || "退会したユーザー",
          handleBack: () => {
            props.handleViewState(cmpConfig.state.view["001"]);
          },
          handleMenu: () => {
            setHeaderMenuViewState(true);
          },
        };

      default:
        return { ...state };
    }
  };

  const [headerMenuViewState, setHeaderMenuViewState] = useState(false);
  const [headerMetaDataState, dispatchHeaderMetaData] = useReducer(
    headerMetaDataReducerFunc,
    {
      backable: true,
      title: props.metaData.doc.with?.name || "退会したユーザー",
      handleBack: () => {
        props.handleViewState(cmpConfig.state.view["001"]);
      },
      handleMenu: () => {
        setHeaderMenuViewState(true);
      },
    }
  );

  /**
   * 入力したチャットデータを送信する
   */
  const handleSend = (text) => {
    updateChatRoomData({
      chatRoomID: props.metaData.chatRoomID,
      uid: props.metaData.doc.me.uid,
      text: text,
      sentAt: null,
    });
  };

  /**
   * チャット画面の友人を消去
   * 相手がすでに抜けているか、自分から抜けていくかで処理を変える
   */
  const handleDeleteThisFriend = async () => {
    const chatRoomID = props.metaData.chatRoomID;
    const targetFriendUid = props.metaData.doc.with.uid;
    showLoadingModal();
    if (props.chatRoomData[chatRoomID]?.metaData) {
      //chatRoomData.metaDataが存在
      //相手が存在している -> chatRoom.metaDataと、
      //双方のfriendからrequest.rejected配列にuidを移行
      //ただし、相手のfriend配列内にはデータを残しておき、「退会したユーザー」扱いとする
      await deleteExistingFriend(
        chatRoomID,
        props.metaData.doc.me,
        props.metaData.doc.with
      );
      props.handleViewState(cmpConfig.state.view["001"]);
    } else {
      //相手が存在していない -> chatRoomと、自身のfriendから該当する項目を削除
      await deleteWithdrawalFriend(
        chatRoomID,
        props.metaData.doc.me,
        props.metaData.doc.with
      );
      props.handleViewState(cmpConfig.state.view["001"]);
    }

    //chatRoom, relatedUserDocsを更新しておく
    props.handleEraceChatRoom(chatRoomID, targetFriendUid);
    eraceModal();
  };

  useEffect(() => {
    headerMenuViewState
      ? dispatchHeaderMetaData({
          type: cmpConfig.ShowChatRoom.headerMetaDataAction["001"],
        })
      : dispatchHeaderMetaData({
          type: cmpConfig.ShowChatRoom.headerMetaDataAction["002"],
        });

    return () => {
      //ChatRoomからFreindListに戻ったらAppMenuを表示
      setAppMenuVisibleState(true);
    };
  }, [headerMenuViewState]);

  return (
    <>
      <Header
        backable={headerMetaDataState.backable}
        handleBack={headerMetaDataState.handleBack}
        title={headerMetaDataState.title}
        handleMenu={headerMetaDataState.handleMenu}
      />
      <ErrorBoundary>
        {headerMenuViewState ? (
          <ChatMenu
            metaData={props.metaData}
            chatRoomData={props.chatRoomData[props.metaData.chatRoomID]}
            handleDeleteThisFriend={handleDeleteThisFriend}
          />
        ) : (
          <ChatView
            metaData={props.metaData}
            chatRoomData={props.chatRoomData[props.metaData.chatRoomID]}
            handleSend={handleSend}
          />
        )}
      </ErrorBoundary>
    </>
  );
};
