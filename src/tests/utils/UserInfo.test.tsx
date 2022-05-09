import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import UserInfo from "../../components/utils/UserInfo";
import Theme from "../../Themes/Theme";
import { User } from "../../features/user/userSlice";
const mockPropUser: User = {
  fullName: "Dwayne Johnson",
  username: "therock",
  following: [],
  savedPosts: [],
  id: "therock",
  profilePicture: "path/to/photo/for/kingjames",
  biography: "Love riding bicycles and going to the beach :)",
};
let onClick: jest.Mock;
let width: string;
let minimumSize: string;
let largerImage: boolean;
describe("UserInfo Component", () => {
  beforeEach(() => {
    onClick = jest.fn();
    width = "1000";
    minimumSize = "250";
    largerImage = true;
  });
  it("renders the username, fullname, and profile picture of the user", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserInfo user={mockPropUser} onClick={onClick} width={width} />
      </ThemeProvider>
    );
    expect(screen.getByText(`${mockPropUser.fullName}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockPropUser.username}`)).toBeInTheDocument();
    expect((screen.getByTestId("UserInfo Image") as HTMLImageElement).src).toBe(
      `http://localhost/${mockPropUser.profilePicture}`
    );
  });
  it("will call the onClick prop function when the Container is clicked", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserInfo user={mockPropUser} onClick={onClick} width={width} />
      </ThemeProvider>
    );
    expect(onClick).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId(`User Info ${mockPropUser.id}`));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toBe(mockPropUser);
  });
  it("will not call the onClick prop function if it is not passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserInfo user={mockPropUser} width={width} />
      </ThemeProvider>
    );
    expect(onClick).toHaveBeenCalledTimes(0);
    userEvent.click(screen.getByTestId(`User Info ${mockPropUser.id}`));
    expect(onClick).toHaveBeenCalledTimes(0);
  });
  it("will make the Overflow Containers have the max-width of the minimumSize prop string if it is passed in", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserInfo user={mockPropUser} width={width} minimumSize={minimumSize} />
      </ThemeProvider>
    );
    expect(
      window.getComputedStyle(screen.getByTestId("First Overflow Container"))
        .maxWidth
    ).toBe(minimumSize);
    expect(
      window.getComputedStyle(screen.getByTestId("Second Overflow Container"))
        .maxWidth
    ).toBe(minimumSize);
  });
  it("will make the image the size of the largerImage prop boolean if it is passed in and is equal to true", () => {
    render(
      <ThemeProvider theme={Theme}>
        <UserInfo user={mockPropUser} width={width} largerImage={largerImage} />
      </ThemeProvider>
    );
    expect(
      window.getComputedStyle(screen.getByTestId("UserInfo Image")).width
    ).toBe("60px");
    expect(
      window.getComputedStyle(screen.getByTestId("UserInfo Image")).height
    ).toBe("60px");
  });
});
