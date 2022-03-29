import styled from "styled-components";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import FlexContainer from "../utils/FlexContainer";
import { PostCommentText, PostGreyText, PostTextBold } from "../utils/Texts";
// interface IProps {
//   timestamp: Timestamp;
//   content: string;
//   user: User;
// }
const Comment = () => {
  return (
    <FlexContainer direction="row" gap="1.5rem" alignItems="start">
      <CommentPicture src="http://www.espn.go.com/media/pg2/2005/0727/photo/kobead_275.jpg" />
      <FlexContainer direction="column" gap="0.5rem">
        <PostTextBold>
          abdidaboss123
          <PostCommentText>
            &nbsp;&nbsp;dope photo my guy that shit was super hot fire
          </PostCommentText>
        </PostTextBold>
        <SmallGreyText> 2h</SmallGreyText>
      </FlexContainer>
    </FlexContainer>
  );
};

const CommentPicture = styled.img`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  position: relative;
  top: 2px;
`;
const SmallGreyText = styled(PostGreyText)`
  font-size: 1.15rem;
`;
export default Comment;
