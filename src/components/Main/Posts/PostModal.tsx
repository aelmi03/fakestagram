import { User } from "../../../features/user/userSlice";
import Post from "../../utils/PostInterface";
import SmallModal from "./SmallModal";
import LargeModal from "./LargeModal";

interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
  width: number;
  changePostToShow?: (post: Post | null) => void;
  changeLikesModalStatus: () => void;
}
const PostModal = ({
  post,
  postUser,
  changeModalStatus,
  width,
  changePostToShow,
  changeLikesModalStatus,
}: IProps) => {
  if (width >= 768) {
    return (
      <LargeModal
        post={post}
        postUser={postUser}
        changeModalStatus={changeModalStatus}
        changePostToShow={changePostToShow}
        changeLikesModalStatus={changeLikesModalStatus}
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
