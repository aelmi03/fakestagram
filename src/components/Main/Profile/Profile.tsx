import styled from "styled-components";
import { selectUser, User } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import ProfilePosts from "./ProfilePosts";
import EditProfileModal from "./EditProfileModal";
import { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useParams } from "react-router-dom";
import {
  doc,
  DocumentSnapshot,
  getDoc,
  getFirestore,
} from "firebase/firestore";

const Profile = () => {
  let params = useParams();
  const [profileUser, setProfileUser] = useState<User>({} as User);
  useEffect(() => {
    const getProfileUser = async () => {
      const profileDoc = doc(getFirestore(), `users/${params.userID}`);
      return await getDoc(profileDoc);
    };
    getProfileUser().then((doc: DocumentSnapshot) => {
      setProfileUser(doc.data() as User);
    });
  }, [params.userID]);
  console.log(profileUser);
  const user = useAppSelector(selectUser);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const toggleEditProfileModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditProfileModal((prevBoolean) => !prevBoolean);
  };
  return (
    <ProfileWrapper>
      <ProfileDisplayContainer>
        <ProfileImage src={user.profilePicture} />
        <ProfileContainer>
          <ProfileInformationContainer>
            <OverflowContainer>
              <ProfileName>{user.username}</ProfileName>
            </OverflowContainer>
            <ButtonsContainer>
              <ProfileButton onClick={toggleEditProfileModal}>
                Edit Profile
              </ProfileButton>
              <ProfileButton onClick={() => signOut(getAuth())}>
                Log out
              </ProfileButton>
            </ButtonsContainer>
          </ProfileInformationContainer>
          <ProfileUserInfo>
            <BoldInfo>
              0 <ProfileInfo>posts</ProfileInfo>
            </BoldInfo>
            <BoldInfo>
              2 <ProfileInfo>followers</ProfileInfo>
            </BoldInfo>
            <BoldInfo>
              3 <ProfileInfo>following</ProfileInfo>
            </BoldInfo>
          </ProfileUserInfo>
          <InformationContainer>
            <BoldInfo>{user.fullName}</BoldInfo>
            <ProfileInfo>{user.biography}</ProfileInfo>
          </InformationContainer>
        </ProfileContainer>
      </ProfileDisplayContainer>

      <ProfilePosts profileUser={profileUser} />
      {showEditProfileModal ? (
        <EditProfileModal toggleEditProfileModal={toggleEditProfileModal} />
      ) : null}
    </ProfileWrapper>
  );
};
const ProfileWrapper = styled.div`
  display: grid;
  padding: 1rem 0.6rem;
  gap: 2rem;
  position: relative;

  @media only screen and (min-width: 768px) {
    padding: 2rem 2rem;
  }

  @media only screen and (min-width: 1024px) {
    width: 80%;
    max-width: 80%;
    margin: 0 auto;
  }
`;
const ButtonsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 1.5rem;
  flex-grow: 1;
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
  @media only screen and (min-width: 768px) {
    width: 80%;
    position: static;
  }
`;
const ProfileInformationContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-flow: column nowrap;
  width: 100%;
  @media only screen and (min-width: 540px) {
    gap: 3rem;
    flex-flow: row nowrap;
    align-items: center;
  }
`;
const ProfileUserInfo = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 1.5rem;
  @media only screen and (min-width: 540px) {
    gap: 2.5rem;
  }
  @media only screen and (min-width: 768px) {
    gap: 4.2rem;
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
    justify-content: center;
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
  width: auto;
  @media only screen and (min-width: 540px) {
    gap: 2rem;
  }
  @media only screen and (min-width: 1024px) {
    width: 65%;
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
  font-size: 1.2rem;
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
  width: 15ch;
  @media only screen and (min-width: 375px) {
    width: 24ch;
  }
  @media only screen and (min-width: 540px) {
    width: 16ch;
  }
  @media only screen and (min-width: 768px) {
    min-width: 25ch;
  }
  @media only screen and (min-width: 1024px) {
    width: auto;
  }
`;
export default Profile;
