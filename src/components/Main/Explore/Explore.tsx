import React, { useState, useEffect } from "react";
import Post from "../../utils/PostInterface";
import {
  query,
  collection,
  getFirestore,
  where,
  QuerySnapshot,
  DocumentData,
  limit,
  getDocs,
} from "firebase/firestore";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectAllUsers } from "../../../features/users/usersSlice";
import { selectUser } from "../../../features/user/userSlice";

const Explore = () => {
  const [explorePosts, setExplorePosts] = useState<Post[]>([]);
  const users = useAppSelector(selectAllUsers);
  const user = useAppSelector(selectUser);
  const [showNoMorePostsText, setShowNoMorePostsText] = useState(false);
  const dispatch = useAppDispatch();
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [recentSnapshot, setRecentSnapshot] = useState<
    QuerySnapshot<DocumentData>
  >({} as QuerySnapshot<DocumentData>);
  useEffect(() => {
    const loadInitialPosts = async () => {
      const postsQuery = query(
        collection(getFirestore(), "posts"),
        where("postedBy", "!=", user.id),
        limit(20)
      );
      const postQueryDocs = await getDocs(postsQuery);
      const postsQueryData = postQueryDocs.docs.map(
        (doc) => doc.data() as Post
      );

      if (postsQueryData.length < 4) {
        setShowNoMorePostsText(true);
      } else {
        setShowLoadMoreButton(true);
      }
      setRecentSnapshot(postQueryDocs);
      setExplorePosts(postsQueryData);
    };
    loadInitialPosts();
  }, []);
};
