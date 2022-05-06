import styled, { css } from "styled-components";
import { selectUser, User } from "../../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import ProfilePosts from "./ProfilePosts";
import EditProfileModal from "./EditProfileModal";
import React, { useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getFirestore, onSnapshot, Unsubscribe } from "firebase/firestore";
import {
  followsOtherUser,
  getFollowers,
  getProfileUserPosts,
  messageUser,
  updateFollowing,
} from "../../utils/utilityFunctions";
import Post from "../../utils/PostInterface";
import StandardPost from "../Posts/StandardPost";
import Modal from "../Posts/Modal";
import ReturnBack from "../../utils/ReturnBack";
import { checkEquality } from "../../utils/utilityFunctions";
import { selectAllUsers } from "../../../features/users/usersSlice";
import { BasicText } from "../../utils/Texts";

const Profile = () => {
  let params = useParams();
  const user = useAppSelector(selectUser, checkEquality);
  const users = useAppSelector(selectAllUsers);
  const [profileUser, setProfileUser] = useState<User>({} as User);
  const [postToShow, setPostToShow] = useState<null | Post>(null);
  const [followers, setFollowers] = useState<string[]>([]);
  const [followersModalStatus, setFollowersModalStatus] = useState(false);
  const [followingModalStatus, setFollowingModalStatus] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const dispatch = useAppDispatch();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const navigate = useNavigate();
  const onMessageClicked = async (clickedUser: User) => {
    await messageUser(user, clickedUser, dispatch);
    navigate("/chats");
  };
  console.log(postToShow);
  const changePostToShow = (post: Post | null) => {
    setPostToShow(post);
  };
  const changeFollowersModalStatus = () => {
    setFollowersModalStatus((prevBoolean) => !prevBoolean);
  };
  const changeFollowingModalStatus = () => {
    setFollowingModalStatus((prevBoolean) => !prevBoolean);
  };
  const updatePostsCount = async () => {
    if (profileUser.savedPosts === undefined) return;
    const posts = await getProfileUserPosts(profileUser);
    setPostsCount(posts.length);
  };
  const updateFollowersCount = async () => {
    console.log("WE LIT");
    if (profileUser.savedPosts === undefined) return;
    const followers = await getFollowers(profileUser);
    const followersID = followers.map((user) => user.id);
    setFollowers(followersID);
  };

  useEffect(() => {
    console.log("MAIN PROFILE USE EFFECT");
    const getProfileUser = async () => {
      const profileDoc = doc(getFirestore(), `users/${params.userID}`);
      return onSnapshot(profileDoc, (snapshot) => {
        setProfileUser(snapshot.data() as User);
      });
    };
    let unsubscribe: Unsubscribe = (() => {}) as Unsubscribe;
    getProfileUser().then((unsubscribeFunction) => {
      unsubscribe = unsubscribeFunction;
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.userID]);
  useEffect(() => {
    updatePostsCount();
    updateFollowersCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUser]);
  useEffect(() => {
    setPostToShow(null);
    setFollowersModalStatus(false);
    setFollowingModalStatus(false);
  }, [params]);

  console.log(profileUser, "PROFILE " + params.userID);

  const toggleEditProfileModal = (e: React.MouseEvent) => {
    console.log(showEditProfileModal);
    e.preventDefault();
    e.stopPropagation();
    setShowEditProfileModal((prevBoolean) => !prevBoolean);
  };
  return (
    <ProfileWrapper>
      <ProfileDisplayContainer>
        <ProfileImage
          data-testid="Profile Picture"
          src={profileUser.profilePicture}
        />
        <ProfileContainer>
          <ProfileInformationContainer>
            <OverflowContainer>
              <ProfileName data-testid="Username">
                {profileUser.username}
              </ProfileName>
            </OverflowContainer>
            <ButtonsContainer>
              {user.id === profileUser.id ? (
                <React.Fragment>
                  <ProfileButton
                    onClick={toggleEditProfileModal}
                    name={"Edit Profile"}
                  >
                    Edit Profile
                  </ProfileButton>
                  <ProfileButton
                    onClick={() => signOut(getAuth())}
                    name={"Log out"}
                  >
                    Log out
                  </ProfileButton>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ProfileButton
                    following={followsOtherUser(user, profileUser)}
                    onClick={() => {
                      updateFollowing(user, profileUser);
                      updateFollowersCount();
                    }}
                    name={
                      followsOtherUser(user, profileUser)
                        ? "Following"
                        : "Follow"
                    }
                  >
                    {followsOtherUser(user, profileUser)
                      ? "Following"
                      : "Follow"}
                  </ProfileButton>
                  <ProfileButton onClick={() => onMessageClicked(profileUser)}>
                    Message
                  </ProfileButton>
                </React.Fragment>
              )}
            </ButtonsContainer>
          </ProfileInformationContainer>
          <ProfileUserInfo>
            <BasicText fontWeight="700" fontSize="1.4rem" data-testid="Posts">
              {postsCount} <ProfileInfo>posts</ProfileInfo>
            </BasicText>
            <BasicText
              fontWeight="700"
              fontSize="1.4rem"
              cursor="pointer"
              data-testid="Followers"
              onClick={changeFollowersModalStatus}
            >
              {followers.length} <ProfileInfo>followers</ProfileInfo>
            </BasicText>
            <BasicText
              fontWeight="700"
              fontSize="1.4rem"
              cursor="pointer"
              data-testid="Following"
              onClick={changeFollowingModalStatus}
            >
              {profileUser.following?.length}{" "}
              <ProfileInfo>following</ProfileInfo>
            </BasicText>
          </ProfileUserInfo>
          <InformationContainer>
            <BasicText
              fontWeight="700"
              fontSize="1.4rem"
              cursor="pointer"
              data-testid="Full Name"
            >
              {profileUser.fullName}
            </BasicText>
            <ProfileInfo data-testid="Biography">
              {profileUser.biography}
            </ProfileInfo>
          </InformationContainer>
        </ProfileContainer>
      </ProfileDisplayContainer>
      <ProfilePosts
        profileUser={profileUser}
        changePostToShow={changePostToShow}
        key={profileUser.id}
      />
      {showEditProfileModal ? (
        <EditProfileModal toggleEditProfileModal={toggleEditProfileModal} />
      ) : null}
      {followersModalStatus === true && (
        <Modal
          name="Followers"
          usersID={followers}
          changeModalStatus={changeFollowersModalStatus}
          noUsersMessage="This user has no followers."
          data-testid="Followers Modal"
        />
      )}
      {followingModalStatus === true && (
        <Modal
          name="Following"
          usersID={profileUser.following}
          changeModalStatus={changeFollowingModalStatus}
          noUsersMessage="This user is not following anyone."
          data-testid="Following MOdal"
        />
      )}
      {postToShow !== null && (
        <SelectedPostWrapper key={postToShow.id}>
          <ReturnBack name="Posts" onClick={() => changePostToShow(null)} />
          <StandardPost
            post={postToShow}
            postUser={
              postToShow.postedBy === user.id
                ? user
                : users.filter((user) => user.id === postToShow.postedBy)[0]
            }
            isOnHomePosts={false}
            changePostToShow={changePostToShow}
          />
        </SelectedPostWrapper>
      )}
    </ProfileWrapper>
  );
};
const ProfileWrapper = styled.div`
  display: grid;
  padding: 1rem 0.6rem;
  gap: 2rem;
  @media only screen and (min-width: 768px) {
    padding: 2rem 2rem;
  }

  @media only screen and (min-width: 1024px) {
    max-width: 985px;
    margin: 0 auto;
  }
`;
const SelectedPostWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  overflow: scroll;
  z-index: 35;
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
    gap: 2rem;
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
    gap: 5rem;
  }
  @media only screen and (min-width: 1024px) {
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
    min-width: 45%;
  }
`;
const ProfileImage = styled.img`
  height: 77px;
  min-width: 77px;
  width: 77px;
  border-radius: 50%;
  @media only screen and (min-width: 411px) {
    height: 85px;
    width: 85px;
    min-width: 85px;
  }
  @media only screen and (min-width: 768px) {
    height: 110px;
    width: 110px;
    min-width: 110px;
  }
  @media only screen and (min-width: 1024px) {
    height: 150px;
    width: 150px;
    min-width: 150px;
  }
`;
const ProfileInfo = styled.div`
  display: inline;
  font-size: 1.4rem;
  font-weight: 500;
  font-family: ${({ theme }) => theme.primaryFont};

  @media only screen and (min-width: 540px) {
    font-size: 1.5rem;
  }
`;

const ProfileButton = styled.button<{ following?: boolean }>`
  background-color: ${({ theme }) => theme.palette.primaryLight};
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  padding: 0.7rem 0.9rem;
  font-weight: 600;
  border-radius: 5px;

  @media only screen and (min-width: 540px) {
    font-size: 1.6rem;
    padding: 0.7rem 0.9rem;
  }
  @media only screen and (min-width: 768px) {
    font-size: 1.75rem;
    padding: 0.9rem 1.05rem;
  }
  @media only screen and (min-width: 768px) {
    min-width: 120px;
  }
  ${({ following }) =>
    following === false &&
    css`
      color: ${({ theme }) => theme.palette.common.white};
      background-color: ${({ theme }) => theme.palette.secondary.main};
    `}
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
  max-width: 20ch;
  @media only screen and (min-width: 540px) {
    max-width: 18.2ch;
  }
  @media only screen and (min-width: 768px) {
    max-width: 30ch;
  }
  @media only screen and (min-width: 1024px) {
    max-width: 60ch;
  }
`;
export default Profile;
