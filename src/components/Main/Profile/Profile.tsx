import styled from "styled-components";
import { selectUser } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import FlexContainer from "../../utils/FlexContainer";
import ProfilePosts from "./ProfilePosts";

const Profile = () => {
  const user = useAppSelector(selectUser);

  return (
    <ProfileWrapper>
      <FlexContainer direction="row" gap="1rem">
        <ProfileImage src={user.profilePicture} />
        <ProfileContainer>
          <OverflowContainer>
            <ProfileName>{user.username}</ProfileName>
          </OverflowContainer>
          <FlexContainer direction="row" gap="1rem">
            <ProfileButton>Edit Profile</ProfileButton>
            <ProfileButton>Log out</ProfileButton>
          </FlexContainer>
          <FlexContainer direction="row" gap="1.5rem">
            <BoldInfo>
              0 <ProfileInfo>Posts</ProfileInfo>
            </BoldInfo>
            <BoldInfo>
              2 <ProfileInfo>Followers</ProfileInfo>
            </BoldInfo>
            <BoldInfo>
              3 <ProfileInfo>Following</ProfileInfo>
            </BoldInfo>
          </FlexContainer>
        </ProfileContainer>
      </FlexContainer>
      <FlexContainer direction="column" gap="0.6rem">
        <BoldInfo>{user.fullName}</BoldInfo>
        <ProfileInfo>I am a big adventurer of life</ProfileInfo>
      </FlexContainer>
      <ProfilePosts />
    </ProfileWrapper>
  );
};
const ProfileWrapper = styled.div`
  display: flex;
  padding: 1rem 0.6rem;
  flex-flow: column nowrap;
  gap: 2rem;
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 1.2rem;
`;
const ProfileImage = styled.img`
  height: 77px;
  width: 77px;
  border-radius: 50%;
`;
const ProfileInfo = styled.p`
  display: inline;
  font-size: 1.2rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.primaryFont};
`;
const BoldInfo = styled(ProfileInfo)`
  font-weight: bold;
`;

const ProfileButton = styled.button`
  background-color: ${({ theme }) => theme.palette.primaryLight};
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  font-size: 1.4rem;
  font-family: ${({ theme }) => theme.primaryFont};
  padding: 0.6rem 0.8rem;
  font-weight: 600;
`;
const ProfileName = styled.h2`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 2.2rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OverflowContainer = styled.div`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export default Profile;
