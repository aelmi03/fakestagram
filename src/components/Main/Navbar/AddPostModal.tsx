import React, { useState, useRef } from "react";
import styled from "styled-components";
import Button from "../../utils/Button";
import FlexContainer from "../../utils/FlexContainer";
import HorizontalLine from "../../utils/HorizontalLine";
import ModalInput from "../../utils/ModalInput";
import ModalLabel from "../../utils/ModalLabel";
import ModalTitle from "../../utils/ModalTitle";
import ModalWrapper from "../../utils/ModalWrapper";
import FileInput from "../../utils/StyledFileInput";
import WarningText from "../../utils/WarningText";

const AddPostModal = () => {
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
    };

    if (inputRef?.current?.files) {
      reader.readAsDataURL(inputRef.current.files[0]);
    }
  };
  return (
    <ModalWrapper>
      <AddPostForm onClick={(e) => e.stopPropagation()}>
        <FlexContainer direction="column" gap="0.8rem" alignItems="center">
          <ModalTitle>Add Post</ModalTitle>
          <HorizontalLine />
        </FlexContainer>
        <FlexContainer direction="column" gap="1.5rem" alignItems="center">
          <PostPicture src={postPicture} alt="user's post" />
          <WarningText>{pictureWarningText}</WarningText>
          <ModalLabel htmlFor="Profile Picture">Picture</ModalLabel>
          <FileInput
            type="file"
            id="Profile Picture"
            onChange={onFileChange}
            ref={inputRef}
          />
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
              maxLength={25}
            />
          </FlexContainer>
          <WarningText>{captionWarningText}</WarningText>
        </FlexContainer>
        <FlexContainer direction="row" gap="1rem" justifyContent="center">
          <Button color="red" name="Cancel">
            Cancel
          </Button>
          <Button name="Post">Post</Button>
        </FlexContainer>
      </AddPostForm>
    </ModalWrapper>
  );
};
const AddPostForm = styled.form`
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
  z-index: 100;
  @media only screen and (min-width: 540px) {
    padding: 2.5rem 5rem;
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
    width: 350px;
    height: 350px;
  }
  @media only screen and (min-width: 768px) {
    width: 420px;
    height: 420px;
  }
`;
export default AddPostModal;
