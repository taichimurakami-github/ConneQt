import "../../styles/userProfile.scss";
import cmpConfig from "./config";
import { Header } from "../UI/Header";

export const ShowUserProfile = (props) => {


  return (
    <>
      <Header
        backable={true}
        title={`${props.user?.name} さんのプロフィール`}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />

      <div className="user-profile-wrapper">
        <img className="user-icon" src={props.user?.photo}></img>
        <p className="name">{props.user?.name}</p>
        <p className="status">
          {props.user?.status === "1" ? "online" : "offline"}
        </p>
        <p className="profile card">{props.user?.profile}</p>
      </div>

      <button className="btn-orange" onClick={() => props.handleViewState(cmpConfig.state.view["003"])}>
        リクエストを送る
      </button>
      <button className="btn-gray" onClick={() => props.handleViewState(cmpConfig.state.view["001"])}>
        前のページに戻る
      </button>
    </>
  )
}