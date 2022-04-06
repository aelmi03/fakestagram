import Navbar from "./Navbar/Navbar";
import styled from "styled-components";
import Search from "./Navbar/Search";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./Profile/Profile";
const Main = () => {
  console.log("MAIN ");
  return (
    <MainWrapper>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/profile/:userID" element={<Profile />} />
          <Route path="/search" element={<Search />} />
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
