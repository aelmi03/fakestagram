import FlexContainer from "../../utils/FlexContainer";
import Comments from "./Comments";
import Comment from "./Comment";
import ReturnBack from "../../utils/ReturnBack";
import AddComment from "./AddComment";
import Post from "../../utils/PostInterface";
import { selectUser, User } from "../../../features/user/userSlice";
import styled from "styled-components";
import ModalWrapper from "../../utils/ModalWrapper";
import { useAppSelector } from "../../../app/hooks";
import { selectAllUsers } from "../../../features/users/usersSlice";
import HorizontalLine from "../../utils/HorizontalLine";
import { checkEquality } from "../../utils/utilityFunctions";
import { nanoid } from "@reduxjs/toolkit";
interface IProps {
  post: Post;
  changeModalStatus: () => void;
}
const SmallModal = ({ post, changeModalStatus }: IProps) => {
  const user = useAppSelector(selectUser, checkEquality);
  const users = useAppSelector(selectAllUsers);
  const postUser = users.filter((user) => user.id === post.postedBy)[0] || user;
  return (
    <SmallModalWrapper>
      <FlexContainer direction="column" height="100%">
        <FlexContainer
          direction="column"
          height="100%"
          overflowY="scroll"
          padding={"1.5rem 1.2rem;"}
        >
          <ReturnBack
            name="Comments"
            onClick={() => {
              changeModalStatus();
            }}
          />
          <FlexContainer direction="column" gap="1rem">
            <Comment
              comment={{
                content: post.caption,
                timestamp: post.timestamp,
                user: postUser.id,
                id: nanoid(),
              }}
            />
            <HorizontalLine />
          </FlexContainer>

          <Comments post={post} />
        </FlexContainer>
        <AddComment post={post} />
      </FlexContainer>
    </SmallModalWrapper>
  );
};
const SmallModalWrapper = styled(ModalWrapper)`
  z-index: 40;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-top: 5rem;
`;

export default SmallModal;
