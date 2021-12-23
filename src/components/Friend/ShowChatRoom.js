import { useState } from "react"
import { Header } from "../UI/Header"
import cmpConfig from "./config"


export const ShowChatRoom = (props) => {

  const [chatDataState_me, setChatDataState_me] = useState(props.chatData[props.metaData.chatRoomID][props.metaData.doc.me.uid]);
  const [chatDataState_with, setChatDataState_with] = useState(props.chatData[props.metaData.chatRoomID][props.metaData.doc.with.uid]);

  const getOrderedChatData = () => {
    const result = [];
    const chatData_me = [...chatDataState_me];
    const chatData_with = [...chatDataState_with];


    while (chatData_me.length > 0 && chatData_with.length > 0) {

      const me_newest = chatData_me.pop()
      const with_newest = chatData_with.pop();

      result.push(me_newest);
      result.push(with_newest);
    }

    console.log(result);
    return result;
  }

  return (
    <>
      <Header
        backable={true}
        handleBack={() => { props.handleViewState(cmpConfig.state.view["001"]) }}
        title={`${props.metaData.doc.with.name}`}
      />
      <p>this is chat component</p>
      <ul>
        {getOrderedChatData().map(val => {
          console.log(val);
          return <>
            <p>{val.text}</p>
          </>
        })}
      </ul>
    </>
  )
}