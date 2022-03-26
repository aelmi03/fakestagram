import { act, render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../../Themes/Theme";
import userEvent from "@testing-library/user-event";
import AddPostModal from "../../components/Main/Navbar/AddPostModal";
import { store } from "../../app/store";
import { Provider } from "react-redux";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useAppSelector } from "../../app/hooks";
jest.mock("firebase/firestore", () => {
  return {
    addDoc: jest.fn(),
    collection: jest.fn(),
    getFirestore: jest.fn(),
    serverTimestamp: jest.fn(),
    updateDoc: jest.fn(),
  };
});

jest.mock("firebase/firestore", () => {
  return {
    getDownloadURL: jest.fn(),
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytesResumable: jest.fn(),
  };
});

jest.mock("../../app/hooks", () => {
  return {
    useAppSelector: async () => {
      return {
        fullName: "John Doe",
        username: "johnDoe23",
        following: [],
        id: "123",
        profilePicture: "path/to/photo/for/johnDoe23",
        biography: "Love riding bicycles and going to the beach :)",
        savedPosts: [],
      };
    },
  };
});
