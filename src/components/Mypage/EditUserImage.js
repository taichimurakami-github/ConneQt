import React, { useContext, useState, useRef } from "react";
import { AppRouteContext } from "../../AppRoute";
import { registerUserImageToStorage } from "../../fn/db/registerHandler";
import { Header } from "../UI/Header";
import { cmpConfig } from "./config";
import { getImageDataURL } from "../../fn/app/getImageDataURL";

export const EditUserImage = (props) => {
  const { showErrorModal, showLoadingModal } = useContext(AppRouteContext);

  //inputで一度ファイル選択をせずにエクスプローラーを閉じるとundefinedになるので、それを初期値とする
  const [imageDataURL, setImageDataURL] = useState(undefined);

  //preview画像をクリックした際にinputをクリックするためにrefを用意
  const imageInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    (async () => {
      try {
        showLoadingModal();
        //storageにユーザーアイコンの画像データを格納（既にある場合は上書き）
        //storageへのdownload linkが帰ってくる
        const ref = await registerUserImageToStorage(
          imageDataURL,
          props.nowUserDoc
        );

        //userDoc.photoを更新
        props.handleSubmit(ref);
      } catch (e) {
        console.log(e);
        showErrorModal({
          content: {
            title: "画像のアップロード中にエラーが発生しました。",
            text: ["お手数ですがもう一度やり直してください。"],
          },
        });
      }
    })();
  };

  return (
    <>
      <Header
        title="ユーザーアイコンを編集"
        backable={true}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />

      <form onSubmit={handleSubmit}>
        <h2 className="input-target-title">
          新しいユーザーアイコンの画像を選択してください。
        </h2>

        {
          <img
            className="user-icon"
            src={imageDataURL || props.nowUserDoc.photo}
            alt={props.nowUserDoc?.name + "さんの新しいプロフィール画像"}
            onClick={() => {
              imageInputRef.current && imageInputRef.current.click();
            }}
          ></img>
        }

        <input
          id="NEW_USER_IMAGE_INPUT"
          type="file"
          onChange={async (e) => {
            e.target.files[0] &&
              setImageDataURL(await getImageDataURL(e.target.files[0]));
          }}
          accept="image/*"
          required={true}
          ref={imageInputRef}
        ></input>

        <button
          className="btn-orange"
          type="submit"
          disabled={!Boolean(imageDataURL)}
        >
          この画像に変更する
        </button>
      </form>

      <button
        className="btn-gray"
        onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
      >
        前のページに戻る
      </button>
    </>
  );
};
