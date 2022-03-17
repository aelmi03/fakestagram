import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import React, { useRef, useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import WarningText from "../utils/WarningText";

const Signup = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validForm, setValidForm] = useState(false);
  const [warningText, setWarningText] = useState("");
  const signUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, emailAddress, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch(() => {
        setWarningText(
          "Email address already associated with a fakestagram account"
        );
        // ..
      });
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
      />
      <StyledInput
        placeholder="Full name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.currentTarget.value)}
      />
      <StyledInput
        placeholder="Username"
        required
        value={userName}
        onChange={(e) => setUserName(e.currentTarget.value)}
      />
      <StyledInput
        placeholder="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <WarningText>{warningText}</WarningText>
      <FormButton disabled={validForm} type="submit">
        Sign up
      </FormButton>
    </FormContainer>
  );
};

export default Signup;
