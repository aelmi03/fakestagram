import styled from "styled-components";
import { BsThreeDots, BsBookmark, BsChatDots } from "react-icons/bs";

import { VscHeart } from "react-icons/vsc";
import FlexContainer from "../utils/FlexContainer";

const Post = () => {
  return (
    <PostWrapper>
      <FlexContainer
        direction="row"
        padding="1.4rem 1.4rem 0rem 1.4rem"
        justifyContent="space-between"
      >
        <FlexContainer direction="row" gap="0.8rem" width="max-content">
          <PostUserImage src="https://i.pinimg.com/originals/b3/75/eb/b375eb0669bf24903b625cd64777c88a.jpg" />
          <PostText>abdidaboss123</PostText>
        </FlexContainer>
        <BsThreeDots />
      </FlexContainer>
      <PostImage src="https://i.pinimg.com/originals/b3/75/eb/b375eb0669bf24903b625cd64777c88a.jpg" />
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
          <PostText>Liked by </PostText>
          <PostTextBold>5 users</PostTextBold>
        </FlexContainer>
        <PostTextBold>
          abdidaboss{" "}
          <PostText>
            Another in the mix forreal yall my dawgs on lets get another chip to
            celebrate forreal
          </PostText>
        </PostTextBold>

        <PostGreyText>View all 1813 comments</PostGreyText>
        <FlexContainer direction="row" gap="0.4rem">
          <PostTextBold>sporty</PostTextBold>
          <PostText>Big dub!</PostText>
        </FlexContainer>

        <PostGreyText>3 hours ago</PostGreyText>
      </FlexContainer>
      <PostCommentsContainer>
        <PostCommentTextArea placeholder="Add Comment" />
        <PostCommentText>Post</PostCommentText>
      </PostCommentsContainer>
    </PostWrapper>
  );
};
const PostWrapper = styled.div`
  width: min(100%, 500px);
  display: grid;
  gap: 1rem;
  margin-bottom: 8rem;
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
`;
const PostText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 400;
  white-space: wrap;
  display: inline;
`;

const PostTextBold = styled(PostText)`
  font-weight: 650;
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

export default Post;
