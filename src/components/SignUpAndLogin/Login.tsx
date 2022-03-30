import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import { useEffect, useRef, useState } from "react";
import WarningText from "../utils/WarningText";
import Label from "../utils/Label";
import FlexContainer from "../utils/FlexContainer";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [disabledButton, setDisabledButton] = useState(false);
  const [warningText, setWarningText] = useState("");

  useEffect(() => {
    if (formRef.current?.checkValidity() === true) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [emailAddress, password]);

  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(getAuth(), emailAddress, password);
    } catch (error: any) {
      const realError = error as FirebaseError;
      if (realError.message.includes("(auth/user-not-found).")) {
        setWarningText(
          "The email address you entered doesn't belong to an account. Please check your email address and try again."
        );
      } else {
        setWarningText(
          "Sorry, your password was incorrect. Please double-check your password."
        );
      }
    }
  };
  return (
    <FormContainer ref={formRef} onSubmit={signIn} data-testid="form">
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
        <Label htmlFor="password">Password (minimum of 6 characters)</Label>
        <StyledInput
          placeholder="Password"
          type="password"
          id="password"
          required
          value={password}
          minLength={6}
          onChange={(e) => setPassword(e.currentTarget.value)}
          title="Password (minimum of 6 characters)"
        />
      </FlexContainer>
      <WarningText>{warningText}</WarningText>
      <FormButton disabled={disabledButton} name="Log in">
        Log in
      </FormButton>
    </FormContainer>
  );
};

export default Login;
