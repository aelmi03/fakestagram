import styled from "styled-components";
import FlexContainer from "../../utils/FlexContainer";
import { BsGrid3X3 } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa";

const ProfilePosts = () => {
  return (
    <ProfilePostsWrapper>
      <FlexContainer direction="row" justifyContent="space-evenly">
        <InfoContainer>
          <BsGrid3X3 /> <InfoText>POSTS</InfoText>
        </InfoContainer>
        <InfoContainer>
          <FaRegBookmark /> <InfoText>SAVED POSTS</InfoText>
        </InfoContainer>
      </FlexContainer>
      <PostsContainer>
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
        <img
          alt="empty profile"
          src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/golden-retriever-royalty-free-image-506756303-1560962726.jpg?crop=0.672xw:1.00xh;0.166xw,0&resize=640:*"
        />
      </PostsContainer>
    </ProfilePostsWrapper>
  );
};
const ProfilePostsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  margin-bottom: 5rem;
`;
const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 30.7%);
  width: 100%;
  gap: 0.6rem;
  justify-content: center;
  @media only screen and (min-width: 768px) {
    gap: 2.8rem;
  }
  @media only screen and (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, 31.3%);
  }
`;
const InfoText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.3rem;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  top: -1px;
  color: ${({ theme }) => theme.palette.darkGrey};
  :nth-child(1) {
    border-top: 1px solid ${({ theme }) => theme.palette.common.black};
    color: ${({ theme }) => theme.palette.primary.contrastText};
  }
`;
export default ProfilePosts;