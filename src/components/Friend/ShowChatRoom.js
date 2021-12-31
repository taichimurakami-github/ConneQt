import { useMemo, useState, useReducer, useContext, useEffect } from "react";

import { updateChatRoomData } from "../../fn/db/updateHandler";
import {
  deleteExistingFriend,
  deleteWithdrawalFriend,
} from "../../fn/db/deleteHandler";

import cmpConfig from "./config";
import { Header } from "../UI/Header";
import { UserProfile } from "../UI/UserProfile";
import { AppRouteContext } from "../../AppRoute";

import "../../styles/chat.scss";

export const ShowChatRoom = (props) => {
  const { showLoadingModal, eraceModal } = useContext(AppRouteContext);

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
    if (props.chatRoomData[props.metaData.chatRoomID]) {
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
  }, [headerMenuViewState]);

  return (
    <>
      <Header
        backable={headerMetaDataState.backable}
        handleBack={headerMetaDataState.handleBack}
        title={headerMetaDataState.title}
        handleMenu={headerMetaDataState.handleMenu}
      />
      {headerMenuViewState ? (
        <HeaderMenuComponent
          metaData={props.metaData}
          chatRoomData={props.chatRoomData[props.metaData.chatRoomID]}
          handleDeleteThisFriend={handleDeleteThisFriend}
        />
      ) : (
        <ChatViewComponent
          metaData={props.metaData}
          chatRoomData={props.chatRoomData[props.metaData.chatRoomID]}
          handleSend={handleSend}
        />
      )}
    </>
  );
};

/**
 * チャット画面のコンポーネント
 * @returns {React.ReactElement}
 */
const ChatViewComponent = (props) => {
  /**
   * チャットデータ内容をコンポーネント上に出力できる形に整形
   */
  const parseChatData = useMemo(() => {
    const data = [...props.chatRoomData.data];
    const orderedData = [];

    //逆順に並べ替える（chatRoomData.id.dataは新しい順にpushされていくので、mapで取り出す際は逆になる）
    for (let i = data.length - 1; i >= 0; i--) orderedData.push(data[i]);

    return data;
  }, [props.chatRoomData]);

  return (
    <>
      <ul>
        {parseChatData.map((val) => {
          return (
            <>
              <div
                className={`chat-list-view-container ${
                  val.uid === props.metaData.doc.me.uid ? "right" : "left"
                }`}
              >
                {val.uid === props.metaData.doc.with.uid && (
                  <img
                    className="user-icon"
                    src={props.metaData.doc.with?.photo || ""}
                    alt={
                      props.userDoc?.name
                        ? props.userDoc.name + "さんのプロフィール画像"
                        : ""
                    }
                  ></img>
                )}

                <p className="text-container">{val.text}</p>
              </div>
            </>
          );
        })}
      </ul>
      {props.chatRoomData?.metaData && (
        <InputChatText handleOnSubmit={props.handleSend} />
      )}
    </>
  );
};

const HeaderMenuComponent = (props) => {
  return (
    <>
      {props.chatRoomData.metaData ? (
        <h2 className="chatroom-menu-title">
          {props.metaData.doc.with.name}さんのプロフィール
        </h2>
      ) : (
        <h2 className="chatroom-menu-title">このユーザーは退会しました</h2>
      )}
      <UserProfile
        userDoc={
          props.chatRoomData?.metaData
            ? props.metaData.doc.with
            : {
                uid: props.metaData.doc.with.uid,
              }
        }
      />
      {
        //友達削除ボタン：chatRoomDataにmetaDataが存在している場合=相手が存在している場合のみ表示
        <button className="btn-orange" onClick={props.handleDeleteThisFriend}>
          この友達を削除する
        </button>
      }
    </>
  );
};

const InputChatText = (props) => {
  const [inputState, setInputState] = useState("");

  const handleTextInput = (e) => {
    setInputState(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    props.handleOnSubmit(inputState);
  };

  return (
    <>
      <form className="chat-input-wrapper" onSubmit={handleOnSubmit}>
        <textarea
          className="input-text-area"
          value={inputState}
          onChange={handleTextInput}
        ></textarea>
        <button type="submit" className="btn-orange">
          送信
        </button>
      </form>
    </>
  );
};
