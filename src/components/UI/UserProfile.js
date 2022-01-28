import { getAgeFromBirthday } from "../../fn/util/getAgeFromBirthday";
import { parseLFToReactBr } from "../../fn/util/parseText";
import "../../styles/UI/UserProfile.scss";

export const UserProfile = (props) => {
  if (props?.userDoc && props.userDoc?.name) {
    return (
      <div className="user-profile-wrapper">
        {
          //退会済みでも表示：ユーザーアイコン
          <img
            className="user-icon"
            src={props.userDoc?.photo || ""}
            alt={
              props.userDoc?.name
                ? props.userDoc.name + "さんのプロフィール画像"
                : "退会済みのユーザーアイコン"
            }
          ></img>
        }
        {
          //退会済みでも表示；退会済みユーザー表示
          <p className="name">
            {props.userDoc?.name ? props.userDoc.name : "退会済みのユーザー"}
          </p>
        }
        {props.userDoc?.birthday && (
          <p className="age">
            {getAgeFromBirthday(props.userDoc.birthday) + " 歳"}
          </p>
        )}
        {props.userDoc?.hometown && (
          <p className="hometown">
            {props.userDoc?.hometown?.prefecture}{" "}
            {props.userDoc?.hometown?.city} 出身
          </p>
        )}
        {props.userDoc?.history && (
          <p className="university">
            {props.userDoc?.history?.university} 卒業
          </p>
        )}
        {props.userDoc?.profile && (
          <div className="profile">
            <h3 style={{ textAlign: "center", lineHeight: "2" }}>
              プロフィール
            </h3>
            {parseLFToReactBr(props.userDoc.profile)}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="user-profile-wrapper">
        <h2 className="no-user-title">このユーザーは退会しました。</h2>
      </div>
    );
  }
};
