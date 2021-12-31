import { useContext, useMemo } from "react";

import { Header } from "../UI/Header";
import { UsersCard } from "../UI/UsersCard";

import { AppRouteContext } from "../../AppRoute";
import cmpConfig from "./config";

export const ShowFoundUsersList = (props) => {
  const { authUserDoc } = useContext(AppRouteContext);

  /**
   * ２つのUserDoc.locationのデータから、
   * 両者の距離が指定距離以内かを判定
   * @param {locationObject} loc1
   * @param {locationObject} loc2
   * @returns
   */
  const areUserNearby = (targetUserDoc) => {
    const KM_BOUNDARY = 10;
    const R = Math.PI / 180;

    const loc1 = { ...props.nowUserDoc.location };
    const loc2 = { ...targetUserDoc.location };

    loc1.lat = R * loc1.lat;
    loc1.lng = R * loc1.lng;
    loc2.lat = R * loc2.lat;
    loc2.lng = R * loc2.lng;

    const distance =
      6371 *
      Math.acos(
        Math.cos(loc1.lat) *
          Math.cos(loc2.lat) *
          Math.cos(loc2.lng - loc1.lng) +
          Math.sin(loc1.lat) * Math.sin(loc2.lat)
      );

    return distance < KM_BOUNDARY;
  };

  /**
   * 1. 該当ユーザーを検索し、selectedUserに登録する
   * 2. 表示コンテンツをUserProfileに変更する
   * @param {React.DOMAttributes<React.MouseEvent<HTMLLIElement | MouseEvent>>} e
   */
  const handleSelectUser = (e) => {
    props.handleSelectedUser(props.allUserDocs[e.target.id]);
    props.handleViewState(cmpConfig.state.view["002"]);
  };

  const generateShowableUserDocs = () => {
    const shoableUserDocsArr = [];
    const unAbleToShowUserUidArr = [
      ...Object.keys(props.nowUserDoc.friend),
      ...props.nowUserDoc.request.received,
      ...props.nowUserDoc.request.sent,
      ...props.nowUserDoc.request.rejected,
    ];

    for (const user of Object.values(props.allUserDocs)) {
      //undefinedユーザー（退会済みのユーザー）ではないユーザーのみ処理
      if (!user) continue;

      //friend, requestに記録されているユーザーではなく、かつ近くにいる場合のみshowableUserDocsに保存
      !unAbleToShowUserUidArr.includes(user.uid) &&
        areUserNearby(user) &&
        shoableUserDocsArr.push(user);
    }

    return shoableUserDocsArr;
  };

  const showableUserDocs = useMemo(generateShowableUserDocs, [
    authUserDoc,
    props.allUserDocs,
  ]);

  return (
    <>
      <Header title="友達を見つける" backable={false} />
      {showableUserDocs.length > 0 && (
        <h2
          style={{
            margin: "35px auto 15px",
          }}
        >
          近くに{showableUserDocs.length}人の友達候補がいます！
        </h2>
      )}
      <UsersCard
        userDocs={showableUserDocs}
        handleClick={handleSelectUser}
        noUserMessage="近くにユーザーが見つかりませんでした。"
      />
    </>
  );
};

// /**
//  * parentArr内に、targetValueが存在するかをチェック
//  * 存在していたらtrue, 存在していなかったらfalse
//  *  -> Array.prototype.include()ってのがあった…無駄骨でした
//  *
//  * @param {String | Int | Float } targetValue
//  * @param {[String | Int | Float]} parentArr
//  * @returns
//  */
// const isContainedInArray = (targetValue, parentArr) => {
//   for (const valueOfParentArr of parentArr) {
//     //if contained >> return true
//     if (valueOfParentArr === targetValue) return true;
//   }

//   return false;
// };

// /**
//  * 該当ユーザーに対し、リクエストを送れるかどうかを判定
//  * + nowUserDocのrequest_sent内に、targetUserDocのuidが存在するかをチェック
//  * + nowUserDocのrequest_received内に、targetUserDocのuidが存在するかをチェック
//  * + nowUserDocのrequest_rejected内に、targetUserDocのuidが存在するかをチェック
//  * + nowUserDocのfriend array内に、targetUserDocのuidが存在するかをチェック
//  *
//  * 既にリクエストを...
//  *  >> 送っている場合   : return true
//  *  >> 送っていない場合 : return false
//  *
//  * @return {Boolean}
//  */
// const isAbleToSendRequest = (targetUserDoc) => {
//   const checkTargetParents = [
//     props.nowUserDoc.request.received,
//     props.nowUserDoc.request.sent,
//     props.nowUserDoc.request.rejected,
//     props.nowUserDoc.friend,
//   ];

//   for (const checkTargetParent of checkTargetParents) {
//     if (checkTargetParent.length === 0) continue;

//     let judgeResult;
//     if (typeof checkTargetParent[0] !== "string") {
//       //checkTargetParent内の要素がobjectだった場合：userDocObject >> uidを保持している
//       judgeResult = isContainedInArray(
//         targetUserDoc.uid,
//         checkTargetParent.map((val) => val.uid)
//       );
//     } else {
//       //checkTargetParent内の要素がstringだった場合：uid string array
//       judgeResult = isContainedInArray(targetUserDoc.uid, checkTargetParent);
//     }

//     // request系、もしくはfriendの配列内にtargetUserDoc.uidが存在していた
//     if (judgeResult) return false;
//   }
// };

// /**
//  * FindUsersListに表示できるユーザーをすべてのユーザーの中から取得
//  * @returns {[]:UserDocsObj}
//  */
// const generateShowableUserDocs = () => {
//   // appState allUserDocs, nowUserDocが正しく取得されていない場合（初期状態など）は
//   // 表示できるユーザーを0とする
//   if (props.allUserDocs.length === 0 || !props.nowUserDoc) return [];

//   const showableUserDocsArr = [];

//   for (const userDoc of props.allUserDocs) {
//     // 自分自身は表示しない
//     if (userDoc.uid === props.nowUserDoc.uid) continue;

//     // リクエストを送れる状態のユーザーのみ配列に追加
//     isAbleToSendRequest(userDoc) && showableUserDocsArr.push(userDoc);
//   }

//   return showableUserDocsArr;
// };
