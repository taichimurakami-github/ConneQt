import { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { signOut } from "../fn/auth/firebsae.auth";
import { getAllUserDocs } from "../fn/db/firestore.handler";

export const PeopleList = (props) => {

  const [listState, setListState] = useState([]);

  useEffect(() => {
    (async () => {
      setListState(await getAllUserDocs());
    })();
  }, [listState])

  return (
    <>
      <h1>enspace</h1>
      <ul>
        {listState.map((val) => {
          return (
            <li key={val.email}>
              <img src={val.googleProfilePhotoURL} />
              <p>{val.name}</p>
              <p>{val.profile}</p>
            </li>
          )
        })}
      </ul>
      <button onClick={signOut}>ログアウトする</button>
    </>
  )
}