export const UserProfile = (props) => {
  return (
    <div className="user-profile-wrapper">
      <img className="user-icon" src={props.userDoc?.photo}></img>
      <p className="name">{props.userDoc?.name}</p>
      <p className="profile card">{props.userDoc?.profile}</p>
    </div>
  );
};
