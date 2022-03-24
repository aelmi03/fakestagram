import styled from "styled-components";
import ModalTitle from "../../utils/ModalTitle";
import FlexContainer from "../../utils/FlexContainer";
import ModalLabel from "../../utils/ModalLabel";
import StyledInput from "../../SignUpAndLogin/StyledInput";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import Button from "../../utils/Button";

const EditProfileModal = () => {
  const user = useAppSelector(selectUser);
  return (
    <EditProfileWrapper>
      <EditProfileForm>
        <ModalTitle>Edit Profile</ModalTitle>
        <FlexContainer direction="column" gap="3rem" alignItems="center">
          <EditProfilePicture src={user.profilePicture} alt="profile avatar" />
          <EditProfileFileInput type="file" />
        </FlexContainer>
        <FlexContainer direction="row" gap="1rem">
          <ModalLabel>Full Name</ModalLabel>
          <EditModalInput />
        </FlexContainer>
        <FlexContainer direction="row" gap="1rem">
          <ModalLabel>Biography</ModalLabel>
          <ModalTextArea />
        </FlexContainer>
        <FlexContainer direction="row" gap="1rem" justifyContent="center">
          <Button color="red">Cancel</Button>
          <Button>Save Changes</Button>
        </FlexContainer>
      </EditProfileForm>
    </EditProfileWrapper>
  );
};
const EditProfileWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const EditProfileForm = styled.form`
  padding: 2rem 1rem;
  display: grid;
  justify-items: center;
  width: min(95%, 600px);
  gap: 4.5rem;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
const ModalTextArea = styled.textarea`
  flex-grow: 1;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  font-family: sans-serif;
  font-size: 1.1rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
`;
const EditModalInput = styled(StyledInput)`
  width: auto;
  flex-grow: 1;
`;

const EditProfileFileInput = styled.input`
  padding: 0.1rem;
  font-size: 1.3rem;
  width: 180px;
  font-family: ${({ theme }) => theme.primaryFont};
`;

const EditProfilePicture = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
`;
export default EditProfileModal;
