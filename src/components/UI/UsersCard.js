import { useRef, useState } from "react";

import { curStrLength } from "../../fn/util/cutStrLength";

import "../../styles/UI/UsersCard.scss";

export const UsersCard = (props) => {
  const [nowDisplay, setNowDisplay] = useState(0);
  const paginationRef = useRef(null);

  return (
    <div className="carousel-wrapper">
      <div
        className={`navigation left ${nowDisplay > 0 ? "active" : ""}`}
        onClick={() => {
          setNowDisplay(nowDisplay - 1);
        }}
      >
        &lt;
      </div>
      <div
        className={`navigation right ${
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
            return (
              <li
                className={`user-card ${
                  props?.className?.userCard ? props.className.userCard : ""
                } ${props?.handleOnClick ? "clickable" : ""} ${
                  nowDisplay === index ? "active" : ""
                }`}
                key={val.uid}
              >
                <img className="user-icon" src={val?.photo} />

                <p className="name">{val?.name}</p>
                <p className="age">{val?.age + " 歳"}</p>
                <p className="hometown">
                  {val?.hometown?.prefecture} {val?.hometown?.city} 出身
                </p>
                <p>出身大学：{val?.history.university}</p>
                <p className="profile">{curStrLength(val?.profile, 35)}</p>

                <button
                  id={val.uid}
                  className="btn-orange"
                  onClick={props.handleOnClick}
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
