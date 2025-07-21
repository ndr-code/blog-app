export interface User {
  id: number;
  name: string;
  email: string;
  headline?: string | null;
  avatarUrl?: string | null;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  author: User;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface CommentData {
  id: number;
  content: string;
  author: User;
  post: number;
  createdAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  lastPage: number;
}

export interface PostsResponse {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
}

export interface UserPostsResponse {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
  user: User;
}
