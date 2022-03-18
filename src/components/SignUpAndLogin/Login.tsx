import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import { useEffect, useRef, useState } from "react";
import WarningText from "../utils/WarningText";
import Label from "../utils/Label";
import FlexContainer from "../utils/FlexContainer";

const Login = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [validForm, setValidForm] = useState(false);
  const [warningText, setWarningText] = useState("");
  useEffect(() => {
    setValidForm(!formRef.current?.checkValidity());
  }, [emailAddress, password]);
  return (
    <FormContainer ref={formRef}>
      <Heading>Fakestagram</Heading>
      <FlexContainer direction="column" alignItems="start" gap="0.3rem">
        <Label htmlFor="email">Email Address</Label>
        <StyledInput
          placeholder="jamesbrown@gmail.com"
          required
          id="email"
          type="email"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.currentTarget.value)}
          title="Email address"
        />
      </FlexContainer>
      <FlexContainer direction="column" alignItems="start" gap="0.3rem">
        <Label htmlFor="password">Password</Label>
        <StyledInput
          placeholder="Password"
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          title="Password (minimum of 6 characters)"
        />
      </FlexContainer>
      <WarningText>{warningText}</WarningText>
      <FormButton disabled={validForm}>Log in</FormButton>
    </FormContainer>
  );
};

export default Login;
