import styled from "styled-components";
import { BsThreeDots, BsBookmark, BsChatDots } from "react-icons/bs";
import { formatDistanceToNow } from "date-fns";
import { VscHeart } from "react-icons/vsc";
import FlexContainer from "../utils/FlexContainer";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
interface IProps {
  post: Post;
  postUser: User;
}
const StandardPost = ({ post, postUser }: IProps) => {
  return (
    <PostWrapper>
      <FlexContainer
        direction="row"
        padding="1.4rem 1.4rem 0rem 1.4rem"
        justifyContent="space-between"
      >
        <FlexContainer direction="row" gap="0.8rem" width="max-content">
          <PostUserImage src={postUser.profilePicture} />
          <PostTextBold>{postUser.username}</PostTextBold>
        </FlexContainer>
        <BsThreeDots />
      </FlexContainer>
      <PostImage src={post.imgSrc} />
      <FlexContainer
        direction="column"
        gap="0.5rem"
        padding="1.4rem"
        justifyContent="start"
      >
        <FlexContainer
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <FlexContainer
            direction="row"
            gap="1.5rem"
            width="max-content"
            alignContent="center"
          >
            <VscHeart />
            <BsChatDots />
          </FlexContainer>
          <BsBookmark />
        </FlexContainer>
        <FlexContainer direction="row" gap="0.6rem">
          <PostTextBold>
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </PostTextBold>
        </FlexContainer>
        <PostTextBold>
          {postUser.username}
          <PostText>&nbsp;&nbsp;{post.caption}</PostText>
        </PostTextBold>

        <PostGreyText>
          View all {post.comments.length}{" "}
          {post.comments.length > 1 ? "comments" : "comment"}
        </PostGreyText>
        <PostGreyText>
          {`${formatDistanceToNow(post.timestamp.toDate())} ago`}
        </PostGreyText>
      </FlexContainer>
      <PostCommentsContainer>
        <PostCommentTextArea placeholder="Add Comment" />
        <PostCommentText>Post</PostCommentText>
      </PostCommentsContainer>
    </PostWrapper>
  );
};
const PostWrapper = styled.div`
  width: min(100%, 600px);
  margin-top: 4rem;
  display: grid;
  gap: 1rem;
  margin-bottom: 5rem;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  svg {
    height: 28px;
    width: 28px;
    cursor: pointer;
  }
`;
const PostCommentsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
  background-color: ${({ theme }) => theme.palette.primaryLight};
`;
const PostUserImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
`;
const PostCommentTextArea = styled.textarea`
  padding: 0.5rem;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
`;
const PostText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 400;
  white-space: wrap;
  display: inline;
`;

const PostTextBold = styled.span`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: bold;
`;
const PostGreyText = styled(PostText)`
  color: ${({ theme }) => theme.palette.darkGrey};
`;
const PostCommentText = styled(PostText)`
  font-weight: 700;
  color: ${({ theme }) => theme.palette.secondary.main};
`;
const PostImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1.1;
`;

export default StandardPost;
