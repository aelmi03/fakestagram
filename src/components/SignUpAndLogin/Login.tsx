import FormContainer from "./FormContainer";
import Heading from "../utils/Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
import { useEffect, useRef, useState } from "react";
import WarningText from "../utils/WarningText";
import Label from "../utils/Label";
import FlexContainer from "../utils/FlexContainer";
import {
  signInWithEmailAndPassword,
  getAuth,
  User as AuthUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAppDispatch } from "../../app/hooks";
import { setUser, User } from "../../features/user/userSlice";

const Login = () => {
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [validForm, setValidForm] = useState(false);
  const [warningText, setWarningText] = useState("");
  const getUserFromDB = async (user: AuthUser) => {
    const userRef = doc(getFirestore(), `users/${user.uid}`);
    const userDoc = await getDoc(userRef);
    dispatch(setUser(userDoc.data() as User));
  };
  useEffect(() => {
    setValidForm(!formRef.current?.checkValidity());
  }, [emailAddress, password]);
  const signIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = (
        await signInWithEmailAndPassword(getAuth(), emailAddress, password)
      ).user;
      setWarningText("");
      getUserFromDB(user);
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
    <FormContainer ref={formRef} onSubmit={signIn}>
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
          minLength={6}
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
