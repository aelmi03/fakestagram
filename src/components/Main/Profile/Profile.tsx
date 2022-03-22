import styled from "styled-components";
import { selectUser } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";

const Profile = () => {
  const user = useAppSelector(selectUser);
  console.log(user);
  console.log(user.profilePicture);
  return (
    <ProfileWrapper>
      <ProfileImage src={user.profilePicture} />
    </ProfileWrapper>
  );
};
const ProfileWrapper = styled.div``;
const ProfileImage = styled.img`
  height: 50px;
  width: 50px;
`;
export default Profile;
