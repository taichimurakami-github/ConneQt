import { useState, useEffect } from "react"

export const ShowFriendList = (props) => {

  const getSpecifiedUserDocsByUid = (target) => {
    let result = [];
    console.log(props.nowUserDoc[target]);
    if (props.nowUserDoc[target].length === 0) return result;

    for (const userDoc of props.allUserDocs) {
      for (const targetUid of props.nowUserDoc[target]) {

        if (targetUid === userDoc.uid) {
          result.push(userDoc);
          break;
        }
        else continue;

      }

      // 取得したフレンドのDocsの数 === 登録してあるフレンドのuidの数
      //   >> 全取得完了、処理を処理を終了
      if (result.length === props.nowUserDoc[target].length) break;
    }
    console.log(result);
    return result;

  }

  const getReceivedRequest = () => {
  }

  const [friendDocsState, setFriendDocsState] = useState([]);
  const [req_receivedUserDocsState, setReq_receivedUserDocsState] = useState([]);
  const [req_sentUserDocsState, setReq_sentUserDocsState] = useState([]);

  // AppState: userData, allUserDocsStateが変更された時にフレンドリストを更新
  useEffect(() => {
    console.log("props changed")
    setFriendDocsState(getSpecifiedUserDocsByUid("friend"));
    setReq_receivedUserDocsState(getSpecifiedUserDocsByUid("request_received"));
    setReq_sentUserDocsState(getSpecifiedUserDocsByUid("request_sent"));
  }, [props.nowUserDoc, props.allUserDocs]);

  return (
    <>
      <p style={{ margin: "15px auto 10px", background: "black", color: "white" }}>あなたが受け取ったリクエスト一覧</p>
      <ul className="req-received-users-list-wrapper">
        {
          req_receivedUserDocsState.length !== 0 ?
            req_receivedUserDocsState.map(val =>
              <li

                className="user-list"
              >
                <img className="user-icon" src={val.photo} />
                <div className="text-container">
                  <p className="name">{val.name}</p>
                  <p className="profile">{val.profile}</p>
                </div>
              </li>)
            :
            <p>no request received.</p>
        }
      </ul>
      <p style={{ margin: "100px auto 10px", background: "black", color: "white" }}>あなたが送ったリクエスト一覧</p>
      <ul className="req-sent-users-list-wrapper">
        {
          req_sentUserDocsState.length !== 0 ?
            req_sentUserDocsState.map(val =>
              <li

                className="user-list"
              >
                <img className="user-icon" src={val.photo} />
                <div className="text-container">
                  <p className="name">{val.name}</p>
                  <p className="profile">{val.profile}</p>
                </div>
              </li>)
            :
            <p>no sent request now.</p>
        }
      </ul>
      <p style={{ margin: "100px auto 10px", background: "black", color: "white" }}>あなたのフレンド一覧</p>
      <ul className="friend-users-list-wrapper">
        {
          friendDocsState.length !== 0 ?
            friendDocsState.map(val =>
              <li

                className="user-list"
              >
                <img className="user-icon" src={val.photo} />
                <div className="text-container">
                  <p className="name">{val.name}</p>
                  <p className="profile">{val.profile}</p>
                </div>
              </li>)
            :
            <p>no friends.</p>
        }
      </ul>
    </>
  )
}