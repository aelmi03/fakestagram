import Navbar from "./Navbar/Navbar";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Profile/Profile";
import Comments from "./Comments";
const Main = () => {
  return (
    <MainWrapper>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/profile/:userID" element={<Comments />} />
        </Routes>
      </Router>
    </MainWrapper>
  );
};
const MainWrapper = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.main};
`;
export default Main;
