import { useState, useEffect } from "react"

export const ShowFriendList = (props) => {

  const getFriend = () => {
    let result = [];
    if (props.nowUserDoc.friend.length === 0) return result;

    for (const userDoc of props.allUserDocs) {
      for (const friendUid of props.nowUserDoc.friend) {

        if (friendUid === userDoc.uid) {
          result.push(userDoc);
          break;
        }
        else continue;

      }

      // 取得したフレンドのDocsの数 === 登録してあるフレンドのuidの数
      //   >> 全取得完了、処理を処理を終了
      if (result.length === props.nowUserDoc.friend.length) break;
    }
    console.log(result);
    return result;
  }

  const [friendDocsState, setFriendDocsState] = useState([]);

  // AppState: userData, allUserDocsStateが変更された時にフレンドリストを更新
  useEffect(() => {
    setFriendDocsState(getFriend());
  }, [props.userDoc, props.allUserDocs]);

  return (
    <>
      <p>this is friendlist component.</p>
      <ul className="friend-list-wrapper">
        {
          friendDocsState.length !== 0 ?
            friendDocsState.map(val =>
              <li
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