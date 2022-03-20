import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import React, { useRef, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, User } from "firebase/auth";
import FlexContainer from "../utils/FlexContainer";
import Label from "../utils/Label";
import { setUser } from "../../features/user/userSlice";
import {
  query,
  collection,
  getDocs,
  getFirestore,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import WarningText from "../utils/WarningText";
import { useAppDispatch } from "../../app/hooks";

const Signup = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [disabledButton, setDisabledButton] = useState(true);
  const [warningText, setWarningText] = useState("");
  function addUserToDB(user: User) {
    const userRef = doc(getFirestore(), "users", `${user.uid}`);

    setDoc(userRef, {
      fullName,
      username,
      id: user.uid,
      profilePicture:
        "https://firebasestorage.googleapis.com/v0/b/fakestagram-b535c.appspot.com/o/defaultProfile.jpg?alt=media&token=17d8452b-8df2-4b7d-8671-0c6fa2698703",
    });

    dispatch(
      setUser({
        fullName,
        username,
        id: user.uid,
        profilePicture:
          "https://firebasestorage.googleapis.com/v0/b/fakestagram-b535c.appspot.com/o/defaultProfile.jpg?alt=media&token=17d8452b-8df2-4b7d-8671-0c6fa2698703",
      })
    );
  }
  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("WASSSUPPPP");
    e.preventDefault();
    const usersQuery = query(
      collection(getFirestore(), "users"),
      where("username", "==", `${username}`)
    );

    const userDocs = await getDocs(usersQuery);
    if (userDocs.docs.length === 1) {
      setWarningText("Username is taken, please choose another one");
      return;
    }

    try {
      const user = (
        await createUserWithEmailAndPassword(getAuth(), emailAddress, password)
      ).user;
      addUserToDB(user);
      setWarningText("");
    } catch (e: any) {
      console.log(e);
      setWarningText(
        "Email address is already associated with a fakestagram account"
      );
      return;
    }
  };
  useEffect(() => {
    if (formRef.current?.checkValidity() === true) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [emailAddress, password, username, fullName]);

  return (
    <FormContainer ref={formRef} onSubmit={signUp}>
      <Heading>Fakestagram</Heading>
      <FlexContainer direction="column" alignItems="start" gap="0.3rem">
        <Label htmlFor="email">Email Address</Label>
        <StyledInput
          placeholder="Johndoe@gmail.com"
          required
          id="email"
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.currentTarget.value)}
          title="Email address"
        />
      </FlexContainer>
      <FlexContainer direction="column" alignItems="start" gap="0.3rem">
        <Label htmlFor="full name">Full Name</Label>
        <StyledInput
          placeholder="John Doe"
          required
          id="full name"
          value={fullName}
          onChange={(e) =>
            setFullName(e.currentTarget.value.replace(/[^a-zA-Z ]/g, ""))
          }
          title="Full name"
        />
      </FlexContainer>

      <FlexContainer direction="column" alignItems="start" gap="0.3rem">
        <Label htmlFor="username">Username</Label>
        <StyledInput
          placeholder="JohnDoe23"
          required
          id="username"
          value={username}
          onChange={(e) =>
            setUserName(
              e.currentTarget.value.replace(/\s/g, "").replace(/\W/g, "")
            )
          }
          title="Username"
        />
      </FlexContainer>
      <FlexContainer direction="column" alignItems="start" gap="0.3rem">
        <Label htmlFor="password">Password (minimum of 6 characters)</Label>
        <StyledInput
          type="password"
          required
          id="password"
          value={password}
          minLength={6}
          onChange={(e) => setPassword(e.currentTarget.value)}
          title="Password (minimum of 6 characters)"
        />
      </FlexContainer>
      <WarningText>{warningText}</WarningText>
      <FormButton disabled={disabledButton} type="submit" name="Sign Up">
        Sign up
      </FormButton>
    </FormContainer>
  );
};

export default Signup;
