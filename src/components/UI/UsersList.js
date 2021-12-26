import "../../styles/usersList.scss";

export const UsersList = (props) => {
  return (
    <ul
      className={`users-list-wrapper ${
        props?.className?.wrapper ? props.className.wrapper : ""
      }`}
    >
      {props?.userDocs && props.userDocs.length !== 0 ? (
        props.userDocs.map((val) => {
          return (
            <li
              id={val.uid}
              className={`user-list ${
                props?.className?.userList ? props.className.userList : ""
              } ${props?.handleOnClick ? "clickable" : ""}`}
              onClick={props?.handleOnClick}
              key={val.uid}
            >
              <img className="user-icon" src={val?.photo} />
              <div className="text-container">
                <p className="name">{val?.name}</p>
                <p className="profile">{val?.profile}</p>
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
