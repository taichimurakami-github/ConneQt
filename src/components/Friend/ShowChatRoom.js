import { useMemo, useState } from "react";
import { Header } from "../UI/Header";
import cmpConfig from "./config";

import "../../styles/chat.scss";
import { updateChatRoomData } from "../../fn/db/firestore.handler";

export const ShowChatRoom = (props) => {
  /**
   * チャットデータ内容をコンポーネント上に出力できる形に整形
   */
  const chatData = useMemo(() => {
    const data = [...props.chatRoomData[props.metaData.chatRoomID].data];
    const orderedData = [];

    //逆順に並べ替える（chatRoomData.id.dataは新しい順にpushされていくので、mapで取り出す際は逆になる）
    for (let i = data.length - 1; i >= 0; i--) orderedData.push(data[i]);

    return data;
  }, [props.chatRoomData]);

  /**
   * 入力したチャットデータを送信する
   */
  const handleOnSend = (text) => {
    updateChatRoomData({
      chatRoomID: props.metaData.chatRoomID,
      uid: props.metaData.doc.me.uid,
      text: text,
      sentAt: null,
    });
  };

  return (
    <>
      <Header
        backable={true}
        handleBack={() => {
          props.handleViewState(cmpConfig.state.view["001"]);
        }}
        title={`${props.metaData.doc.with.name}`}
      />
      <ul>
        {chatData.map((val) => {
          return (
            <>
              <div
                className={`chat-list-view-container ${
                  val.uid === props.metaData.doc.me.uid ? "right" : "left"
                }`}
              >
                <img
                  className="user-icon"
                  src={
                    val.uid === props.metaData.doc.me.uid
                      ? props.metaData.doc.me.photo
                      : props.metaData.doc.with.photo
                  }
                ></img>
                <p className="text-container">{val.text}</p>
              </div>
            </>
          );
        })}
      </ul>
      <InputChatText handleOnSubmit={handleOnSend} />
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
