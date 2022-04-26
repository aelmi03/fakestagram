import { useEffect, useState } from "react";
import styled from "styled-components";
import FlexContainer from "../../utils/FlexContainer";
import ModalWrapper from "../../utils/ModalWrapper";
import ReturnBack from "../../utils/ReturnBack";
import { useAppDispatch } from "../../../app/hooks";
import { query, collection, getFirestore, getDocs } from "firebase/firestore";
import { messageUser } from "../../utils/utilityFunctions";
import UserInfo from "../../utils/UserInfo";
import { selectUser, User } from "../../../features/user/userSlice";
import {} from "../../../features/chatRooms/chatRoomsSlice";
import { PostGreyText } from "../../utils/Texts";
import { useAppSelector } from "../../../app/hooks";
interface IProps {
  toggleModal: () => void;
}
const NewMessageModal = ({ toggleModal }: IProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [previousSearchValue, setPreviousSearchValue] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const onUserClick = async (clickedUser: User) => {
    await messageUser(user, clickedUser, dispatch);
    toggleModal();
  };
  useEffect(() => {
    const getResults = async () => {
      if (results.length === 0 && searchValue === "") return;
      if (
        results.length === 0 &&
        searchValue.startsWith(previousSearchValue) &&
        searchValue !== "" &&
        previousSearchValue !== ""
      )
        return;

      console.log("WE LITTT");
      const resultsQuery = query(collection(getFirestore(), "users"));
      const resultsDocs = (await getDocs(resultsQuery)).docs
        .map((doc) => doc.data() as User)
        .filter(
          (filteredUser) =>
            filteredUser.username.startsWith(searchValue) &&
            searchValue !== "" &&
            filteredUser.id !== user.id
        );
      setResults(resultsDocs);
    };
    if (searchValue) {
      getResults();
    } else {
      setResults([] as User[]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  return (
    <ModalWrapper onClick={toggleModal} data-testid="Modal Wrapper">
      <NewMessageModalWrapper onClick={(e) => e.stopPropagation()}>
        <ReturnBack
          name="New Message"
          onClick={toggleModal}
          staticPositioning={true}
        />
        <NewMessageInputContainer>
          <LabelInputText htmlFor="New Message">To:</LabelInputText>
          <NewMessageInput
            name="New Message"
            id="New Message"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => {
              setPreviousSearchValue(searchValue);
              setSearchValue(e.target.value);
            }}
          />
        </NewMessageInputContainer>
        {results.length !== 0 ? (
          <FlexContainer
            direction="column"
            padding="0.5rem"
            overflowY="scroll"
            data-testid="Users Container"
          >
            {results.map((user) => (
              <UserContainer
                key={user.id}
                onClick={() => onUserClick(user)}
                data-testid={user.id}
              >
                <UserInfo
                  user={user}
                  width={`${window.innerWidth}`}
                  minimumSize="250px"
                  onClick={() => {}}
                />
              </UserContainer>
            ))}
          </FlexContainer>
        ) : (
          <FlexContainer direction="column" padding="0.5rem">
            {!searchValue ? (
              <ResultsText>
                You must enter a username above to see users.
              </ResultsText>
            ) : (
              <ResultsText>No results found.</ResultsText>
            )}
          </FlexContainer>
        )}
      </NewMessageModalWrapper>
    </ModalWrapper>
  );
};
const NewMessageModalWrapper = styled.div`
  display: grid;
  grid-template-rows: max-content max-content 1fr;
  background-color: ${({ theme }) => theme.palette.primaryLight};
  height: 100%;
  width: min(100%, 500px);
  padding: 0.3rem 0.2rem;
  @media only screen and (min-width: 540px) {
    border-radius: 5px;
    position: relative;
    left: 50%;
    top: 50%;
    padding: 0.3rem 0.4rem;
    transform: translate(-50%, -50%);
    max-height: 500px;
  }
`;
const UserContainer = styled.div`
  padding: 1rem 0rem;
  &:hover {
    background-color: ${({ theme }) => theme.palette.neutral};
  }
`;
const ResultsText = styled(PostGreyText)`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
const LabelInputText = styled.label`
  font-size: 1.6rem;
  font-weight: bold;
  font-family: ${({ theme }) => theme.primaryFont};
`;
const NewMessageInput = styled.input`
  font-family: ${({ theme }) => theme.primaryFont};
  font-size: 1.4rem;
`;
const NewMessageInputContainer = styled.div`
  padding: 1.5rem 0.5rem;
  width: 100%;
  display: grid;
  align-items: center;
  grid-template-columns: max-content 1fr;
  gap: 0.8rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.common.grey};
`;
export default NewMessageModal;
