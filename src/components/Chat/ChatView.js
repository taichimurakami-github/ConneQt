import { useRef, useMemo, useEffect } from "react";
import { appConfig } from "../../app.config";
import { getDayOfJP } from "../../fn/app/getDayAsJP";
import { LSHandler } from "../../fn/app/handleLocalStorage";
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
    const nowDate = nowDateTimestamp.toDate();
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
      id > 0 ? parseChatData[id - 1].sentAt.toDate() : undefined;
    if (
      id === 0 ||
      nowDate.getMonth() > beforeDate.getMonth() ||
      nowDate.getDate() > beforeDate.getDate()
    ) {
      return [
        sentAt,
        <h4 className="date-container">
          {`${nowDate.getMonth() + 1}月${nowDate.getDate()}日(${getDayOfJP(
            nowDate.getDay()
          )})`}
        </h4>,
      ];
    } else {
      return [sentAt, undefined];
    }
  };

  //自動スクロール
  useEffect(() => {
    //既読処理
    LSHandler.save(appConfig.localStorage["001"].id, {
      [props.metaData.chatRoomID]: { checkedAt: Date.now() },
    });

    //まだ投稿がなければ、自動スクロールはいらないのでスルー
    if (props.chatRoomData.data.length > 0 && newestChatRef?.current) {
      console.log("aaa");
      newestChatRef.current.scrollIntoView();
    }
    //   else {
    // console.log(newestChatRef.current?.scrollHeight);
    // newestChatRef.current.scrollTop =
    //   newestChatRef.current?.scrollHeight || 0;
    //   }
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
      <InputChatText
        isActivated={props?.chatRoomData?.metaData ? true : false}
        handleOnSubmit={(e) => {
          props.handleSend(e);
        }}
      />
    </div>
  );
};
