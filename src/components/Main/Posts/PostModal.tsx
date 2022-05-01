import { User } from "../../../features/user/userSlice";
import Post from "../../utils/PostInterface";
import SmallModal from "./SmallModal";
import LargeModal from "./LargeModal";

interface IProps {
  post: Post;
  changeModalStatus: () => void;
  width: number;
  changePostToShow?: (post: Post | null) => void;
  changeLikesModalStatus: () => void;
}
const PostModal = ({
  post,
  changeModalStatus,
  width,
  changePostToShow,
  changeLikesModalStatus,
}: IProps) => {
  if (width >= 768) {
    return (
      <LargeModal
        post={post}
        changeModalStatus={changeModalStatus}
        changePostToShow={changePostToShow}
        changeLikesModalStatus={changeLikesModalStatus}
      />
    );
  }
  return <SmallModal post={post} changeModalStatus={changeModalStatus} />;
};

export default PostModal;
