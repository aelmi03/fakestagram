import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import React, { useRef, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import FlexContainer from "../utils/FlexContainer";
import Label from "../utils/Label";
import {
  query,
  collection,
  getDocs,
  getFirestore,
  where,
} from "firebase/firestore";
import WarningText from "../utils/WarningText";

const Signup = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validForm, setValidForm] = useState(false);
  const [warningText, setWarningText] = useState("");
  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const usersQuery = query(
      collection(getFirestore(), "users"),
      where("username", "==", `${userName}`)
    );
    const userDocs = await getDocs(usersQuery);
    console.log(userDocs.docs);
    if (userDocs.docs.length === 1) {
      setWarningText("Username is taken, please choose another one");
      return;
    }
    try {
      const user = (
        await createUserWithEmailAndPassword(getAuth(), emailAddress, password)
      ).user;
    } catch (e) {
      console.log(e);
      setWarningText(
        "Email address is already associated with a fakestagram account"
      );
      return;
    }
  };
  useEffect(() => {
    setValidForm(!formRef.current?.checkValidity());
  }, [emailAddress, password, userName, fullName]);
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
          onChange={(e) => setFullName(e.currentTarget.value)}
          title="Full name"
        />
      </FlexContainer>

      <FlexContainer direction="column" alignItems="start" gap="0.3rem">
        <Label htmlFor="username">Username</Label>
        <StyledInput
          placeholder="JohnDoe23"
          required
          id="username"
          value={userName}
          onChange={(e) => setUserName(e.currentTarget.value)}
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
      <FormButton disabled={validForm} type="submit">
        Sign up
      </FormButton>
    </FormContainer>
  );
};

export default Signup;
