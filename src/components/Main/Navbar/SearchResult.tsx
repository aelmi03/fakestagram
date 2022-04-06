import FlexContainer from "../../utils/FlexContainer";
import { PostTextBold, PostGreyText } from "../../utils/Texts";
import CircularUserImage from "../../utils/CircularUserImage";
import { User } from "../../../features/user/userSlice";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
interface IProps {
  user: User;
}
const SearchResult = ({ user }: IProps) => {
  const navigate = useNavigate();
  return (
    <SearchResultContainer onClick={() => navigate(`../profile/${user.id}`)}>
      <UserImage src={user.profilePicture} />
      <FlexContainer direction="column" gap="0.3rem">
        <UsernameText>{user.username}</UsernameText>
        <FullNameText>{user.fullName}</FullNameText>
      </FlexContainer>
    </SearchResultContainer>
  );
};
const SearchResultContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 0.7rem;
  cursor: pointer;
  align-items: center;
  &:hover {
    background-color: #f5f5f5;
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
