import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../../features/user/userSlice";
import FormButton from "../../utils/FormButton";
import FlexContainer from "../../utils/FlexContainer";
import HorizontalLine from "../../utils/HorizontalLine";
import ModalInput from "../../utils/ModalInput";
import ModalLabel from "../../utils/ModalLabel";
import ModalTitle from "../../utils/ModalTitle";
import Loader from "../../utils/Loader";
import ModalWrapper from "../../utils/ModalWrapper";
import FileInput from "../../utils/StyledFileInput";
import WarningText from "../../utils/WarningText";
interface IProps {
  toggleAddPostModal: (e: React.MouseEvent) => void;
}
const AddPostModal = ({ toggleAddPostModal }: IProps) => {
  const user = useAppSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [postPicture, setPostPicture] = useState(
    "https://firebasestorage.googleapis.com/v0/b/fakestagram-b535c.appspot.com/o/post-placeholder.jpg?alt=media&token=aad29630-6606-4b09-9bc7-ebd83d990548"
  );
  const [captionWarningText, setCaptionWarningText] = useState("");
  const [pictureWarningText, setPictureWarningText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const onFileChange = () => {
    const reader = new FileReader();
    reader.onload = function () {
      setPostPicture(reader.result as string);
      setPictureWarningText("");
    };

    if (inputRef?.current?.files) {
      reader.readAsDataURL(inputRef.current.files[0]);
    }
  };
  const downloadImage = async (id: string) => {
    const filePath = `${user.id}/posts/${id}`;
    const newImageRef = ref(getStorage(), filePath);
    await uploadBytesResumable(newImageRef, inputRef.current!.files![0]);
    const publicImageUrl = await getDownloadURL(newImageRef);
    return publicImageUrl;
  };
  const checkInputs = () => {
    let isValid: boolean = true;
    setCaptionWarningText(
      !caption ? "Caption cannot be empty, please enter a valid caption" : ""
    );
    setPictureWarningText(
      postPicture ===
        "https://firebasestorage.googleapis.com/v0/b/fakestagram-b535c.appspot.com/o/post-placeholder.jpg?alt=media&token=aad29630-6606-4b09-9bc7-ebd83d990548"
        ? "You must choose a picture to be able to post"
        : ""
    );
    if (
      !caption ||
      postPicture ===
        "https://firebasestorage.googleapis.com/v0/b/fakestagram-b535c.appspot.com/o/post-placeholder.jpg?alt=media&token=aad29630-6606-4b09-9bc7-ebd83d990548"
    ) {
      isValid = false;
    }

    return isValid;
  };
  const addPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (checkInputs() === false) return;

    try {
      setLoading(true);
      const postDoc = await addDoc(collection(getFirestore(), "posts"), {
        postedBy: user.id,
        comments: [],
        likes: [],
        caption,
        timestamp: serverTimestamp(),
      });
      const imgSrc = await downloadImage(postDoc.id);
      await updateDoc(postDoc, {
        id: postDoc.id,
        imgSrc,
      });
      toggleAddPostModal(e);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };
  return (
    <ModalWrapper data-testid="Add Post Wrapper" onClick={toggleAddPostModal}>
      <AddPostForm onClick={(e) => e.stopPropagation()}>
        <FlexContainer direction="column" gap="0.8rem" alignItems="center">
          <ModalTitle>Add Post</ModalTitle>
          <HorizontalLine />
        </FlexContainer>
        <FlexContainer direction="column" gap="1.5rem" alignItems="center">
          <PostPicture src={postPicture} alt="user's post" />
          <ModalLabel htmlFor="Profile Picture">Picture</ModalLabel>
          <FileInput
            type="file"
            id="Profile Picture"
            onChange={onFileChange}
            ref={inputRef}
          />
          <WarningText>{pictureWarningText}</WarningText>
        </FlexContainer>

        <FlexContainer direction="column" gap="0.8rem">
          <FlexContainer
            direction="row"
            gap="1.5rem"
            alignItems="center"
            justifyContent="center"
          >
            <ModalLabel htmlFor="caption">Caption</ModalLabel>
            <ModalInput
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={60}
            />
          </FlexContainer>
          <WarningText>{captionWarningText}</WarningText>
        </FlexContainer>
        {loading === true ? (
          <Loader />
        ) : (
          <FlexContainer direction="row" gap="1rem" justifyContent="center">
            <FormButton color="red" name="Cancel" onClick={toggleAddPostModal}>
              Cancel
            </FormButton>
            <FormButton name="Post" onClick={addPost}>
              Post
            </FormButton>
          </FlexContainer>
        )}
      </AddPostForm>
    </ModalWrapper>
  );
};
const AddPostForm = styled.form`
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

  @media only screen and (min-width: 540px) {
    justify-items: center;
  }
`;
const PostPicture = styled.img`
  width: 250px;
  height: 250px;
  @media only screen and (min-width: 375px) {
    width: 300px;
    height: 300px;
  }
  @media only screen and (min-width: 540px) {
    width: 370px;
    height: 350px;
  }
  @media only screen and (min-width: 768px) {
    width: 450px;
    height: 420px;
  }
`;
export default AddPostModal;
