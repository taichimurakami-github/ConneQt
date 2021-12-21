import { useState } from "react"
import { Header } from "../UI/Header"


export const ShowChatRoom = (props) => {

  const [chatRoomDataState, setChatRoomDataState] = useState();

  return (
    <>
      <Header
        backable={true}
      />
      <p>This is chat component.</p>
    </>
  )
}