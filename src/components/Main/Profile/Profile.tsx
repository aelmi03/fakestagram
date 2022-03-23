import styled from "styled-components";
import { selectUser } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import FlexContainer from "../../utils/FlexContainer";
import ProfilePosts from "./ProfilePosts";

const Profile = () => {
  const user = useAppSelector(selectUser);

  return (
    <ProfileWrapper>
      <ProfileDisplayContainer>
        <ProfileImage src={user.profilePicture} />
        <ProfileContainer>
          <ButtonsContainer>
            <OverflowContainer>
              <ProfileName>{user.username}</ProfileName>
            </OverflowContainer>
            <FlexContainer direction="row" gap="1rem">
              <ProfileButton>Edit Profile</ProfileButton>
              <ProfileButton>Log out</ProfileButton>
            </FlexContainer>
          </ButtonsContainer>
          <FlexContainer direction="row" gap="1.5rem">
            <BoldInfo>
              0 <ProfileInfo>posts</ProfileInfo>
            </BoldInfo>
            <BoldInfo>
              2 <ProfileInfo>followers</ProfileInfo>
            </BoldInfo>
            <BoldInfo>
              3 <ProfileInfo>following</ProfileInfo>
            </BoldInfo>
          </FlexContainer>
          <InformationContainer>
            <BoldInfo>{user.fullName}</BoldInfo>
            <ProfileInfo>
              I am the biggets dawg in a small pond im a shark on my mama
              forreal I am the biggets dawg in a small pond im a shark on my
              mama forreal I am the biggets dawg in a small pond im a shark on
              my mama forreal I am the biggets dawg in a small pond im a shark
              on my mama forreal
            </ProfileInfo>
          </InformationContainer>
        </ProfileContainer>
      </ProfileDisplayContainer>

      <ProfilePosts />
    </ProfileWrapper>
  );
};
const ProfileWrapper = styled.div`
  display: grid;
  padding: 1rem 0.6rem;
  gap: 2rem;
  width: 100%;
  @media only screen and (min-width: 768px) {
    padding: 2rem 2rem;
  }
  @media only screen and (min-width: 1024px) {
    width: 90%;
    align-content: center;
    margin: 0 auto;
    padding: 2rem 0rem;
  }
`;
const InformationContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 0.6rem;
  position: relative;
  right: 80px;
  @media only screen and (min-width: 411px) {
    right: 90px;
    gap: 0.8rem;
  }
  @media only screen and (min-width: 540px) {
    right: 110px;
  }
  @media only screen and (min-width: 540px) {
    position: static;
  }
`;
const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-flow: column nowrap;

  @media only screen and (min-width: 540px) {
    gap: 3rem;
    flex-flow: row nowrap;
    align-items: center;
  }
`;
const ProfileDisplayContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
  padding: 0rem 1rem;

  @media only screen and (min-width: 411px) {
    padding: 0rem 0rem 0rem 2rem;
  }
  @media only screen and (min-width: 540px) {
    gap: 3rem;
  }
  @media only screen and (min-width: 768px) {
    justify-content: center;
    gap: 5rem;
  }
  @media only screen and (min-width: 1024px) {
    justify-content: center;
    gap: 8rem;
  }
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: 1.5rem;

  @media only screen and (min-width: 768px) {
    width: 70%;
  }
  @media only screen and (min-width: 1024px) {
    width: 60%;
  }
`;
const ProfileImage = styled.img`
  height: 77px;
  width: 77px;
  border-radius: 50%;
  @media only screen and (min-width: 411px) {
    height: 85px;
    width: 85px;
  }
  @media only screen and (min-width: 768px) {
    height: 110px;
    width: 110px;
  }
  @media only screen and (min-width: 1024px) {
    height: 150px;
    width: 150px;
  }
`;
const ProfileInfo = styled.div`
  display: inline;
  font-size: 1.1rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.primaryFont};
  @media only screen and (min-width: 375px) {
    font-size: 1.4rem;
  }
  @media only screen and (min-width: 540px) {
    font-size: 1.5rem;
  }
`;
const BoldInfo = styled(ProfileInfo)`
  font-weight: bold;
`;

const ProfileButton = styled.button`
  background-color: ${({ theme }) => theme.palette.primaryLight};
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  font-size: 1.3rem;
  font-family: ${({ theme }) => theme.primaryFont};
  padding: 0.4rem 0.6rem;
  font-weight: 600;
  @media only screen and (min-width: 375px) {
    font-size: 1.4rem;
    padding: 0.7rem 0.9rem;
  }
  @media only screen and (min-width: 540px) {
    font-size: 1.6rem;
    padding: 0.7rem 0.9rem;
  }
  @media only screen and (min-width: 768px) {
    font-size: 1.75rem;
    padding: 0.85rem 1.05rem;
  }
`;
const ProfileName = styled.h2`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 2.2rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  @media only screen and (min-width: 768px) {
    font-size: 2.7rem;
  }
`;

const OverflowContainer = styled.div`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: max-content;
`;
export default Profile;
