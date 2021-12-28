import "../../styles/UI/UserProfile.scss";

export const UserProfile = (props) => {
  return (
    <div className="user-profile-wrapper">
      <img className="user-icon" src={props.userDoc?.photo}></img>
      <p className="name">{props.userDoc?.name}</p>
      <p className="age">{props.userDoc?.age + " 歳"}</p>
      <p className="hometown">
        {props.userDoc?.hometown?.prefecture} {props.userDoc?.hometown?.city}{" "}
        出身
      </p>
      <p className="university">{props.userDoc.history.university} 卒業</p>
      <p className="profile">
        <h3 style={{ textAlign: "center", lineHeight: "2" }}>プロフィール</h3>
        {props.userDoc?.profile}
      </p>
    </div>
  );
};
