# HarmonyK Authentication Guide

## Overview
The HarmonyK app uses Supabase for authentication with Row-Level Security (RLS) to ensure users can only access their own data.

## Current Authentication Status ✅

### Implemented Features
1. **Complete Authentication Flow**
   - ✅ Login screen with email/password
   - ✅ Signup screen with full name, email confirmation
   - ✅ Password reset functionality
   - ✅ Session management with persistence
   - ✅ Automatic routing between auth and main app

2. **Security Features**
   - ✅ Row-Level Security (RLS) policies
   - ✅ User data isolation
   - ✅ Secure session management
   - ✅ Environment variable configuration

3. **User Experience**
   - ✅ Loading states and error handling
   - ✅ Form validation and user feedback
   - ✅ Profile management with logout
   - ✅ Connection testing utilities

## How to Use Authentication

### For New Users
1. **Sign Up**: Navigate to signup screen, enter details
2. **Email Confirmation**: Check email and click confirmation link
3. **Login**: Use email/password to sign in
4. **Access App**: Automatically redirected to main app

### For Existing Users
1. **Login**: Use existing credentials
2. **Password Reset**: Use "Forgot Password" if needed
3. **Profile Management**: Update profile in Profile tab
4. **Logout**: Use logout button in Profile tab

## Database Setup Required

The app requires the Supabase database migration to be run:

1. **Go to Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Run the migration** from `supabase/migrations/20250801111332_shrill_trail.sql`

### What the Migration Creates:
- `balance_types` table with 5 default categories
- `balances` table with all required fields
- RLS policies for data security
- Automatic timestamp triggers

## Environment Configuration

Ensure your `.env` file contains:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Testing Authentication

### Built-in Tests
1. **Dashboard Connection Test**: Use "Test Database Connection" button
2. **Profile Screen**: Verify user data loads correctly
3. **Auth Flow**: Test signup → confirmation → login

### Manual Testing Checklist
- [ ] Sign up with new email
- [ ] Receive confirmation email
- [ ] Confirm email and login
- [ ] Access dashboard and see data
- [ ] Update profile information
- [ ] Logout and login again
- [ ] Test password reset

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check `.env` file exists and has correct variables
   - Restart development server after changes

2. **"Database migration not run"**
   - Run the SQL migration in Supabase dashboard
   - Verify tables exist in Database section

3. **"Invalid login credentials"**
   - Ensure email is confirmed (check inbox)
   - Verify password is correct
   - Try password reset if needed

4. **"Row Level Security policy violation"**
   - Verify RLS policies are set up correctly
   - Check user is authenticated before data access

### Debug Steps
1. Check browser/app console for detailed error messages
2. Use "Test Database Connection" in dashboard
3. Verify Supabase project is active
4. Check network connectivity
5. Ensure correct environment variables

## Authentication Files Structure

```
app/
├── _layout.tsx              # Session management & routing
├── (auth)/
│   ├── login.tsx           # Login screen
│   ├── signup.tsx          # Registration screen
│   ├── reset.tsx           # Password reset
│   └── _layout.tsx         # Auth stack navigation
├── (tabs)/
│   ├── profile.tsx         # Profile & logout
│   └── index.tsx          # Dashboard with connection test
lib/
├── supabase.ts            # Supabase client config
├── database.ts            # Database operations
└── auth.ts               # Authentication utilities
```

## Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **RLS Policy**: Always enforce Row-Level Security
3. **Input Validation**: Validate all user inputs
4. **Error Handling**: Don't expose internal errors to users
5. **Session Management**: Handle session expiration gracefully

## API Documentation

### Authentication Functions (`lib/auth.ts`)
- `getCurrentUser()`: Get current authenticated user
- `signOut()`: Sign out current user
- `testConnection()`: Test database connectivity
- `testAuthentication()`: Comprehensive auth test
- `validateSession()`: Check if session is valid
- `validatePassword()`: Password strength validation
- `validateEmail()`: Email format validation

### Database Functions (`lib/database.ts`)
- `getBalanceTypes()`: Fetch balance categories
- `createBalance()`: Create new balance record
- `getBalances()`: Fetch user's balance records
- `updateBalance()`: Update existing balance
- `deleteBalance()`: Delete balance record
- `getDashboardStats()`: Get dashboard statistics

## Next Steps

With authentication complete, you can now:
1. **Test the complete flow** end-to-end
2. **Add more features** knowing auth is secure
3. **Deploy to production** with confidence
4. **Monitor usage** through Supabase dashboard

## Support

If you encounter issues:
1. Check this guide first
2. Review console/app logs
3. Use built-in connection test
4. Verify Supabase project status