import { Timestamp } from "firebase/firestore";

export default interface Post {
  id: string;
  postedBy: string;
  caption: string;
  likes: number[];
  comments: Comment[];
  imgSrc: string;
  timestamp: Timestamp;
}

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}
