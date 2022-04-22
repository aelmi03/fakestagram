import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";
import ModalTitle from "../../utils/ModalTitle";
import FlexContainer from "../../utils/FlexContainer";
import ModalLabel from "../../utils/ModalLabel";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import FormButton from "../../utils/FormButton";
import WarningText from "../../utils/WarningText";
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import HorizontalLine from "../../utils/HorizontalLine";
import ModalWrapper from "../../utils/ModalWrapper";
import ModalPicture from "../../utils/ModalPicture";
import FileInput from "../../utils/StyledFileInput";
import Loader from "../../utils/Loader";
import ModalInput from "../../utils/ModalInput";
interface IProps {
  toggleEditProfileModal: (e: React.MouseEvent) => void;
}
const EditProfileModal = ({ toggleEditProfileModal }: IProps) => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [biography, setBiography] = useState<string>("");
  const [warningText, setWarningText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setProfilePicture(user.profilePicture);
    setFullName(user.fullName);
    setBiography(user.biography);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFileChange = () => {
    const reader = new FileReader();
    reader.onload = function () {
      setProfilePicture(reader.result as string);
    };

    if (inputRef?.current?.files) {
      reader.readAsDataURL(inputRef.current.files[0]);
    }
  };
  const downloadImage = async () => {
    const filePath = `${user.id}/profile-picture`;
    const newImageRef = ref(getStorage(), filePath);
    console.log(inputRef.current!.files![0]);
    await uploadBytesResumable(newImageRef, inputRef.current!.files![0]);
    const publicImageUrl = await getDownloadURL(newImageRef);
    return publicImageUrl;
  };
  const updateUserProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (fullName === "") {
      setWarningText("Please enter a valid full name that is not empty");
      return;
    }
    try {
      setLoading(true);
      const userDoc = doc(getFirestore(), `users/${user.id}`);
      if (inputRef.current?.files?.[0]) {
        const publicImageUrl = await downloadImage();
        await updateDoc(userDoc, {
          fullName,
          biography,
          profilePicture: publicImageUrl,
        });
      } else {
        await updateDoc(userDoc, {
          fullName,
          biography,
        });
      }
      toggleEditProfileModal(e);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  return (
    <ModalWrapper onClick={toggleEditProfileModal} data-testid="Wrapper">
      <EditProfileForm onClick={(e) => e.stopPropagation()}>
        <FlexContainer direction="column" gap="0.8rem" alignItems="center">
          <ModalTitle>Edit Profile</ModalTitle>
          <HorizontalLine />
        </FlexContainer>
        <FlexContainer direction="column" gap="1.5rem" alignItems="center">
          <ModalPicture src={profilePicture} alt="profile avatar" />
          <ModalLabel htmlFor="Profile Picture">Profile Picture</ModalLabel>
          <FileInput
            type="file"
            id="Profile Picture"
            onChange={onFileChange}
            ref={inputRef}
          />
        </FlexContainer>
        <FlexContainer direction="column" gap="1rem">
          <FlexContainer direction="row" gap="1rem" alignItems="center">
            <ModalLabel htmlFor="Full Name">Full Name</ModalLabel>
            <ModalInput
              data-testid="full name"
              id="Full Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.stopPropagation();
                const target = e.target as HTMLInputElement;

                setFullName(target.value.replace(/[^a-zA-Z ]/g, ""));
              }}
              value={fullName}
              maxLength={28}
            />
          </FlexContainer>
          <WarningText>{warningText}</WarningText>
        </FlexContainer>

        <FlexContainer direction="row" gap="1rem" alignItems="start">
          <ModalLabel htmlFor="Biography">Biography</ModalLabel>
          <ModalTextArea
            id="Biography"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              setBiography(target.value);
              e.stopPropagation();
            }}
            value={biography}
          />
        </FlexContainer>
        {loading === true ? (
          <Loader />
        ) : (
          <FlexContainer direction="row" gap="1rem" justifyContent="center">
            <FormButton
              onClick={toggleEditProfileModal}
              color="red"
              name="Cancel"
            >
              Cancel
            </FormButton>
            <FormButton onClick={updateUserProfile} name="Save">
              Save Changes
            </FormButton>
          </FlexContainer>
        )}
      </EditProfileForm>
    </ModalWrapper>
  );
};

const EditProfileForm = styled.form`
  padding: 2rem;
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
  z-index: 15;
  @media only screen and (min-width: 540px) {
    padding: 2.5rem 5rem 8rem 5rem;
    justify-items: center;
  }
  @media only screen and (min-width: 768px) {
    padding: 2.5rem 5rem;
  }
`;

const ModalTextArea = styled.textarea`
  flex-grow: 1;
  padding: 0.3rem 0.3rem 8rem 0.3rem;
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

export default EditProfileModal;
