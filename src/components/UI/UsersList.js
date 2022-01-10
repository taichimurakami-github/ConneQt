import { cutStrLength } from "../../fn/util/cutStrLength";
import "../../styles/UI/UsersList.scss";

export const UsersList = (props) => {
  //退会済みユーザーを削除
  const userDocs = [];
  for (const userDoc of props.userDocs) {
    userDoc && userDocs.push(userDoc);
  }

  return (
    <ul
      className={`users-list-wrapper ${
        props?.className?.wrapper ? props.className.wrapper : ""
      }`}
    >
      {userDocs && userDocs.length !== 0 ? (
        userDocs.map((val) => {
          if (!val) return undefined;

          return (
            <li
              id={val.uid}
              className={`user-list ${
                props?.className?.userList ? props.className.userList : ""
              } ${props?.handleClick ? "clickable" : ""}`}
              onClick={props?.handleClick}
              key={val.uid}
            >
              <img
                className="user-icon p-events-none"
                src={val?.photo}
                alt={val?.name + "さんのプロフィール画像"}
              />
              <div className="text-container p-events-none">
                <p className="name p-events-none">{val?.name}</p>
                <p className="profile p-events-none">
                  {cutStrLength(val?.profile, 15, "...")}
                </p>
              </div>

              {props.children}
            </li>
          );
        })
      ) : (
        <p>
          {props?.noUserMessage
            ? props.noUserMessage
            : "該当するユーザーが見つかりませんでした。"}
        </p>
      )}
    </ul>
  );
};
