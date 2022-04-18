import React, { useEffect, useState } from "react";
import SignUpAndLogin from "./components/SignUpAndLogin/";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Main from "./components/Main";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { selectUser, setUser, User } from "./features/user/userSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Chat, setChats } from "./features/chatRoom/chatRoomSlice";

function App() {
  console.log("APP");
  const [authUser] = useAuthState(getAuth());
  const user = useAppSelector(
    selectUser,
    (prevUser, nextUser) => prevUser.id === nextUser.id
  );
  const dispatch = useAppDispatch();
  const initializeUser = async () => {
    const userDoc = doc(getFirestore(), `users/${authUser!.uid}`);
    onSnapshot(userDoc, (snapshot) => {
      dispatch(setUser(snapshot.data() as User));
    });
  };
  useEffect(() => {
    const initializeChatRooms = async () => {
      const chatRoomsQuery = query(
        collection(getFirestore(), "chatRooms"),
        where("members", "array-contains", `${user.id}`)
      );
      onSnapshot(chatRoomsQuery, (snapshot) => {
        const chats = snapshot.docs.map((doc) => doc.data() as Chat);
        console.log("chatss", chats);
        dispatch(setChats(chats));
      });
    };
    if (user.id) {
      initializeChatRooms();
    }
  }, [user]);
  if (authUser) {
    initializeUser();
    return <Main />;
  }
  return <SignUpAndLogin />;
}
export default App;
