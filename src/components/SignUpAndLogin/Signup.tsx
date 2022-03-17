import FormContainer from "./FormContainer";
import Heading from "./Heading";
import StyledInput from "./StyledInput";
import FormButton from "./FormButton";
const Signup = () => {
  return (
    <FormContainer action="game">
      <Heading>Fakestagram</Heading>
      <StyledInput placeholder="Email Address" required type="email" />
      <StyledInput placeholder="Full name" required />
      <StyledInput placeholder="Username" required />
      <StyledInput placeholder="Password" type="password" required />
      <FormButton>Sign up</FormButton>
    </FormContainer>
  );
};

export default Signup;
