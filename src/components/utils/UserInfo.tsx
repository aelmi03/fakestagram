import FlexContainer from "./FlexContainer";
import styled from "styled-components";
import { User } from "../../features/user/userSlice";
interface IProps {
  user: User;
  width: string;
  onClick?: (user: User) => void;
}
const UserInfo = ({ user, width, onClick }: IProps) => {
  return (
    <FlexContainer
      direction="row"
      gap="0.7rem"
      width={width}
      cursor="pointer"
      onClick={onClick ? () => onClick(user) : () => {}}
    >
      <UserImage src={user.profilePicture} alt="Profile Picture" />
      <FlexContainer direction="column" gap="0rem">
        <OverflowContainer>
          <UsernameText>{user.username}</UsernameText>
        </OverflowContainer>
        <OverflowContainer>
          <FullNameText>{user.fullName}</FullNameText>
        </OverflowContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

const FullNameText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.palette.darkGrey};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
`;
const OverflowContainer = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
  @media only screen and (min-width: 414px) {
    max-width: 180px;
  }
  @media only screen and (min-width: 540px) {
    max-width: 220px;
  }
  @media only screen and (min-width: 768px) {
    max-width: 250px;
  }
`;
const UsernameText = styled.p`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.palette.primary.contrastText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserImage = styled.img`
  height: 44px;
  width: 44px;
  min-width: 44px;
  border-radius: 50%;
`;

export default UserInfo;
