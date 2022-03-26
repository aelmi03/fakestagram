export default interface Post {
  id: string;
  caption: string;
  likes: number[];
  comments: Comment[];
  timestamp: string;
}

interface Comment {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}
