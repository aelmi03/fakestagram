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
  DocumentData,
} from "firebase/firestore";
import { User } from "../../features/user/userSlice";
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
