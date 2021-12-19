import { signOut } from "../../fn/auth/firebase.auth"
import { Header } from "../UI/Header"
import { cmpConfig } from "./config"
import darkgrayArrowGt from "../../images/arrow-gt-darkgray.svg";


export const MypageTop = (props) => {

  return (
    <>
      <Header
        title="マイページ"
        backable={false}
      />

      <ul className="mypage-top-wrapper">
        <img className="user-icon" src={props.user?.photo}></img>

        <li className="edit-menu-container name clickable"
          id={cmpConfig.state.view["003"]}
          onClick={() => props.handleViewState(cmpConfig.state.view["003"])}>
          <h3 className="nav-title">お名前を編集：</h3>
          {props.user?.name}
          <img className="arrow-gt absolute" src={darkgrayArrowGt}></img>
        </li>
        <li className="edit-menu-container state clickable"
          id={cmpConfig.state.view["004"]}
          onClick={() => props.handleViewState(cmpConfig.state.view["004"])}>
          <h3 className="nav-title">状態を編集：</h3>
          {props.user?.state}
          <img className="arrow-gt absolute" src={darkgrayArrowGt}></img>
        </li>
        <li className="edit-menu-container profile clickable"
          id={cmpConfig.state.view["005"]}
          onClick={() => props.handleViewState(cmpConfig.state.view["005"])}>
          <h3 className="nav-title">プロフィールを編集：</h3>
          {props.user?.profile}
          <img className="arrow-gt absolute" src={darkgrayArrowGt}></img>
        </li>

        <button className="btn-gray" onClick={signOut}>ログアウトする</button>
      </ul>
    </>
  )
}