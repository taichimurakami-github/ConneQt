import { useMemo, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { Header } from "../UI/Header";
import { UsersList } from "../UI/UsersList";
import cmpConfig from "./config";

export const ShowFoundUsersList = (props) => {

  /**
   * parentArr内に、targetValueが存在するかをチェック
   * 存在していたらtrue, 存在していなかったらfalse
   * 
   * @param {String | Int | Float } targetValue 
   * @param {[String | Int | Float]} parentArr 
   * @returns 
   */
  const isContainedInArray = (targetValue, parentArr) => {

    for (const valueOfParentArr of parentArr) {
      //if contained >> return true
      if (valueOfParentArr === targetValue) return true;
    }

    return false;
  }

  /**
   * 該当ユーザーに対し、リクエストを送れるかどうかを判定
   * + nowUserDocのrequest_sent内に、targetUserDocのuidが存在するかをチェック
   * + nowUserDocのrequest_received内に、targetUserDocのuidが存在するかをチェック
   * + nowUserDocのrequest_rejected内に、targetUserDocのuidが存在するかをチェック
   * + nowUserDocのfriend array内に、targetUserDocのuidが存在するかをチェック
   * 
   * 既にリクエストを...
   *  >> 送っている場合   : return true  
   *  >> 送っていない場合 : return false
   * 
   * @return {Boolean}
   */
  const isAbleToSendRequest = (targetUserDoc) => {
    const checkTargetParents = [
      props.nowUserDoc.request_received,
      props.nowUserDoc.request_sent,
      props.nowUserDoc.request_rejected,
      props.nowUserDoc.friend,
    ];

    for (const checkTargetParent of checkTargetParents) {

      if (checkTargetParent.length === 0) continue;

      // request系、もしくはfriendの配列内にtargetUserDoc.uidが存在していた
      if (isContainedInArray(targetUserDoc.uid, checkTargetParent)) {
        return false;
      }
    }

    return true;
  }

  /**
   * FindUsersListに表示できるユーザーをすべてのユーザーの中から取得
   * @returns {[]:UserDocsObj}
   */
  const generateShowableUserDocs = () => {

    // appState allUserDocs, nowUserDocが正しく取得されていない場合（初期状態など）は
    // 表示できるユーザーを0とする
    if (props.allUserDocs.length === 0 || !props.nowUserDoc) return [];

    const showableUserDocsArr = [];

    for (const userDoc of props.allUserDocs) {

      // 自分自身は表示しない
      if (userDoc.uid === props.nowUserDoc.uid) continue;

      // リクエストを送れる状態のユーザーのみ配列に追加
      isAbleToSendRequest(userDoc) && showableUserDocsArr.push(userDoc);
    }

    return showableUserDocsArr;
  }

  /**
   * 1. 該当ユーザーを検索し、selectedUserに登録する
   * 2. 表示コンテンツをUserProfileに変更する
   * @param {React.DOMAttributes<React.MouseEvent<HTMLLIElement | MouseEvent>>} e 
   */
  const handleSelectUser = (e) => {

    for (let user of props.allUserDocs) {
      if (user.uid === e.currentTarget.id) {
        props.handleSelectedUser(user);
        props.handleViewState(cmpConfig.state.view["002"]);
        break;
      }
    }

  };

  const showableUserDocs = useMemo(generateShowableUserDocs, [props.nowUserDoc, props.allUserDocs]);
  // const [showableUserDocs, setShowableUserDocs] = useState([]);

  useEffect(() => {

    // AllUserDocsが空だったらfetchを実行
    if (props.allUserDocs.length === 0) {
      console.log("allUserDocs is empty.");
      (async () => {
        await props.handleFetchAndRenewAllUserDocs();
      })();
    }


    // setState([...props.allUserDocs]);
  }, [props.allUserDocs]);

  return (
    <>
      <Header
        title="ユーザーを探す"
        backable={false}
      />
      <UsersList
        userDocs={showableUserDocs}
        handleOnClick={handleSelectUser}
      />
    </>
  )
}