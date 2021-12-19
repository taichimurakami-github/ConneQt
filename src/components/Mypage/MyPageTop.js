import { signOut } from "../../fn/auth/firebase.auth"
import { MypageConfig } from "./config"

const cmpConfig = { ...MypageConfig }

export const MypageTop = (props) => {

  return (
    <div className="mypage-top-wrapper">

      <img className="user-icon" src={props.user?.photo}></img>

      <p className="name clickable" id={cmpConfig["003"].id} onClick={props.handleOnClick}>
        {props.user?.name}
      </p>

      <p className="state clickable" id={cmpConfig["004"].id} onClick={props.handleOnClick}>
        {props.user?.state}
      </p>

      <p className="profile card clickable" id={cmpConfig["005"].id} onClick={props.handleOnclick}>
        <span>プロフィールメッセージ：</span>
        {props.user?.profile}
      </p>

      <button classname="btn-gray" onClick={signOut}>ログアウトする</button>
    </div>

  )
}