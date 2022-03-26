import styled from "styled-components";
import Button from "../../utils/Button";
import FlexContainer from "../../utils/FlexContainer";
import HorizontalLine from "../../utils/HorizontalLine";
import ModalInput from "../../utils/ModalInput";
import ModalLabel from "../../utils/ModalLabel";
import ModalPicture from "../../utils/ModalPicture";
import ModalTitle from "../../utils/ModalTitle";
import ModalWrapper from "../../utils/ModalWrapper";
import FileInput from "../../utils/StyledFileInput";

const AddPostModal = () => {
  return (
    <ModalWrapper>
      <AddPostForm onClick={(e) => e.stopPropagation()}>
        <FlexContainer direction="column" gap="0.8rem" alignItems="center">
          <ModalTitle>Add Post</ModalTitle>
          <HorizontalLine />
        </FlexContainer>
        <FlexContainer direction="column" gap="1.5rem" alignItems="center">
          <ModalPicture
            src={
              "https://booleanstrings.com/wp-content/uploads/2021/10/profile-picture-circle-hd.png"
            }
            alt="profile avatar"
          />
          <ModalLabel htmlFor="Profile Picture">Picture</ModalLabel>
          <FileInput type="file" id="Profile Picture" />
        </FlexContainer>
        <FlexContainer
          direction="row"
          gap="1.5rem"
          alignItems="center"
          justifyContent="center"
        >
          <ModalLabel htmlFor="caption">Caption</ModalLabel>
          <ModalInput id="caption" />
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

export default AddPostModal;
