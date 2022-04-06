import StyledInput from "../../SignUpAndLogin/StyledInput";
import styled from "styled-components";
import SearchResult from "./SearchResult";
import { selectUser, User } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
const Search = () => {
  const user = useAppSelector(selectUser);
  const [isFocus, setIsFocus] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const getResults = async () => {
      const resultsQuery = query(collection(getFirestore(), "users"));
      const resultsDocs = (await getDocs(resultsQuery)).docs
        .map((doc) => doc.data() as User)
        .filter(
          (user) => user.username.startsWith(searchValue) && searchValue !== ""
        );
      setResults(resultsDocs);
    };
    getResults();
  }, [searchValue]);
  return (
    <SearchWrapper>
      <SearchInput
        placeholder="🔍 Search"
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <SearchesContainer>
        {results.map((user) => (
          <SearchResult user={user} key={user.id} />
        ))}
      </SearchesContainer>
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
`;
const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  padding: 1rem 0.9rem;
  gap: 0.8rem;
`;
const SearchesContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  display: grid;
  border-top: 1px solid ${({ theme }) => theme.palette.common.grey};
  gap: 1rem;
  padding: 0.8rem 0rem;
  overflow-y: scroll;
  @media only screen and (min-width: 768px) {
    position: absolute;
    top: 50px;
    z-index: 5;
  }
`;

export default Search;
