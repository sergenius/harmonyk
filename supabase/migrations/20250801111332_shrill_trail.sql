/*
  # HarmonyK Balance Tracker Database Schema

  1. New Tables
    - `balance_types`
      - `id` (serial, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `is_active` (boolean, default true)
    - `balances`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `balance_type_id` (int, foreign key to balance_types)
      - `belief_statement` (text, required)
      - `muscle_test_result` (text, enum: strong/weak/neutral)
      - `stress_before` (int, 1-10 range)
      - `stress_after` (int, 1-10 range)
      - `outcome_notes` (text)
      - `session_status` (text, enum: active/completed/follow_up_needed)
      - `integration_status` (text, enum: in_progress/complete/needs_follow_up)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `balances` table
    - Add policy for users to access only their own balance records
    - Public read access to `balance_types` for all authenticated users

  3. Data
    - Pre-populate balance_types with standard categories
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create balance_types table
CREATE TABLE IF NOT EXISTS balance_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create balances table
CREATE TABLE IF NOT EXISTS balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_type_id INT REFERENCES balance_types(id),
  belief_statement TEXT NOT NULL,
  muscle_test_result TEXT CHECK (muscle_test_result IN ('strong', 'weak', 'neutral')),
  stress_before INT CHECK (stress_before BETWEEN 1 AND 10),
  stress_after INT CHECK (stress_after BETWEEN 1 AND 10),
  outcome_notes TEXT,
  session_status TEXT DEFAULT 'completed' CHECK (session_status IN ('active', 'completed', 'follow_up_needed')),
  integration_status TEXT DEFAULT 'in_progress' CHECK (integration_status IN ('in_progress', 'complete', 'needs_follow_up')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for balances - users can only access their own records
CREATE POLICY "Users can manage their own balances"
  ON balances
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to read balance_types
CREATE POLICY "Authenticated users can read balance types"
  ON balance_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default balance types
INSERT INTO balance_types (name, description) VALUES
  ('Movement-Based', 'Physical movement and postures to facilitate balance integration'),
  ('Posture-Based', 'Static body positions and stances for energy alignment'),
  ('Whole-Brain', 'Hemispheric integration techniques for balanced thinking'),
  ('Stress-Trans', 'Stress reduction and transformation processes'),
  ('Belief-Integr', 'Integration of new empowering beliefs and thought patterns')
ON CONFLICT (name) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for balances table
DROP TRIGGER IF EXISTS update_balances_updated_at ON balances;
CREATE TRIGGER update_balances_updated_at
  BEFORE UPDATE ON balances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();