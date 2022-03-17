import FormContainer from "./FormContainer";
import Heading from "./Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import React, { useRef, useState, useEffect } from "react";
const Signup = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [validForm, setValidForm] = useState(false);
  useEffect(() => {
    setValidForm(!formRef.current?.checkValidity());
  }, [emailAddress, password, userName, fullName]);
  return (
    <FormContainer ref={formRef}>
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
      <FormButton disabled={validForm}>Sign up</FormButton>
    </FormContainer>
  );
};

export default Signup;
