import styled from "styled-components";
import React, { useRef, useState, useEffect } from "react";
import ModalTitle from "../../utils/ModalTitle";
import FlexContainer from "../../utils/FlexContainer";
import ModalLabel from "../../utils/ModalLabel";
import StyledInput from "../../SignUpAndLogin/StyledInput";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import Button from "../../utils/Button";
import WarningText from "../../utils/WarningText";
import {
  ref,
  getStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

const EditProfileModal = () => {
  const user = useAppSelector(selectUser);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [biography, setBiography] = useState<string>("");
  const [warningText, setWarningText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setProfilePicture(user.profilePicture);
    setFullName(user.fullName);
    setBiography(user.biography);
  }, [user]);

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
    console.log(filePath);
    const newImageRef = ref(getStorage(), filePath);
    console.log("ayo");
    // 3 - Generate a public URL for the file.
    await uploadBytesResumable(newImageRef, inputRef.current!.files![0]);
    const publicImageUrl = await getDownloadURL(newImageRef);
    return publicImageUrl;
  };
  const updateUserProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (fullName === "") {
      setWarningText("Please enter a valid full name that is not empty");
      return;
    }
    try {
      const userDoc = doc(getFirestore(), `users/${user.id}`);
      if (inputRef.current?.files?.[0]) {
        const publicImageUrl = await downloadImage();
        await updateDoc(userDoc, {
          fullName,
          biography,
          profilePicture: publicImageUrl,
        });
        console.log("updat3ed image");
      } else {
        await updateDoc(userDoc, {
          fullName,
          biography,
        });
      }
    } catch (e) {
      console.log(e);
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
        <FlexContainer direction="column" gap="1rem">
          <FlexContainer direction="row" gap="1rem" alignItems="center">
            <ModalLabel htmlFor="Full Name">Full Name</ModalLabel>
            <EditModalInput
              id="Full Name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
            }}
            value={biography}
          />
        </FlexContainer>

        <FlexContainer direction="row" gap="1rem" justifyContent="center">
          <Button onClick={(e) => e.preventDefault()} color="red">
            Cancel
          </Button>
          <Button onClick={updateUserProfile}>Save Changes</Button>
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
    padding: 2.5rem 5rem;
    justify-items: center;
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
