import React from "react";
import SignUpAndLogin from "./components/SignUpAndLogin/";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Main from "./components/Main";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { setUser, User } from "./features/user/userSlice";
import { useAppDispatch } from "./app/hooks";

function App() {
  console.log("APP");
  const [authUser] = useAuthState(getAuth());
  const dispatch = useAppDispatch();
  const initializeUser = async () => {
    const userDoc = doc(getFirestore(), `users/${authUser!.uid}`);
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
