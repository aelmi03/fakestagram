import React from "react";
import SignUpAndLogin from "./components/SignUpAndLogin/";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Main from "./components/Main";

function App() {
  const [authUser, loading] = useAuthState(getAuth());
  if (!loading) {
    return <Main />;
  }
  return <SignUpAndLogin />;
}

export default App;
