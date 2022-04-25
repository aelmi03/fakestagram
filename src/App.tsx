import { useEffect } from "react";
import SignUpAndLogin from "./components/SignUpAndLogin/";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import Main from "./components/Main";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { selectUser, setUser, User } from "./features/user/userSlice";
import { setUsers } from "./features/users/usersSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Chat, setChats } from "./features/chatRooms/chatRoomsSlice";

function App() {
  console.log("APP");
  const [authUser] = useAuthState(getAuth());
  const user = useAppSelector(
    selectUser,
    (prevUser, nextUser) => prevUser.id === nextUser.id
  );
  const dispatch = useAppDispatch();
  const initializeUser = async () => {
    console.log("HELLO");
    const userDoc = doc(getFirestore(), `users/${authUser!.uid}`);
    onSnapshot(userDoc, (snapshot) => {
      console.log("asd");
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
    console.log("heh");
    if (user.id) {
      console.log("INTIIALZIG CHAT ROOM");
      initializeChatRooms();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);
  useEffect(() => {
    const getAllUsers = async () => {
      const usersQuery = query(
        collection(getFirestore(), "users"),
        where("id", "!=", `${user.id}`)
      );
      const allUsers = (await getDocs(usersQuery)).docs.map(
        (doc) => doc.data() as User
      );
      dispatch(setUsers(allUsers));
    };
    console.log(user);
    if (user.id) {
      getAllUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);
  if (authUser) {
    initializeUser();
    console.log("LIT");
    return <Main />;
  }
  return <SignUpAndLogin />;
}
export default App;
