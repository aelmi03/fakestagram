import FlexContainer from "../../../utils/FlexContainer";
import { User } from "../../../../features/user/userSlice";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
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
        <UserImage src={user.profilePicture} alt="Profile Picture" />
        <FlexContainer direction="column" gap="0.3rem">
          <UsernameText>{user.username}</UsernameText>
          <FullNameText>{user.fullName}</FullNameText>
        </FlexContainer>
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
const FullNameText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.palette.darkGrey};
  font-weight: 400;
`;
const UsernameText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;

const UserImage = styled.img`
  height: 44px;
  width: 44px;
  border-radius: 50%;
`;
export default SearchResult;
