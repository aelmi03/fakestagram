import FormContainer from "./FormContainer";
import Heading from "./Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
const Signup = () => {
  return (
    <FormContainer>
      <Heading>Fakestagram</Heading>
      <StyledInput placeholder="Email Address" />
      <StyledInput placeholder="Full name" />
      <StyledInput placeholder="Username" />
      <StyledInput placeholder="Password" />
      <FormButton>Sign up</FormButton>
    </FormContainer>
  );
};

export default Signup;
