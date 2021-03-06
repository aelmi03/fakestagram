import React, { useEffect, useState } from "react";
import {
  collection,
  getFirestore,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import FlexContainer from "../../utils/FlexContainer";
import UserInfo from "../../utils/UserInfo";
import { useAppSelector } from "../../../app/hooks";
import { followsOtherUser } from "../../utils/utilityFunctions";
import { selectUser, User } from "../../../features/user/userSlice";
import Button from "../../utils/Button";
import styled from "styled-components";
import UserDetail from "../../utils/UserDetail";
const SuggestionsList = () => {
  const user = useAppSelector(selectUser);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  useEffect(() => {
    const getSuggestedAccounts = async () => {
      const suggestedUsersQuery = query(
        collection(getFirestore(), "users"),
        where("id", "not-in", [...user.following, user.id]),
        limit(50)
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
    <SuggestionsListWrapper>
      <SuggestionsListTitle>Suggestions For You</SuggestionsListTitle>
      <SuggestionsListContainer data-testid="SuggestionsList Container">
        {suggestedUsers.map((suggestedUser) => (
          <UserDetail otherUser={suggestedUser} key={suggestedUser.id} />
        ))}
      </SuggestionsListContainer>
    </SuggestionsListWrapper>
  );
};
const SuggestionsListContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  width: 95vw;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  @media only screen and (min-width: 768px) {
    max-width: 800px;
    padding: 0.95rem;
    border: 1px solid ${({ theme }) => theme.palette.common.grey};
  }
`;
const SuggestionsListWrapper = styled.div`
  display: grid;
  grid-auto-rows: max-content;
  gap: 2rem;
  width: 100%;
  padding: 3rem 0.5rem 7rem 0.5rem;
  justify-content: center;
`;
const SuggestionsListTitle = styled.h4`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  font-weight: 600;
  @media only screen and (min-width: 768px) {
    font-size: 1.9rem;
  }
`;

export default SuggestionsList;
