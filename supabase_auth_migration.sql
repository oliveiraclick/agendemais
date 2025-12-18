-- ============================================
-- Supabase Auth Migration Script
-- ============================================
-- Run this in Supabase Dashboard > SQL Editor

-- Step 1: Add user_id column to salons table
ALTER TABLE salons ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_salons_user_id ON salons(user_id);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own salon" ON salons;
DROP POLICY IF EXISTS "Users can update own salon" ON salons;
DROP POLICY IF EXISTS "Users can insert own salon" ON salons;
DROP POLICY IF EXISTS "Users can delete own salon" ON salons;

-- Step 5: Create RLS Policies
-- Policy: Users can only read their own salon
CREATE POLICY "Users can view own salon" 
ON salons FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can only update their own salon
CREATE POLICY "Users can update own salon" 
ON salons FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own salon
CREATE POLICY "Users can insert own salon" 
ON salons FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own salon
CREATE POLICY "Users can delete own salon" 
ON salons FOR DELETE 
USING (auth.uid() = user_id);

-- Step 6: Create function to automatically create salon after email confirmation
-- This function will be triggered by Supabase Auth webhook
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert salon record with user metadata
  INSERT INTO public.salons (
    id,
    created_at,
    user_id,
    name,
    slug,
    description,
    plan,
    address,
    subscription_status,
    monthly_fee,
    next_billing_date
  ) VALUES (
    gen_random_uuid(),
    NOW(),
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'salonName', 'Meu Salão'),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'salonName', 'meu-salao'), ' ', '-')),
    'Novo salão.',
    'professional',
    COALESCE(NEW.raw_user_meta_data->>'address', ''),
    'trial',
    0,
    NOW() + INTERVAL '30 days'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Optional: Migration for existing users
-- ============================================
-- Uncomment and run ONLY after all users have migrated to Supabase Auth

-- ALTER TABLE salons DROP COLUMN IF EXISTS owner_email;
-- ALTER TABLE salons DROP COLUMN IF EXISTS password;
