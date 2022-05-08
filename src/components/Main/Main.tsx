import Navbar from "./Navbar";
import styled from "styled-components";
import Search from "./Navbar/Search";
import ReactRouterDom, {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Profile from "./Profile";
import Explore from "./Explore";
import Messages from "./Messages";
import Home from "./Home";
const Main = () => {
  console.log("MAIN ");
  console.log(Router);
  return (
    <MainWrapper>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/profile/:userID" element={<Profile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/home" element={<Home />} />
          <Route path="/chats" element={<Messages />} />
          <Route path="/explore" element={<Explore />} />
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
