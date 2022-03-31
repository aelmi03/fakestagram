import ModalWrapper from "../utils/ModalWrapper";
import styled from "styled-components";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import CircularUserImage from "../utils/CircularUserImage";
import { PostTextBold } from "../utils/Texts";
import FlexContainer from "../utils/FlexContainer";
import { BsThreeDots } from "react-icons/bs";
import HorizontalLine from "../utils/HorizontalLine";
import React from "react";
import Comments from "./Comments";
interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const LargeModal = React.memo(
  ({ post, postUser, changeModalStatus }: IProps) => {
    console.log("large modal");
    return (
      <ModalWrapper>
        <LargeModalWrapper>
          <LargePostPicture src={post.imgSrc} alt="photo of the post" />
          <FlexContainer direction="column">
            <FlexContainer direction="column" gap="1rem">
              <FlexContainer
                direction="row"
                justifyContent="space-between"
                padding="1rem 1rem"
              >
                <FlexContainer direction="row" gap="0.4rem" alignItems="center">
                  <CircularUserImage
                    src={postUser.profilePicture}
                    alt={"avatar of profile user"}
                  />
                  <PostTextBold>{postUser.username}</PostTextBold>
                </FlexContainer>
                <BsThreeDots />
              </FlexContainer>
              <HorizontalLine />
            </FlexContainer>
            <Comments post={post} postUser={postUser} />
          </FlexContainer>
        </LargeModalWrapper>
      </ModalWrapper>
    );
  },
  (nextProps, prevProps) => nextProps.post === prevProps.post
);
const LargeModalWrapper = styled.div`
  display: grid;
  width: min(95%, 800px);
  max-height: 735px;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  position: fixed;
  grid-template-columns: 1fr 1fr;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;
const LargePostPicture = styled.img`
  width: 100%;
  aspect-ratio: 1/1.6;
`;
export default LargeModal;
