import { FieldValue, Timestamp } from "firebase/firestore";

export default interface Post {
  id: string;
  postedBy: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  imgSrc: string;
  timestamp: Timestamp;
}

export interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: FieldValue;
}
