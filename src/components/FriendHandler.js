import { Header } from "./UI/Header";

export const FriendHandler = (props) => {
  return (
    <>
      <Header
        title="フレンドリスト"
        backable={false}
      />
      <p>this is friend component</p>
    </>
  );
}