import React from "react";
import SignUpAndLogin from "./components/SignUpAndLogin/";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Main from "./components/Main";
import { getDoc, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { setUser, User } from "./features/user/userSlice";
import { useAppDispatch } from "./app/hooks";

function App() {
  const [authUser] = useAuthState(getAuth());
  const dispatch = useAppDispatch();
  const initializeUser = async () => {
    const userDoc = doc(getFirestore(), `users/${authUser!.uid}`);
    const userData = await getDoc(userDoc);
    dispatch(setUser(userData.data() as User));
    onSnapshot(userDoc, (snapshot) => {
      dispatch(setUser(snapshot.data() as User));
    });
  };
  if (authUser) {
    initializeUser();
    return <Main />;
  }
  return <SignUpAndLogin />;
}
export default App;
