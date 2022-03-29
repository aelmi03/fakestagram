import styled from "styled-components";
import Post from "../utils/PostInterface";
import { User } from "../../features/user/userSlice";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import FlexContainer from "../utils/FlexContainer";
import { PostText, PostGreyText, PostTextBold } from "../utils/Texts";
interface IProps {
  timestamp: Timestamp;
  content: string;
  user: User;
}
const Comment = ({ timestamp, content, user }: IProps) => {
  return (
    <FlexContainer direction="row" gap="1.5rem" alignItems="start">
      <CommentPicture src={user.profilePicture} />
      <FlexContainer direction="column" gap="0.5rem">
        <PostTextBold>
          {user.username}
          <PostText>&nbsp;&nbsp;{content}</PostText>
        </PostTextBold>
        <SmallGreyText>{formatDistanceToNow(timestamp.toDate())}</SmallGreyText>
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
  font-size: 1.2rem;
`;
export default Comment;
// interface IProps {
//   timestamp: Timestamp;
//   content: string;
//   user: User;
// }
// const Comment = ({ timestamp, content, user }: IProps) => {
//   return (
//     <FlexContainer direction="row" gap="1.5rem" alignItems="start">
//       <CommentPicture src={user.profilePicture} />
//       <FlexContainer direction="column" gap="0.5rem">
//         <PostTextBold>
//           {user.username}
//           <PostText>&nbsp;&nbsp;{content}</PostText>
//         </PostTextBold>
//         <SmallGreyText>{formatDistanceToNow(timestamp.toDate())}</SmallGreyText>
//       </FlexContainer>
//     </FlexContainer>
//   );
// };
