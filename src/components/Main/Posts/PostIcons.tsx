import FlexContainer from "../../utils/FlexContainer";
import {
  BsChatDots,
  BsBookmark,
  BsBookmarkFill,
  BsSuitHeart,
  BsSuitHeartFill,
} from "react-icons/bs";
import {
  clickLikeIcon,
  clickBookmarkIcon,
  userHasLikedPost,
  userHasSavedPost,
} from "../../utils/utilityFunctions";
import { User } from "../../../features/user/userSlice";
import Post from "../../../components/utils/PostInterface";
import styled, { css } from "styled-components";
interface IProps {
  post: Post;
  user: User;
  changeModalStatus: () => void;
  changePostToShow?: (post: Post | null) => void;
  largeModal?: boolean;
}
const PostIcons = ({
  user,
  post,
  changeModalStatus,
  changePostToShow,
  largeModal,
}: IProps) => {
  return (
    <FlexContainer
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <PostIconsContainer largeModal={largeModal}>
        {userHasLikedPost(user, post) ? (
          <BsSuitHeartFill
            style={{ color: "red" }}
            title="Unlike this post"
            onClick={() => clickLikeIcon(user, post)}
            data-testid="filled-heart"
          />
        ) : (
          <BsSuitHeart
            title="Like this post"
            onClick={() => clickLikeIcon(user, post)}
            data-testid="heart"
          />
        )}
        <BsChatDots
          onClick={changeModalStatus}
          title={"View comments"}
          data-testid="chat"
        />
      </PostIconsContainer>
      {userHasSavedPost(user, post) ? (
        <BsBookmarkFill
          title={`Unsave this post`}
          onClick={() => clickBookmarkIcon(user, post)}
          data-testid="filled-bookmark"
        />
      ) : (
        <BsBookmark
          title={"Save this post"}
          onClick={() => clickBookmarkIcon(user, post)}
          data-testid="bookmark"
        />
      )}
    </FlexContainer>
  );
};
const PostIconsContainer = styled.div<{
  largeModal?: boolean;
}>`
  display: flex;
  gap: 1.5rem;
  width: max-content;
  align-content: center;

  ${({ largeModal }) =>
    largeModal === true &&
    css`
      > {
        :nth-child(2) {
          display: none;
        }
      }
    `}
`;
export default PostIcons;
