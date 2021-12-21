import "../../styles/userProfile.scss";
import cmpConfig from "./config";
import { Header } from "../UI/Header";

export const ShowUserProfileOnRequestReceived = (props) => {


  return (
    <>
      <Header
        backable={true}
        title={`${props.targetUserDoc?.name} さんのプロフィール`}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />

      <div className="user-profile-wrapper">
        <img className="user-icon" src={props.targetUserDoc?.photo}></img>
        <p className="name">{props.targetUserDoc?.name}</p>
        <p className="status">
          {props.targetUserDoc?.status === "1" ? "online" : "offline"}
        </p>
        <p className="profile card">{props.targetUserDoc?.profile}</p>
      </div>

      <button className="btn-orange" onClick={props.handleApproveRequest}>
        リクエストを許可する
      </button>
      <button className="btn-gray" onClick={props.handleRejectRequest}>
        リクエストを拒否する
      </button>
    </>
  )
}