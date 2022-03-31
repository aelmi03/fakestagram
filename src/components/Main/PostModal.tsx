import { User } from "../../features/user/userSlice";
import Post from "../utils/PostInterface";
import { useState, useEffect } from "react";
import SmallModal from "./SmallModal";
import LargeModal from "./LargeModal";

interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const PostModal = ({ post, postUser, changeModalStatus }: IProps) => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  if (width >= 768) {
    return (
      <LargeModal
        post={post}
        postUser={postUser}
        changeModalStatus={changeModalStatus}
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
