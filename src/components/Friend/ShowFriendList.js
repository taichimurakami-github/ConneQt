import { useState, useEffect } from "react"
import cmpConfig from "./config";
import { Header } from "../UI/Header";

export const ShowFriendList = (props) => {

  /**
   * firestore の users >> nowAppUser[target] のuid-arrayの中に一致するuidを持つ
   * allUserDocs内のオブジェクト（userDoc）を返す 
   * @param {string} target 
   * @returns 
   */
  const getSpecifiedUserDocsByUid = (target) => {
    let result = [];
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
    return result;

  }

  const getNumberFromStringID = (data, splitChar = "_") => {
    const splitArr = data.split(splitChar);
    return Number(splitArr.pop());
  }


  const handleShowProfileOnRequestSent = (e) => {

    // selectedUserDocStateを設定
    props.handleSelectedUserDoc(
      req_sentUserDocsState[getNumberFromStringID(e.target.id)]
    );

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["004"]);
  }


  const handleShowProfileOnRequestReceived = (e) => {

    // selectedUserDocStateを設定
    props.handleSelectedUserDoc(
      req_receivedUserDocsState[getNumberFromStringID(e.target.id)]
    );

    // showUserProfile画面を表示
    props.handleViewState(cmpConfig.state.view["003"]);
  }

  const [friendDocsState, setFriendDocsState] = useState([]);
  const [req_receivedUserDocsState, setReq_receivedUserDocsState] = useState([]);
  const [req_sentUserDocsState, setReq_sentUserDocsState] = useState([]);
  const [req_rejectedUserDocsState, setReq_rejectedUserDocsState] = useState([]);

  // AppState: userData, allUserDocsStateが変更された時にフレンドリストを更新
  useEffect(() => {
    setFriendDocsState(getSpecifiedUserDocsByUid("friend"));
    setReq_receivedUserDocsState(getSpecifiedUserDocsByUid("request_received"));
    setReq_sentUserDocsState(getSpecifiedUserDocsByUid("request_sent"));
    setReq_rejectedUserDocsState(getSpecifiedUserDocsByUid("request_rejected"));
  }, [props.nowUserDoc, props.allUserDocs]);

  return (
    <>
      <Header
        title="フレンドリスト"
        backable={false}
      />
      <p style={{ margin: "15px auto 10px", background: "green", color: "white" }}>あなたが受け取ったリクエスト一覧</p>
      <ul className="req-received-users-list-wrapper">
        {
          req_receivedUserDocsState.length !== 0 ?
            req_receivedUserDocsState.map((val, index) =>
              <li
                id={`user-req-received_${index}`}
                className="user-list"
              >
                <img className="user-icon" src={val.photo} />
                <div className="text-container">
                  <p className="name">{val.name}</p>
                  <p className="profile">{val.profile}</p>
                </div>
                <button
                  className="btn-orange"
                  onClick={handleShowProfileOnRequestReceived}
                >
                  プロフィールを見る
                </button>
              </li>)
            :
            <p>no request received.</p>
        }
      </ul>
      <p style={{ margin: "100px auto 10px", background: "darkorange", color: "white" }}>あなたが送ったリクエスト一覧</p>
      <ul className="req-sent-users-list-wrapper">
        {
          req_sentUserDocsState.length !== 0 ?
            req_sentUserDocsState.map((val, index) =>
              <li
                id={`user-req-sent_${index}`}
                className="user-list"
              >
                <img className="user-icon" src={val.photo} />
                <div className="text-container">
                  <p className="name">{val.name}</p>
                  <p className="profile">{val.profile}</p>
                </div>
                <button
                  className="btn-orange"
                  onClick={handleShowProfileOnRequestSent}
                >

                  プロフィールを見る
                </button>
              </li>)
            :
            <p>現在、承認待ちのリクエストはありません。</p>
        }
      </ul>
      <p style={{ margin: "100px auto 10px", background: "red", color: "white" }}>あなたが拒否された・拒否したリクエスト一覧</p>
      <ul className="req-sent-users-list-wrapper">
        {
          req_rejectedUserDocsState.length !== 0 ?
            req_rejectedUserDocsState.map((val, index) =>
              <li
                id={`user-req-sent_${index}`}
                className="user-list"
              >
                <img className="user-icon" src={val.photo} />
                <div className="text-container">
                  <p className="name">{val.name}</p>
                  <p className="profile">{val.profile}</p>
                </div>
                <button
                  className="btn-orange"
                  onClick={handleShowProfileOnRequestSent}
                >

                  プロフィールを見る
                </button>
              </li>)
            :
            <p>現在、拒否されたリクエストはありません。</p>
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
            <p>下部メニューの「見つける」から、<br></br>新しい友達を探しましょう！</p>
        }
      </ul>
    </>
  )
}