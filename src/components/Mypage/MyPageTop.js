import { MypageConfig } from "./config"
import { signOut } from "firebase/auth"

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

      <p classname="profile card clickable" id={cmpConfig["005"].id} onclick={props.handleonclick}>
        <span>プロフィールメッセージ：</span>
        {props.user?.profile}
      </p>

      <button classname="btn-gray" onclick={signOut}>ログアウトする</button>
    </div>

  )
}