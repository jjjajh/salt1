/*
  # Create admin user account

  1. New Data
    - Insert admin user with email: jjjajh@naver.com
    - Set admin privileges for the user
  
  2. Security
    - Admin user will be able to access admin dashboard
    - User authentication handled by Supabase Auth
  
  3. Notes
    - Password will need to be set through Supabase Auth signup
    - This migration only creates the admin_users record
*/

-- Insert admin user record
-- Note: The actual user account needs to be created through Supabase Auth
-- This just creates the admin_users record that links to the auth user
INSERT INTO admin_users (id, email, is_admin, created_at)
VALUES (
  gen_random_uuid(),
  'jjjajh@naver.com',
  true,
  now()
) ON CONFLICT (email) DO UPDATE SET
  is_admin = true,
  created_at = now();