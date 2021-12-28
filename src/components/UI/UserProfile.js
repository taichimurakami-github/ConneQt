import "../../styles/UI/UserProfile.scss";

export const UserProfile = (props) => {
  return (
    <div className="user-profile-wrapper">
      <img className="user-icon" src={props.userDoc?.photo}></img>
      <p className="name">{props.userDoc?.name}</p>
      <p className="name">{props.userDoc?.age + " 歳"}</p>
      <p className="name">
        {props.userDoc?.hometown?.prefecture} {props.userDoc?.hometown?.city}{" "}
        在住
      </p>
      <p className="profile">
        <h3>プロフィール</h3>
        {props.userDoc?.profile}
      </p>
    </div>
  );
};
