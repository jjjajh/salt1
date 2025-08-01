/*
  # Create admin users table for church website

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique) - Admin email address
      - `is_admin` (boolean, default true) - Admin status flag
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to read their own data
    - Add policy for admins to manage admin users

  3. Notes
    - This table works with Supabase Auth to manage admin permissions
    - The id field references the auth.users table
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  is_admin boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
-- Allow users to read their own admin status
CREATE POLICY "Users can read own admin data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow admins to insert new admin users
CREATE POLICY "Admins can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Allow admins to update admin users
CREATE POLICY "Admins can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Allow admins to delete admin users (except themselves)
CREATE POLICY "Admins can delete other admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND is_admin = true
    ) AND id != auth.uid()
  );

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);
CREATE INDEX IF NOT EXISTS admin_users_is_admin_idx ON admin_users(is_admin);