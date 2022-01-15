import { useRef, useMemo, useEffect } from "react";
import { InputChatText } from "./ChatInput";
import { ChatListContent } from "./ChatList";

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
    return [...props.chatRoomData.data];
  }, [props.chatRoomData]);

  /**
   * 渡されたuidが自分のものかどうか判定
   * @param {String} uid
   * @returns
   */
  const isAuthUser = (uid) => uid === props.metaData.doc.me.uid;

  const getPostDate = (nowDateTimestamp, id) => {
    //sentAt時刻を取得
    const nowDate = new Date(nowDateTimestamp.toDate());
    const nowHours = String(nowDate.getHours());
    const nowMinutes =
      nowDate.getMinutes() < 10
        ? `0${nowDate.getMinutes()}`
        : `${nowDate.getMinutes()}`;
    const sentAt = `${nowHours}:${nowMinutes}`;

    //前の投稿と日付が変わったかチェック
    //前の投稿より日付または月が進んでいたら日またぎと判定
    //現在の投稿の日付を返す
    const beforeDate =
      id > 0 ? new Date(parseChatData[id - 1].sentAt.toDate()) : undefined;
    if (
      id === 0 ||
      nowDate.getMonth() > beforeDate.getMonth() ||
      nowDate.getDate() > beforeDate.getDate()
    ) {
      return [
        sentAt,
        <h4 className="date-container">
          {`${nowDate.getMonth() + 1}月${nowDate.getDate()}日`}
        </h4>,
      ];
    } else {
      return [sentAt, undefined];
    }
  };

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
          const [sentAt, dateComponent] = getPostDate(val.sentAt, id);

          return id === parseChatData.length - 1 ? (
            <>
              {dateComponent}
              <li
                className={`chat-list-view-container ${
                  isAuthUser(val.uid) ? "right" : "left"
                }`}
                ref={newestChatRef}
                key={`chatlist-${id}`}
              >
                <ChatListContent
                  val={val}
                  isAuthUser={isAuthUser(val.uid)}
                  doc={userDoc}
                  sentAt={sentAt}
                />
              </li>
            </>
          ) : (
            <>
              {dateComponent}
              <li
                className={`chat-list-view-container ${
                  isAuthUser(val.uid) ? "right" : "left"
                }`}
                key={`chatlist-${id}`}
              >
                <ChatListContent
                  val={val}
                  isAuthUser={isAuthUser(val.uid)}
                  doc={userDoc}
                  sentAt={sentAt}
                />
              </li>
            </>
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
