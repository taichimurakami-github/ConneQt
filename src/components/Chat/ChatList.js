import { parseLFToReactBr } from "../../fn/util/parseText";

export const ChatListContent = (props) => {
  return (
    <>
      {!props.isAuthUser && (
        <img
          className="user-icon"
          src={props.doc.photo || ""}
          alt={props.doc?.name ? props.doc.name + "さんのプロフィール画像" : ""}
        ></img>
      )}
      <div className={`text-wrapper ${props.isAuthUser ? "me" : "with"}`}>
        <p className={`text-container ${props.isAuthUser ? "me" : "with"}`}>
          {parseLFToReactBr(props.val.text)}
        </p>
        {props.sentAt && <p className={`sent-at-container`}>{props.sentAt}</p>}
      </div>
    </>
  );
};
