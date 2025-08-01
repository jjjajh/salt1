/*
  # Create posts table for church website

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `title` (text, required) - Post title
      - `content` (text, required) - Post content/body
      - `category` (text, required) - Board category (news, sermon, elementary, youth, young-adult, adult)
      - `image_url` (text, optional) - URL for attached image
      - `youtube_url` (text, optional) - YouTube video URL
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `posts` table
    - Add policy for public read access
    - Add policy for authenticated admin write access

  3. Triggers
    - Auto-update `updated_at` column on modifications
*/

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  youtube_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for posts table
-- Allow public read access to all posts
CREATE POLICY "Posts are publicly readable"
  ON posts
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert posts (will be restricted to admins in app logic)
CREATE POLICY "Authenticated users can insert posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update posts (will be restricted to admins in app logic)
CREATE POLICY "Authenticated users can update posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete posts (will be restricted to admins in app logic)
CREATE POLICY "Authenticated users can delete posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on posts
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS posts_category_idx ON posts(category);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);