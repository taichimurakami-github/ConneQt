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
      <p className={`text-container ${props.isAuthUser ? "me" : "with"}`}>
        {parseLFToReactBr(props.val.text)}
      </p>
    </>
  );
};
