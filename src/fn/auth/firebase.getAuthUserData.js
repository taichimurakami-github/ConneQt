import { getAuth } from "firebase/auth"

export const getAuthUserData = () => {
  const result = getAuth().currentUser;
  console.log(result);
  return result;
};