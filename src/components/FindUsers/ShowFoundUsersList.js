import { useMemo, useState } from "react";
import { Header } from "../UI/Header";
import { UsersCard } from "../UI/UsersCard";
// import { UsersList } from "../UI/UsersList";
import cmpConfig from "./config";

export const ShowFoundUsersList = (props) => {
  /**
   * ２つのUserDoc.locationのデータから、
   * 両者の距離をkmで求める
   * @param {locationObject} loc1
   * @param {locationObject} loc2
   * @returns
   */
  const calcKmDistance = (location1, location2) => {
    const R = Math.PI / 180;

    const loc1 = { ...location1 };
    const loc2 = { ...location2 };

    loc1.lat = R * loc1.lat;
    loc1.lng = R * loc1.lng;
    loc2.lat = R * loc2.lat;
    loc2.lng = R * loc2.lng;

    return (
      6371 *
      Math.acos(
        Math.cos(loc1.lat) *
          Math.cos(loc2.lat) *
          Math.cos(loc2.lng - loc1.lng) +
          Math.sin(loc1.lat) * Math.sin(loc2.lat)
      )
    );
  };

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
  };

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
      props.nowUserDoc.request.received,
      props.nowUserDoc.request.sent,
      props.nowUserDoc.request.rejected,
      props.nowUserDoc.friend,
    ];

    for (const checkTargetParent of checkTargetParents) {
      if (checkTargetParent.length === 0) continue;

      let judgeResult;
      if (typeof checkTargetParent[0] !== "string") {
        //checkTargetParent内の要素がobjectだった場合：userDocObject >> uidを保持している
        judgeResult = isContainedInArray(
          targetUserDoc.uid,
          checkTargetParent.map((val) => val.uid)
        );
      } else {
        //checkTargetParent内の要素がstringだった場合：uid string array
        judgeResult = isContainedInArray(targetUserDoc.uid, checkTargetParent);
      }

      // request系、もしくはfriendの配列内にtargetUserDoc.uidが存在していた
      if (judgeResult) return false;
    }

    // 両者の距離を測定、一定距離以内であればtrueを返す
    const KM_BOUNDARY = 10;
    if (
      calcKmDistance(props.nowUserDoc.location, targetUserDoc.location) <
      KM_BOUNDARY
    ) {
      //一定距離以内にいる
      return true;
    } else {
      //一定距離にはいない
      return false;
    }
  };

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
  };

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

  const showableUserDocs = useMemo(generateShowableUserDocs, [
    props.nowUserDoc,
    props.allUserDocs,
  ]);

  return (
    <>
      <Header title="ユーザーを見つける" backable={false} />
      {showableUserDocs.length > 0 ? (
        <h2>近くに{showableUserDocs.length}人のユーザーがいます！</h2>
      ) : (
        <h2>近くにユーザーが見つかりませんでした。</h2>
      )}
      {/* <iframe src="https://maps.google.com/maps?output=embed&ll=${lat},${lng}&t=m&hl=ja&z=18https://www.google.co.jp/maps/@38.2664704,140.8663552&output=svembed,14z?api=1?hl=ja"></iframe> */}
      {/* <UsersList
        userDocs={showableUserDocs}
        handleOnClick={handleSelectUser}
        className={{ userList: "found-user" }}
      /> */}
      <UsersCard userDocs={showableUserDocs} handleOnClick={handleSelectUser} />
    </>
  );
};
