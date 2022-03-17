import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import { useEffect, useRef, useState } from "react";
import WarningText from "../utils/WarningText";
const Login = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [validForm, setValidForm] = useState(false);
  useEffect(() => {
    setValidForm(!formRef.current?.checkValidity());
  }, [emailAddress, password]);
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
        placeholder="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <WarningText>That username is already taken</WarningText>
      <FormButton disabled={validForm}>Log in</FormButton>
    </FormContainer>
  );
};

export default Login;
