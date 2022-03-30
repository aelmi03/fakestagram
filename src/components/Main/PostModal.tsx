import { User } from "../../features/user/userSlice";
import ModalWrapper from "../utils/ModalWrapper";
import ReturnBack from "../utils/ReturnBack";
import Post from "../utils/PostInterface";
import Comments from "./Comments";
import styled from "styled-components";
import AddComment from "./AddComment";
import FlexContainer from "../utils/FlexContainer";
import { useState, useEffect } from "react";

interface IProps {
  post: Post;
  postUser: User;
  changeModalStatus: () => void;
}
const PostModal = ({ post, postUser, changeModalStatus }: IProps) => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResizeWindow = () => setWidth(window.innerWidth);
    // subscribe to window resize event "onComponentDidMount"
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      // unsubscribe "onComponentDestroy"
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);
  if (width >= 768) {
    return null;
  }
  return (
    <PostModalWrapper>
      <FlexContainer direction="column" height="100%">
        <FlexContainer direction="column" height="75%">
          <ReturnBack
            name="Comments"
            onClick={() => {
              changeModalStatus();
            }}
          />
          <Comments post={post} postUser={postUser} />
        </FlexContainer>

        <ReturnBackWrapper>
          <AddComment post={post} postUser={postUser} />
        </ReturnBackWrapper>
      </FlexContainer>
    </PostModalWrapper>
  );
};
const PostModalWrapper = styled(ModalWrapper)`
  z-index: 5;
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin-top: 5rem;
`;
const ReturnBackWrapper = styled.div`
  position: fixed;
  bottom: 6.5rem;
  left: 0;
  right: 0;
`;
export default PostModal;
