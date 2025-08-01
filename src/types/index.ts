export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  youtube_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  name: string;
  displayName: string;
  icon: string;
}

export interface User {
  id: string;
  email: string;
  is_admin: boolean;
}