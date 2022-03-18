import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import React, { useRef, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
      <StyledInput
        placeholder="Email Address"
        required
        type="email"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.currentTarget.value)}
        title="Email address"
      />
      <StyledInput
        placeholder="Full name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.currentTarget.value)}
        title="Full name"
      />
      <StyledInput
        placeholder="Username"
        required
        value={userName}
        onChange={(e) => setUserName(e.currentTarget.value)}
        title="Username"
      />
      <StyledInput
        placeholder="Password"
        type="password"
        required
        value={password}
        minLength={6}
        onChange={(e) => setPassword(e.currentTarget.value)}
        title="Password (minimum of 6 characters)"
      />
      <WarningText>{warningText}</WarningText>
      <FormButton disabled={validForm} type="submit">
        Sign up
      </FormButton>
    </FormContainer>
  );
};

export default Signup;
