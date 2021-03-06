import styled, { css } from "styled-components";
import { useAppSelector } from "../../../app/hooks";
import UserInfo from "../../utils/UserInfo";
import React, { useState, useEffect } from "react";
import { selectUser, User } from "../../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import FlexContainer from "../../utils/FlexContainer";
import { signOut, getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  where,
  limit,
  query,
  getDocs,
} from "firebase/firestore";
import {
  updateFollowing,
  followsOtherUser,
} from "../../utils/utilityFunctions";
const Suggestions = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const onUserClicked = (clickedUser: User) => {
    navigate(`/profile/${clickedUser.id}`, { replace: true });
  };
  useEffect(() => {
    const getSuggestedAccounts = async () => {
      const suggestedUsersQuery = query(
        collection(getFirestore(), "users"),
        where("id", "not-in", [...user.following, user.id]),
        limit(5)
      );
      const suggestedUsersDocs = await getDocs(suggestedUsersQuery);
      const suggestedUserData = suggestedUsersDocs.docs.map(
        (doc) => doc.data() as User
      );
      setSuggestedUsers(suggestedUserData);
    };
    if (!user.id) return;
    getSuggestedAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);
  return (
    <SuggestionsWrapper>
      <FlexContainer
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        data-testid="User Profile"
      >
        <UserInfo
          user={user}
          largerImage={true}
          width="max-content"
          onClick={onUserClicked}
        />
        <SuggestionsText onClick={() => signOut(getAuth())}>
          Log Out
        </SuggestionsText>
      </FlexContainer>
      {suggestedUsers.length !== 0 ? (
        <FlexContainer direction="column" gap="1.5rem">
          <SuggestionsTitle>Suggestions For You</SuggestionsTitle>
          <FlexContainer
            direction="column"
            gap="1.5rem"
            data-testid="Suggested Users Container"
          >
            {suggestedUsers.map((suggestedUser) => (
              <FlexContainer
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                key={suggestedUser.id}
                data-testid={`${suggestedUser.id}`}
              >
                <UserInfo
                  user={suggestedUser}
                  width="max-content"
                  onClick={onUserClicked}
                />
                <SuggestionsText
                  onClick={() => updateFollowing(user, suggestedUser)}
                  following={followsOtherUser(user, suggestedUser)}
                >
                  {followsOtherUser(user, suggestedUser)
                    ? "Following"
                    : "Follow"}
                </SuggestionsText>
              </FlexContainer>
            ))}
          </FlexContainer>
        </FlexContainer>
      ) : null}
    </SuggestionsWrapper>
  );
};

const SuggestionsWrapper = styled.div`
  display: grid;
  width: 100%;
  height: 80vh;
  min-width: 330px;
  position: sticky;
  top: 115px;
  gap: 3rem;
  grid-auto-rows: max-content;
  max-width: 330px;
`;
const SuggestionsTitle = styled.h4`
  font-size: 1.4rem;
  font-family: ${({ theme }) => theme.primaryFont};
  font-weight: 600;
  color: ${({ theme }) => theme.palette.darkGrey};
`;
const SuggestionsText = styled.p<{ following?: boolean }>`
  color: ${({ theme }) => theme.palette.secondary.main};
  font-size: 1.3rem;
  font-weight: 600;
  font-family: ${({ theme }) => theme.primaryFont};
  cursor: pointer;
  ${({ following }) =>
    following === true &&
    css`
      color: ${({ theme }) => theme.palette.primary.contrastText};
    `}
`;

export default Suggestions;
