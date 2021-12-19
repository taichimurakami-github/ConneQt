import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { Header } from "../UI/Header";
import cmpConfig from "./config";

export const ShowUsersList = (props) => {

  // const [state, setState] = useState([...props.allUserDocs]);

  /**
   * 1. 該当ユーザーを検索し、selectedUserに登録する
   * 2. 表示コンテンツをUserProfileに変更する
   * @param {React.DOMAttributes<React.MouseEvent<HTMLLIElement | MouseEvent>>} e 
   */
  const handleSelectUser = (e) => {

    for (let user of props.allUserDocs) {
      if (user.uid === e.target.id) {
        props.handleSelectedUser(user);
        props.handleViewState(cmpConfig.state.view["002"]);
        break;
      }
    }

  };

  useEffect(() => {
    console.log("showUsersList.js initial useEffect()");

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
      <ul className="users-list-wrapper">
        {
          props.allUserDocs.length !== 0
            ? props.allUserDocs.map((val) => {

              if (val.uid === props.nowUserDoc.uid) return undefined;

              return (
                <li
                  id={val.uid}
                  className="user-list clickable"
                  onClick={handleSelectUser}
                  key={val.uid}
                >
                  <img className="user-icon" src={val.photo} />
                  <div className="text-container">
                    <p className="name">{val.name}</p>
                    <p className="profile">{val.profile}</p>
                  </div>

                </li>
              )
            })
            : <p>no user found.</p>
        }
      </ul>
    </>
  )
}