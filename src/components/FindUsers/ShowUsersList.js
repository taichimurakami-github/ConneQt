import { Header } from "../UI/Header";
import cmpConfig from "./config";

export const ShowUsersList = (props) => {

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

  return (
    <>
      <Header
        title="ユーザーを探す"
        backable={false}
      />
      <ul className="users-list-wrapper">
        {props.allUserDocs.map((val) => {

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
        })}
      </ul>
    </>
  )
}