import styled, { css } from "styled-components";
import { User } from "../../../features/user/userSlice";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import FlexContainer from "../../utils/FlexContainer";
import { PostText, PostGreyText, PostTextBold } from "../../utils/Texts";
interface IProps {
  timestamp: Timestamp;
  content: string;
  user: User;
}
const Comment = ({ timestamp, content, user }: IProps) => {
  const navigate = useNavigate();
  return (
    <FlexContainer direction="row" gap="1.5rem" alignItems="start">
      <CommentPicture
        src={user.profilePicture}
        alt="comment profile"
        cursor="pointer"
        onClick={() => navigate(`/profile/${user.id}`, { replace: true })}
      />
      <FlexContainer direction="column" gap="0.3rem">
        <PostTextBold
          cursor="pointer"
          onClick={() => navigate(`/profile/${user.id}`, { replace: true })}
        >
          {user.username}
          <PostText>&nbsp;&nbsp;{content}</PostText>
        </PostTextBold>
        <SmallGreyText>{`${formatDistanceToNow(
          timestamp.toDate()
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
