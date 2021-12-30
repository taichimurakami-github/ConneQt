import "../../styles/UI/UserProfile.scss";

export const UserProfile = (props) => {
  return (
    <div className="user-profile-wrapper">
      <img className="user-icon" src={props.userDoc?.photo || ""}></img>
      {props.userDoc?.name && <p className="name">{props.userDoc?.name}</p>}
      {props.userDoc?.age && (
        <p className="age">{props.userDoc?.age + " 歳"}</p>
      )}
      {props.userDoc?.hometown && (
        <p className="hometown">
          {props.userDoc?.hometown?.prefecture} {props.userDoc?.hometown?.city}{" "}
          出身
        </p>
      )}
      {props.userDoc?.history && (
        <p className="university">{props.userDoc?.history?.university} 卒業</p>
      )}
      {props.userDoc?.profile && (
        <div className="profile">
          <h3 style={{ textAlign: "center", lineHeight: "2" }}>プロフィール</h3>
          {props.userDoc?.profile}
        </div>
      )}
    </div>
  );
};
