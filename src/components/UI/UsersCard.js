import { useState } from "react";
import { cutStrLength } from "../../fn/util/cutStrLength";
import { getAgeFromBirthday } from "../../fn/util/getAgeFromBirthday";

import "../../styles/UI/UsersCard.scss";

export const UsersCard = (props) => {
  const [nowDisplay, setNowDisplay] = useState(0);

  return (
    <div className="carousel-wrapper">
      <div
        className={`navigation left clickable ${
          nowDisplay > 0 ? "active" : ""
        }`}
        onClick={() => {
          setNowDisplay(nowDisplay - 1);
        }}
      >
        &lt;
      </div>
      <div
        className={`navigation right clickable ${
          nowDisplay < props.userDocs.length - 1 ? "active" : ""
        }`}
        onClick={() => {
          setNowDisplay(nowDisplay + 1);
        }}
      >
        &gt;
      </div>

      <ul
        className={`users-card-wrapper ${
          props?.className?.wrapper ? props.className.wrapper : ""
        }`}
      >
        {props?.userDocs && props.userDocs.length !== 0 ? (
          props.userDocs.map((val, index) => {
            //もしもundefinedオブジェクトが混ざっていたら、表示しない
            if (!val) return undefined;

            return (
              <li
                className={`user-card ${
                  props?.className?.userCard ? props.className.userCard : ""
                } ${props?.handleClick ? "clickable" : ""} ${
                  nowDisplay === index ? "active" : ""
                }`}
                key={val.uid}
              >
                <img
                  className="user-icon"
                  src={val?.photo}
                  alt={val?.name + "さんのプロフィール画像"}
                />

                <p className="name">{val?.name}</p>
                <p className="age">
                  <b>{getAgeFromBirthday(val.birthday)}</b> 歳
                </p>
                <p className="hometown">
                  出身地：
                  <b>
                    {val?.hometown?.prefecture} {val?.hometown?.city}
                  </b>
                </p>
                <p className="university">
                  出身大学：<b>{val?.history.university}</b>
                </p>
                <p className="profile">{cutStrLength(val?.profile, 35)}</p>

                <button
                  id={val.uid}
                  className="btn-orange"
                  onClick={props.handleClick}
                >
                  このユーザーを見る
                </button>
              </li>
            );
          })
        ) : (
          <p>
            {props?.noUserMessage
              ? props.noUserMessage
              : "該当するユーザーが見つかりませんでした。"}
          </p>
        )}
      </ul>
    </div>
  );
};
