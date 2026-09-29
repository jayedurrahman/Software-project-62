
-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill any auth users missing from profiles
INSERT INTO public.profiles (id, full_name, email, role, hostel_id)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'full_name', u.email),
       u.email,
       COALESCE((u.raw_user_meta_data->>'role')::app_role, 'user'),
       NULLIF(u.raw_user_meta_data->>'hostel_id','')::uuid
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Backfill user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT u.id,
       COALESCE((u.raw_user_meta_data->>'role')::app_role, 'user')
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;
