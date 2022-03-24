import styled from "styled-components";
import React, { useRef, useState } from "react";
import ModalTitle from "../../utils/ModalTitle";
import FlexContainer from "../../utils/FlexContainer";
import ModalLabel from "../../utils/ModalLabel";
import StyledInput from "../../SignUpAndLogin/StyledInput";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import Button from "../../utils/Button";

const EditProfileModal = () => {
  const user = useAppSelector(selectUser);
  const [profilePicture, setProfilePicture] = useState<string>(
    user.profilePicture
  );
  const [fullName, setFullName] = useState<string>(user.fullName);
  const [biography, setBiography] = useState<string>(user.biography);
  const inputRef = useRef<HTMLInputElement>(null);
  const onFileChange = () => {
    console.log("HEYY");
    const reader = new FileReader();
    reader.onload = function () {
      setProfilePicture(reader.result as string);
    };

    if (inputRef?.current?.files) {
      reader.readAsDataURL(inputRef.current.files[0]);
    }
  };
  return (
    <EditProfileWrapper>
      <EditProfileForm>
        <ModalTitle>Edit Profile</ModalTitle>
        <FlexContainer direction="column" gap="1.5rem" alignItems="center">
          <EditProfilePicture src={profilePicture} alt="profile avatar" />
          <ModalLabel htmlFor="Profile Picture">Profile Picture</ModalLabel>
          <EditProfileFileInput
            type="file"
            id="Profile Picture"
            onChange={onFileChange}
            ref={inputRef}
          />
        </FlexContainer>
        <FlexContainer direction="row" gap="1rem" alignItems="center">
          <ModalLabel htmlFor="Full Name">Full Name</ModalLabel>
          <EditModalInput
            id="Full Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const target = e.target as HTMLInputElement;
              setFullName(target.value);
            }}
            value={fullName}
          />
        </FlexContainer>
        <FlexContainer direction="row" gap="1rem" alignItems="center">
          <ModalLabel htmlFor="Biography">Biography</ModalLabel>
          <ModalTextArea
            id="Biography"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              setBiography(target.value);
            }}
            value={biography}
          />
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
  padding: 2rem 2rem;
  display: grid;
  justify-items: center;
  width: min(95%, 700px);
  overflow-y: scroll;
  max-height: 95vh;
  gap: 4.5rem;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  @media only screen and (min-width: 540px) {
    padding: 3rem 5rem;
    justify-items: center;
  }
`;
const ModalTextArea = styled.textarea`
  flex-grow: 1;
  padding: 0rem 0.3rem 8rem 0.3rem;
  border: 1px solid ${({ theme }) => theme.palette.common.grey};
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.1rem;
  background-color: ${({ theme }) => theme.palette.primary.main};
  resize: none;
  @media only screen and (min-width: 540px) {
    width: 80%;
    flex-grow: 0;
  }
`;
const EditModalInput = styled(StyledInput)`
  width: auto;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.primaryFont};

  @media only screen and (min-width: 540px) {
    width: 80%;
    flex-grow: 0;
  }
`;

const EditProfileFileInput = styled.input`
  padding: 0.1rem;
  font-size: 1.3rem;
  width: 180px;
  font-family: ${({ theme }) => theme.primaryFont};
  @media only screen and (min-width: 768px) {
    font-size: 1.4rem;
    width: 210px;
  }
`;

const EditProfilePicture = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  @media only screen and (min-width: 540px) {
    width: 150px;
    height: 150px;
  }
`;
export default EditProfileModal;
