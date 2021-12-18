import { appConfig } from "../../app.config";
import "../../styles/userProfile.scss";
import { Header } from "../UI/Header";

export const UserProfile = (props) => {

  const handleBack = () => {
    props.handlePageContent(appConfig.pageContents["002"]);
  }

  return (
    <>
      <Header
        backable={true}
        title={`${props.user?.name} さんのプロフィール`}
        handleBack={handleBack}
      />

      <div className="user-profile-wrapper">
        <img className="user-icon" src={props.user?.photo}></img>
        <p className="name">{props.user?.name}</p>
        <p className="status">
          {props.user?.status === "1" ? "online" : "offline"}
        </p>
        <p className="profile card">{props.user?.profile}</p>
      </div>
    </>
  )
}