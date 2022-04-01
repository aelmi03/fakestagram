import { User } from "../../features/user/userSlice";
import Post from "../utils/PostInterface";
import { useState, useEffect } from "react";
import SmallModal from "./SmallModal";
import LargeModal from "./LargeModal";

interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
  width: number;
  changePostToShow?: (post: Post | null) => void;
}
const PostModal = ({
  post,
  postUser,
  changeModalStatus,
  width,
  changePostToShow,
}: IProps) => {
  if (width >= 768) {
    return (
      <LargeModal
        post={post}
        postUser={postUser}
        changeModalStatus={changeModalStatus}
        changePostToShow={changePostToShow}
      />
    );
  }
  return (
    <SmallModal
      post={post}
      postUser={postUser}
      changeModalStatus={changeModalStatus}
    />
  );
};

export default PostModal;
