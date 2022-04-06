import StyledInput from "../../SignUpAndLogin/StyledInput";
import styled from "styled-components";
import SearchResult from "./SearchResult";
import { selectUser } from "../../../features/user/userSlice";
import { useAppSelector } from "../../../app/hooks";
const Search = () => {
  const user = useAppSelector(selectUser);
  return (
    <SearchWrapper>
      <SearchInput placeholder="🔍 Search" />
      <SearchesContainer>
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
        <SearchResult user={user} />
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
`;

export default Search;
