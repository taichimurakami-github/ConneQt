import { useMemo, useState } from "react";
import { Header } from "../UI/Header";
import cmpConfig from "./config";

import "../../styles/chat.scss";

export const ShowChatRoom = (props) => {
  const chatData = useMemo(() => {
    const data = [...props.chatRoomData[props.metaData.chatRoomID].data];
    const orderedData = [];

    //逆順に並べ替える（chatRoomData.id.dataは新しい順にpushされていくので、mapで取り出す際は逆になる）
    for (let i = data.length - 1; i >= 0; i--) orderedData.push(data[i]);

    return orderedData;
  }, [props.chatRoomData]);

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
    </>
  );
};
