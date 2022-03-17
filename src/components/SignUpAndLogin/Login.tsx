import FormContainer from "./FormContainer";
import Heading from "./Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
const Login = () => {
  return (
    <FormContainer action="game">
      <Heading>Fakestagram</Heading>
      <StyledInput placeholder="Email Address" type="email" required />
      <StyledInput placeholder="Password" type="password" required />
      <FormButton>Log in</FormButton>
    </FormContainer>
  );
};

export default Login;
