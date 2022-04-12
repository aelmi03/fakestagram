import FlexContainer from "../../../utils/FlexContainer";
import { User } from "../../../../features/user/userSlice";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import UserInfo from "../../../utils/UserInfo";
interface IProps {
  user: User;
  onSearchResultClick: (user: User) => void;
  onDeleteIconClick?: (user: User) => void;
}
const SearchResult = ({
  user,
  onSearchResultClick,
  onDeleteIconClick,
}: IProps) => {
  return (
    <SearchResultContainer
      onClick={() => onSearchResultClick(user)}
      data-testid="SearchResult Container"
    >
      <FlexContainer direction="row" gap="0.7rem">
        <UserInfo user={user} width="100%" />
        {onDeleteIconClick !== undefined ? (
          <AiOutlineClose
            onClick={(e) => {
              e.stopPropagation();
              onDeleteIconClick(user);
            }}
            data-testid="Delete Icon"
          />
        ) : null}
      </FlexContainer>
    </SearchResultContainer>
  );
};
const SearchResultContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  &:hover {
    background-color: rgba(0.1, 0.1, 0.1, 0.03);
  }
  svg {
    width: 30px;
    height: 30px;
    align-self: center;
  }
`;

export default SearchResult;
