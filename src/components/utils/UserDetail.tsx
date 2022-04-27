import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser, User } from "../../features/user/userSlice";
import Button from "./Button";
import FlexContainer from "./FlexContainer";
import UserInfo from "./UserInfo";
import { followsOtherUser, updateFollowing } from "./utilityFunctions";
interface IProps {
  otherUser: User;
}
const UserDetail = ({ otherUser }: IProps) => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const onUserClick = (clickedUser: User) => {
    navigate(`/profile/${clickedUser.id}`, { replace: true });
  };
  const onButtonClick = (clickedUser: User) => {
    updateFollowing(user, clickedUser);
  };
  return (
    <FlexContainer
      direction="row"
      justifyContent={user.id === otherUser.id ? "start" : "space-between"}
      key={otherUser.id}
      alignItems="center"
      data-testid={`${otherUser.id}`}
    >
      <UserInfo user={otherUser} width="max-content" onClick={onUserClick} />
      {user.id !== otherUser.id ? (
        followsOtherUser(user, otherUser) ? (
          <Button color="white" onClick={() => onButtonClick(otherUser)}>
            Following
          </Button>
        ) : (
          <Button onClick={() => onButtonClick(otherUser)}>Follow</Button>
        )
      ) : null}
    </FlexContainer>
  );
};

export default UserDetail;
