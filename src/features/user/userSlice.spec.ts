import userReducer, { setUser, User } from "./userSlice";

describe("user reducer", () => {
  const initialState: User = {
    fullName: "",
    username: "",
    profilePicture: "",
    id: "",
    followers: [],
    following: [],
    biography: "",
  };
  it("should have the proper intial state", () => {
    expect(userReducer(undefined, { type: "unkmown" })).toEqual(initialState);
  });
  it("should be able to set the user", () => {
    const newUser: User = {
      fullName: "John Doe",
      username: "JohnDoe23",
      profilePicture: "profilePictureURL",
      id: "123",
      followers: ["qxlAXD241asd", "lqW12spmajWxAs"],
      following: ["Alkmn241ASDq", "mAlK241SDxQ"],
      biography: "Loving this adventure called life :)",
    };
    const user = userReducer(initialState, setUser(newUser));

    expect(user).toEqual(newUser);
  });
});
