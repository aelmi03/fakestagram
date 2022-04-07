import styled from "styled-components";
import SearchResult from "./SearchResult";
import { selectUser, User } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import FlexContainer from "../../utils/FlexContainer";
import { PostTextBold } from "../../utils/Texts";
import { AiOutlineClose } from "react-icons/ai";
const Search = () => {
  const user = useAppSelector(selectUser);
  const [isFocus, setIsFocus] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const deleteRecentSearch = (userToRemove: User) => {
    const newRecentSearches = recentSearches.filter(
      (recentUser) => recentUser.id !== userToRemove.id
    );
    const recentSearchesDoc = doc(getFirestore(), `recentSearches/${user.id}`);
    setDoc(recentSearchesDoc, {
      recentSearches: newRecentSearches.map((user) => user.id),
    });
    setRecentSearches(newRecentSearches);
  };
  const clearAllRecentSearches = () => {
    const recentSearchesDoc = doc(getFirestore(), `recentSearches/${user.id}`);
    setDoc(recentSearchesDoc, {
      recentSearches: [],
    });
    setRecentSearches([]);
  };
  useEffect(() => {
    const getResults = async () => {
      if (results.length === 0 && searchValue === "") return;
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
      const recentSearchesDoc = doc(
        getFirestore(),
        `recentSearches/${user.id}`
      );
      const recentSearches = (await getDoc(recentSearchesDoc)).data()
        ?.recentSearches as string[];
      if (recentSearches === undefined) return;
      const usersQuery = query(
        collection(getFirestore(), "users"),
        where("id", "in", recentSearches)
      );
      const resultsDocs = (await getDocs(usersQuery)).docs.map(
        (doc) => doc.data() as User
      );
      setRecentSearches(resultsDocs);
    };
    getRecentSearches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SearchWrapper>
      <SearchInput
        placeholder="🔍 Search"
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {results.length !== 0 && searchValue !== "" ? (
        <SearchesContainer>
          {results.map((user) => (
            <SearchResult user={user} key={user.id} />
          ))}
        </SearchesContainer>
      ) : null}
      {recentSearches.length !== 0 && searchValue === "" ? (
        <SearchesContainer>
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
            >
              <SearchResult user={user} key={user.id} />
              <AiOutlineClose onClick={() => deleteRecentSearch(user)} />
            </FlexContainer>
          ))}
        </SearchesContainer>
      ) : null}
    </SearchWrapper>
  );
};

const SearchInput = styled.input`
  background-color: ${({ theme }) => theme.palette.primaryLight};
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  font-size: 1.4rem;
  border-radius: 5px;
  width: 100%;
  padding: 0.8rem 2rem;
  &:focus {
    border: 1px solid ${({ theme }) => theme.palette.primary.contrastText};
  }
`;
const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  padding: 1rem 1.1rem;
  gap: 0.8rem;
`;
const SearchesContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  gap: 1.2rem;
  padding: 0.8rem 0rem;
  overflow-y: scroll;
  @media only screen and (min-width: 768px) {
    position: absolute;
    top: 50px;
    z-index: 5;
  }
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
