import styled, { css } from "styled-components";
import { selectUser, User } from "../../../features/user/userSlice";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Comment as PostComment } from "../../utils/PostInterface";
import FlexContainer from "../../utils/FlexContainer";
import { PostText, PostGreyText, PostTextBold } from "../../utils/Texts";
import { selectAllUsers } from "../../../features/users/usersSlice";
import { useAppSelector } from "../../../app/hooks";
interface IProps {
  comment: PostComment;
}
const Comment = ({ comment }: IProps) => {
  console.log("LOL");
  const users = useAppSelector(selectAllUsers);
  const user = useAppSelector(selectUser);
  const postUser = users.filter((user) => user.id === comment.user)[0] || user;
  const navigate = useNavigate();
  return (
    <FlexContainer direction="row" gap="1.5rem" alignItems="start">
      <CommentPicture
        src={postUser.profilePicture}
        alt="comment profile"
        cursor="pointer"
        onClick={() => navigate(`/profile/${postUser.id}`, { replace: true })}
      />
      <FlexContainer direction="column" gap="0.3rem">
        <PostTextBold
          cursor="pointer"
          onClick={() => navigate(`/profile/${postUser.id}`, { replace: true })}
        >
          {postUser.username}
          <PostText>&nbsp;&nbsp;{comment.content}</PostText>
        </PostTextBold>
        <SmallGreyText>{`${formatDistanceToNow(
          (comment.timestamp as Timestamp).toDate()
        )} ago`}</SmallGreyText>
      </FlexContainer>
    </FlexContainer>
  );
};

const CommentPicture = styled.img<{ cursor?: string }>`
  height: 32px;
  width: 32px;
  border-radius: 50%;
  position: relative;
  ${({ cursor }) =>
    cursor &&
    css`
      cursor: pointer;
    `}
`;
const SmallGreyText = styled(PostGreyText)`
  font-size: 1.2rem;
`;
export default Comment;
