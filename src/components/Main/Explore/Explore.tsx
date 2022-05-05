import React, { useState, useEffect } from "react";
import Post from "../../utils/PostInterface";
import {
  query,
  collection,
  getFirestore,
  where,
  limit,
} from "firebase/firestore";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectAllUsers } from "../../../features/users/usersSlice";
import { selectUser } from "../../../features/user/userSlice";

const Explore = () => {
  const explorePosts = useState<Post[]>([]);
  const users = useAppSelector(selectAllUsers);
  const user = useAppSelector(selectUser);
  const [showNoMorePostsText, setShowNoMorePostsText] = useState(false);
  const dispatch = useAppDispatch();
  const [showLoadMoreButton, setShowLoadMoreButton] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    const loadInitialPosts = () => {
      const postsQuery = query(
        collection(getFirestore(), "posts"),
        where("postedBy", "!=", user.id),
        limit(20)
      );
    };
    loadInitialPosts();
  }, []);
};
