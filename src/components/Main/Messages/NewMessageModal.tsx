import styled from "styled-components";
import ModalWrapper from "../../utils/ModalWrapper";
import ReturnBack from "../../utils/ReturnBack";
interface IProps {
  toggleModal: () => void;
}
const NewMessageModal = ({ toggleModal }: IProps) => {
  return (
    <ModalWrapper onClick={toggleModal}>
      <NewMessageModalWrapper onClick={(e) => e.stopPropagation()}>
        <ReturnBack
          name="New Message"
          onClick={toggleModal}
          staticPositioning={true}
        />
      </NewMessageModalWrapper>
    </ModalWrapper>
  );
};
const NewMessageModalWrapper = styled.div`
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  height: 100%;
  max-height: 500px;
  width: min(100%, 600px);
  @media only screen and (min-width: 540px) {
    border-radius: 8px;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
export default NewMessageModal;
