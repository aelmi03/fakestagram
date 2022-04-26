import { shallowEqual } from "react-redux";
import {
  updateDoc,
  doc,
  getFirestore,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
  getDoc,
  DocumentData,
  addDoc,
} from "firebase/firestore";
import { User } from "../../features/user/userSlice";
import {
  changeSelectedChat,
  Chat,
} from "../../features/chatRooms/chatRoomsSlice";
import { useAppDispatch } from "../../app/hooks";
import Post from "./PostInterface";
export const checkEquality = (left: any, right: any) => {
  let areEqual = true;
  Object.keys(left).forEach((key) => {
    if (!shallowEqual(left[key], right[key])) {
      areEqual = false;
    }
  });
  return areEqual;
};

export const userHasSavedPost = (user: User, post: Post) => {
  return user.savedPosts.includes(post.id);
};
export const userHasLikedPost = (user: User, postInfo: Post) => {
  return postInfo.likes.includes(user.id);
};
export const clickLikeIcon = async (user: User, postInfo: Post) => {
  let likes: string[] = [];
  if (postInfo.likes.includes(user.id)) {
    likes = [...postInfo.likes].filter((id) => id !== user.id);
  } else {
    likes = [...postInfo.likes, user.id];
  }
  const postDoc = doc(getFirestore(), `posts/${postInfo.id}`);
  await updateDoc(postDoc, {
    likes,
  });
};
export const clickBookmarkIcon = async (user: User, postInfo: Post) => {
  let savedPosts: string[] = [];
  if (user.savedPosts.includes(postInfo.id)) {
    savedPosts = [...user.savedPosts].filter((id) => id !== postInfo.id);
  } else {
    savedPosts = [...user.savedPosts, postInfo.id];
  }
  const userDoc = doc(getFirestore(), `users/${user.id}`);
  await updateDoc(userDoc, {
    savedPosts,
  });
};
export const deletePost = async (post: Post) => {
  const postDoc = doc(getFirestore(), `posts/${post.id}`);
  await deleteDoc(postDoc);
};

export const updateFollowing = async (user: User, otherUser: User) => {
  let newFollowing: string[] = [];
  if (user.following.includes(otherUser.id)) {
    newFollowing = user.following.filter((id) => id !== otherUser.id);
  } else {
    newFollowing = [...user.following, otherUser.id];
  }
  const userDoc = doc(getFirestore(), `users/${user.id}`);
  await updateDoc(userDoc, {
    following: newFollowing,
  });
};
export const followsOtherUser = (user: User, otherUser: User) => {
  return user.following.includes(otherUser.id);
};

export const getFollowers = async (user: User) => {
  const followersQuery = query(
    collection(getFirestore(), "users"),
    where("following", "array-contains", `${user.id}`)
  );
  const followers = (await getDocs(followersQuery)).docs.map(
    (doc: DocumentData) => doc.data() as User
  );
  return followers;
};

export const getProfileUserPosts = async (profileUser: User) => {
  const profileUserPostsQuery = query(
    collection(getFirestore(), "posts"),
    where("postedBy", "==", `${profileUser.id}`)
  );
  const posts = (await getDocs(profileUserPostsQuery)).docs.map(
    (doc: DocumentData) => doc.data() as Post
  );
  return posts;
};

export const createChatRoom = async (user: User, secondUser: User) => {
  console.log("testingainsd");
  const chatRoom: Chat = {
    members: [user.id, secondUser.id],
    messages: [],
    createdAt: new Date().toString(),
    recentMessage: null,
    id: "",
  };
  const chatRoomDoc = await addDoc(
    collection(getFirestore(), "chatRooms"),
    chatRoom
  );
  updateDoc(chatRoomDoc, {
    id: chatRoomDoc.id,
  });
  const chatRoomData = (await getDoc(chatRoomDoc)).data() as Chat;
  return chatRoomData;
};
export const messageUser = async (
  user: User,
  clickedUser: User,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  const chatRoomQuery = query(
    collection(getFirestore(), "chatRooms"),
    where("members", "in", [[user.id, clickedUser.id]])
  );
  const chatRoomDoc = await getDocs(chatRoomQuery);
  console.log(chatRoomDoc.docs.length);
  if (chatRoomDoc.docs.length === 0) {
    const chatRoom = await createChatRoom(user, clickedUser);
    dispatch(changeSelectedChat(chatRoom));
  } else {
    dispatch(changeSelectedChat(chatRoomDoc.docs[0].data() as Chat));
  }
};
