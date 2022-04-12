import FlexContainer from "./FlexContainer";
import styled from "styled-components";
import { User } from "../../features/user/userSlice";
interface IProps {
  user: User;
}
const UserInfo = ({ user }: IProps) => {
  return (
    <FlexContainer direction="row" gap="0.7rem">
      <UserImage src={user.profilePicture} alt="Profile Picture" />
      <FlexContainer direction="column" gap="0.3rem">
        <UsernameText>{user.username}</UsernameText>
        <FullNameText>{user.fullName}</FullNameText>
      </FlexContainer>
    </FlexContainer>
  );
};

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

export default UserInfo;
