import { useRef, useMemo, useEffect } from "react";
import { InputChatText } from "./ChatInput";
import { ChatList, ChatListContent } from "./ChatList";

/**
 * チャット画面のコンポーネント
 * @returns {React.ReactElement}
 */
export const ChatView = (props) => {
  const newestChatRef = useRef(null);

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

  /**
   * 渡されたuidが自分のものかどうか判定
   * @param {String} uid
   * @returns
   */
  const isAuthUser = (uid) => uid === props.metaData.doc.me.uid;

  //自動スクロール
  useEffect(() => {
    if (newestChatRef?.current) newestChatRef.current.scrollIntoView();
    else newestChatRef.current.scrollTop = newestChatRef.current.scrollHeight;
  }, [newestChatRef.current]);

  return (
    <div className="chat-view-component">
      <ul className="chat-content-container">
        {parseChatData.map((val, id) => {
          const userDoc = isAuthUser(val.uid)
            ? props.metaData.doc.me
            : props.metaData.doc.with;

          return id === parseChatData.length - 1 ? (
            <div
              className={`chat-list-view-container ${
                isAuthUser(val.uid) ? "right" : "left"
              }`}
              ref={newestChatRef}
            >
              <ChatListContent
                val={val}
                isAuthUser={isAuthUser(val.uid)}
                doc={userDoc}
              />
            </div>
          ) : (
            <div
              className={`chat-list-view-container ${
                isAuthUser(val.uid) ? "right" : "left"
              }`}
            >
              <ChatListContent
                val={val}
                isAuthUser={isAuthUser(val.uid)}
                doc={userDoc}
              />
            </div>
          );
        })}
      </ul>

      {props.chatRoomData?.metaData && (
        <InputChatText
          handleOnSubmit={(e) => {
            props.handleSend(e);
          }}
        />
      )}
    </div>
  );
};
