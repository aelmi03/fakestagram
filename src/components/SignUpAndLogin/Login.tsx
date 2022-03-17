import FormContainer from "./FormContainer";
import Heading from "./Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
const Login = () => {
  return (
    <FormContainer>
      <Heading>Fakestagram</Heading>
      <StyledInput placeholder="Email Address" />
      <StyledInput placeholder="Password" />
      <FormButton>Log in</FormButton>
    </FormContainer>
  );
};

export default Login;
