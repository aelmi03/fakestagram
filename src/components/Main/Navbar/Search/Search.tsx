import styled, { css } from "styled-components";
import SearchResult from "./SearchResult";
import { selectUser, User } from "../../../../features/user/userSlice";
import { useAppSelector } from "../../../../app/hooks";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import FlexContainer from "../../../utils/FlexContainer";
import { PostTextBold } from "../../../utils/Texts";
import { useNavigate } from "react-router-dom";
interface RecentSearch {
  id: string;
  timestamp: Timestamp;
}
const Search = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [isFocus, setIsFocus] = useState(false);
  const [width] = useState(window.innerWidth);
  const [searchResults, setSearchResults] = useState<RecentSearch[]>([]);
  const [updateRecentSearches, setUpdateRecentSearches] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [previousSearchValue, setPreviousSearchValue] = useState("");
  const deleteRecentSearch = (userToRemove: User) => {
    const newRecentSearches = recentSearches.filter(
      (recentUser) => recentUser.id !== userToRemove.id
    );
    const newSearchResults = searchResults.filter(
      (searchResult) => searchResult.id !== userToRemove.id
    );
    const recentSearchesDoc = doc(getFirestore(), `recentSearches/${user.id}`);
    setDoc(recentSearchesDoc, {
      recentSearches: newSearchResults,
    });
    setSearchResults(newSearchResults);
    setRecentSearches(newRecentSearches);
  };
  const clearAllRecentSearches = () => {
    const recentSearchesDoc = doc(getFirestore(), `recentSearches/${user.id}`);
    setDoc(recentSearchesDoc, {
      recentSearches: [],
    });
    setSearchResults([]);
    setRecentSearches([]);
  };
  const onSearchResultClick = (clickedUser: User) => {
    console.log(searchResults);
    const filteredSearchResults = searchResults.filter(
      (recentUser) => recentUser.id !== clickedUser.id
    );
    console.log(clickedUser.id, ";)");
    const newRecentSearches = [
      { id: clickedUser.id, timestamp: new Date() },
      ...filteredSearchResults,
    ];
    console.log(newRecentSearches);
    const recentSearchesDoc = doc(getFirestore(), `recentSearches/${user.id}`);
    setDoc(recentSearchesDoc, {
      recentSearches: newRecentSearches,
    });
    setIsFocus(false);
    setSearchValue("");
    setUpdateRecentSearches((prev) => !prev);
    navigate(`../profile/${clickedUser.id}`);
  };
  useEffect(() => {
    const getResults = async () => {
      if (results.length === 0 && searchValue === "") return;
      if (
        results.length === 0 &&
        searchValue.startsWith(previousSearchValue) &&
        searchValue !== "" &&
        previousSearchValue !== ""
      )
        return;

      console.log("WE LITTT");
      const resultsQuery = query(collection(getFirestore(), "users"));
      const resultsDocs = (await getDocs(resultsQuery)).docs
        .map((doc) => doc.data() as User)
        .filter(
          (user) => user.username.startsWith(searchValue) && searchValue !== ""
        );
      setResults(resultsDocs);
    };
    getResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  useEffect(() => {
    const getRecentSearches = async () => {
      if (user.id === undefined) return null;
      console.log("BEFORE");
      const recentSearchesDoc = doc(
        getFirestore(),
        `recentSearches/${user.id}`
      );
      console.log("AFTER");

      const recentSearches = (await getDoc(recentSearchesDoc)).data()
        ?.recentSearches as RecentSearch[];
      if (recentSearches === undefined) return;
      recentSearches.sort(
        (a, z) =>
          z.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()
      );
      const recentSearchResults: User[] = await Promise.all(
        recentSearches.map(async (recentUser): Promise<User> => {
          const userDoc = doc(getFirestore(), `users/${recentUser.id}`);
          const userSnapshot = await getDoc(userDoc);
          return userSnapshot.data() as User;
        })
      );
      setSearchResults(recentSearches);
      setRecentSearches(recentSearchResults);
      console.log(recentSearches, "recent-searches");
      console.log(recentSearchResults, "recentSearch-results");
    };
    getRecentSearches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRecentSearches, user.id]);
  return (
    <SearchWrapper width={width}>
      <ClickWrapper
        onClick={() => {
          if (isFocus === true) {
            setIsFocus(false);
          }
        }}
        isFocus={isFocus}
        width={width}
        data-testid="Click Wrapper"
      />
      <SearchInput
        placeholder="🔍 Search"
        onFocus={() => setIsFocus(true)}
        value={searchValue}
        onChange={(e) => {
          setPreviousSearchValue(searchValue);
          setSearchValue(e.target.value);
        }}
        width={width}
      />

      <SearchesContainer
        isFocus={isFocus}
        width={width}
        data-testid="Searches Container"
      >
        {results.length !== 0 && searchValue !== ""
          ? results.map((user) => (
              <SearchResult
                user={user}
                key={user.id}
                onSearchResultClick={onSearchResultClick}
              />
            ))
          : null}
        {results.length === 0 && searchValue !== "" ? (
          <NoResultsText width={width}>No results found.</NoResultsText>
        ) : null}
        {recentSearches.length !== 0 && searchValue === "" ? (
          <React.Fragment>
            <FlexContainer direction="row" justifyContent="space-between">
              <RecentText>Recent</RecentText>
              <ClearAllTextButton onClick={clearAllRecentSearches}>
                Clear All
              </ClearAllTextButton>
            </FlexContainer>
            {recentSearches.map((user) => (
              <FlexContainer
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                key={user.id}
                data-testid="Recent Search Result"
              >
                <SearchResult
                  user={user}
                  key={user.id}
                  onSearchResultClick={onSearchResultClick}
                  onDeleteIconClick={deleteRecentSearch}
                />
              </FlexContainer>
            ))}
          </React.Fragment>
        ) : null}
        {recentSearches.length === 0 && searchValue === "" ? (
          <NoResultsText width={width}>No recent searches.</NoResultsText>
        ) : null}
      </SearchesContainer>
      <UpwardsTriangle isFocus={isFocus} width={width} />
    </SearchWrapper>
  );
};

const SearchInput = styled.input<{ width: number }>`
  background-color: ${({ theme }) => theme.palette.primaryLight};
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  font-size: 1.4rem;
  border-radius: 5px;
  width: 100%;
  padding: 0.8rem 2rem;
  position: relative;

  &:focus {
    border: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  }
  ${({ width }) =>
    width >= 768 &&
    css`
      width: 268px;
      background-color: ${({ theme }) => theme.palette.neutral};
    `}
`;
const ClickWrapper = styled.div<{ isFocus: boolean; width: number }>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  pointer-events: auto;
  z-index: 12;
  ${({ isFocus }) =>
    isFocus === false &&
    css`
      display: none;
    `}
  ${({ width }) =>
    width < 768 &&
    css`
      display: none;
    `}
`;
const NoResultsText = styled.p<{ width: number }>`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.darkGrey};
  font-weight: 400;
  margin-top: 2rem;
  margin: 0 auto;
  ${({ width }) =>
    width >= 768 &&
    css`
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    `}
`;

const UpwardsTriangle = styled.div<{ isFocus: boolean; width: number }>`
  display: none;
  background: ${({ theme }) => theme.palette.primaryLight};
  border: 1px solid ${({ theme }) => theme.palette.primaryLight};
  bottom: -6px;
  box-shadow: 0 0 5px 1px rgb(0 0 0 / 10%);
  height: 20px;
  width: 20px;
  position: absolute;
  transform: rotate(45deg);
  margin-top: 10px;
  right: 45%;
  top: 29px;
  ${({ width, isFocus }) =>
    isFocus === true &&
    width >= 768 &&
    css`
      display: block;
    `}
`;
const SearchWrapper = styled.div<{ width: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  padding: 1rem 1.1rem;
  gap: 0.8rem;
  ${({ width }) =>
    width >= 768 &&
    css`
      padding: 0rem;
      gap: 0rem;
      width: 268px;
    `}
`;
const SearchesContainer = styled.div<{ isFocus: boolean; width: number }>`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  gap: 1.2rem;
  padding: 0.8rem 0rem;
  overflow-y: scroll;
  position: relative;
  grid-auto-rows: max-content;
  z-index: 13;
  & > {
  }
  ${({ isFocus, width }) =>
    isFocus === false &&
    width >= 768 &&
    css`
      display: none;
    `}
  ${({ isFocus, width }) =>
    isFocus === true &&
    width >= 768 &&
    css`
      position: absolute;
      right: -50px;
      top: 50px;
      width: 375px;
      height: 410px;
      border-radius: 5px;
      border: none;
      padding: 1rem;
      box-shadow: 0 0 5px 1px rgb(0 0 0 / 10%);
    `}
`;
const RecentText = styled(PostTextBold)`
  font-weight: 600;
  font-size: 1.6rem;
`;
const ClearAllTextButton = styled.button`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  font-weight: 600;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  color: ${({ theme }) => theme.palette.secondary.main};
`;
export default Search;
