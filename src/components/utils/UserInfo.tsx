import FlexContainer from "./FlexContainer";
import styled, { css } from "styled-components";
import { User } from "../../features/user/userSlice";
interface IProps {
  user: User;
  width: string;
  onClick?: (user: User) => void;
  largerImage?: boolean;
}
const UserInfo = ({ user, width, onClick, largerImage }: IProps) => {
  return (
    <FlexContainer
      direction="row"
      gap="0.7rem"
      width={width}
      cursor="pointer"
      onClick={onClick ? () => onClick(user) : () => {}}
      alignItems="center"
    >
      <UserImage
        src={user.profilePicture}
        alt="Profile Picture"
        largerImage={largerImage}
      />
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

const UserImage = styled.img<{ largerImage?: boolean }>`
  height: 44px;
  width: 44px;
  min-width: 44px;
  border-radius: 50%;
  ${({ largerImage }) =>
    largerImage === true &&
    css`
      height: 60px;
      width: 60px;
      min-width: 60px;
    `}
`;

export default UserInfo;
