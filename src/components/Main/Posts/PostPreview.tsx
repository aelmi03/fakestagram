import FlexContainer from "../../utils/FlexContainer";
import styled from "styled-components";
import { BsFillChatFill } from "react-icons/bs";
import Post from "../../utils/PostInterface";
import { AiFillHeart } from "react-icons/ai";
interface IProps {
  post: Post;
  changePostToShow: (post: Post) => void;
}
const PostPreview = ({ post, changePostToShow }: IProps) => {
  return (
    <ProfilePost
      key={post.id}
      onClick={() => changePostToShow(post)}
      data-testid={`${post.id}`}
    >
      <ProfilePostImage src={post.imgSrc} alt="profile" />
      <PostInformation>
        <FlexContainer direction="row" gap="0.7rem" alignItems="center">
          <AiFillHeart />
          <PostInformationText data-testid="likes">
            {post.likes.length}
          </PostInformationText>
        </FlexContainer>
        <FlexContainer direction="row" gap="0.7rem" alignItems="center">
          <BsFillChatFill />
          <PostInformationText data-testid="comments">
            {post.comments.length}
          </PostInformationText>
        </FlexContainer>
      </PostInformation>
    </ProfilePost>
  );
};

const PostInformationText = styled.h4`
  color: ${({ theme }) => theme.palette.common.white};
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.2rem;
  font-weight: bold;
  @media only screen and (min-width: 540px) {
    font-size: 1.75rem;
  }
`;
const PostInformation = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-evenly;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  &:hover {
    opacity: 1;
  }
  svg {
    color: ${({ theme }) => theme.palette.common.white};
    height: 15px;
    width: 15px;
    @media only screen and (min-width: 540px) {
      height: 25px;
      width: 25px;
    }
  }
  div {
    width: max-content;
  }
`;
const ProfilePostImage = styled.img`
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
`;
const ProfilePost = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
`;

export default PostPreview;
