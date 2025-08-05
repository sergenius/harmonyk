# 🧠 HarmonyK – PSYCH-K Balance Tracker

A **mobile app for individual PSYCH-K practitioners** to log "Balance" sessions, review history, and track progress. Built with React Native (Expo) and Supabase backend with Row-Level Security (RLS).

## 📋 Project Overview

### 🎯 **Core Goal**
Build a mobile application that enables PSYCH-K practitioners to:
- Log balance sessions with detailed tracking
- Review historical sessions and patterns
- Monitor progress and stress reduction
- Maintain private, secure data with RLS

### 🏗️ **Architecture**
- **Frontend**: React Native with Expo Router
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Authentication**: Email/password with session management
- **Database**: Row-Level Security for data privacy
- **Platform**: Cross-platform (iOS, Android, Web)

## 🚀 Current Implementation Status

### ✅ **Completed Features**

#### **Milestone 1: Authentication & Profile Screens**
- ✅ **Login Screen** (`app/(auth)/login.tsx`)
  - Email/password authentication
  - Form validation with error handling
  - Password visibility toggle
  - Navigation to signup/reset
- ✅ **Signup Screen** (`app/(auth)/signup.tsx`)
  - User registration with full name
  - Email confirmation flow
  - Password strength validation
  - Duplicate password confirmation
- ✅ **Password Reset** (`app/(auth)/reset.tsx`)
  - Email-based password recovery
  - Form validation and error handling
- ✅ **Session Management** (`app/_layout.tsx`)
  - Automatic session detection
  - Route protection (auth vs. main app)
  - Session persistence with AsyncStorage

#### **Milestone 2: Create Balance Form**
- ✅ **Balance Creation** (`app/(tabs)/create.tsx`)
  - Complete form with all required fields:
    - Belief statement (required)
    - Balance type selection (dropdown)
    - Muscle test result (strong/weak/neutral)
    - Stress levels before/after (1-10 scale)
    - Session status (active/completed/follow_up_needed)
    - Integration status (in_progress/complete/needs_follow_up)
    - Outcome notes (optional)
  - Client-side validation
  - Real-time form feedback
  - Success/error handling
  - Form reset after submission

#### **Milestone 3: Balance History & List**
- ✅ **History Screen** (`app/(tabs)/history.tsx`)
  - List all balance sessions with details
  - Search functionality (belief statement, notes)
  - Filter by session status and balance type
  - Delete functionality with confirmation
  - Pull-to-refresh
  - Empty state handling
  - Color-coded status indicators

#### **Milestone 4: Dashboard with Statistics**
- ✅ **Dashboard Screen** (`app/(tabs)/index.tsx`)
  - Quick stats cards (total sessions, weekly/monthly counts)
  - Average stress reduction calculation
  - Session status breakdown
  - Recent activity list
  - Database connection testing
  - Quick action buttons

### 🔧 **Technical Infrastructure**

#### **Database Schema** (`supabase/migrations/20250801111332_shrill_trail.sql`)
- ✅ **balance_types** table with 5 default categories
- ✅ **balances** table with all required fields
- ✅ **Row-Level Security (RLS)** enabled
- ✅ **User isolation** - users can only access their own data
- ✅ **Automatic timestamps** with triggers
- ✅ **Data validation** with check constraints

#### **Authentication & Security**
- ✅ **Supabase Auth** integration
- ✅ **Session persistence** with AsyncStorage
- ✅ **Auto-refresh tokens** on app state changes
- ✅ **Route protection** based on authentication state
- ✅ **Environment variables** configuration

#### **UI/UX Implementation**
- ✅ **Modern design** with calming color palette
- ✅ **Responsive forms** with validation feedback
- ✅ **Status indicators** with color coding
- ✅ **Loading states** and error handling
- ✅ **Accessibility** considerations

## 📊 **Current State Analysis**

### 🟢 **Working Features**
1. **Authentication Flow** - Complete signup/login/reset
2. **Database Connection** - Supabase integration with RLS
3. **Balance Creation** - Full form with validation
4. **History Management** - List, search, filter, delete
5. **Dashboard Statistics** - Real-time data aggregation
6. **Navigation** - Tab-based navigation with auth routing

### 🟡 **Known Issues**
1. **Environment Variables** - Sometimes not loading properly in development
2. **Metro Bundler Errors** - Non-critical `<anonymous>` file errors
3. **Package Version Warnings** - Some packages need updates for best compatibility
4. **Deprecation Warnings** - React Navigation style props warnings

### 🔴 **Critical Issues**
1. **Database Migration** - SQL migration needs to be run manually in Supabase dashboard
2. **Authentication Testing** - Need to verify email confirmation flow
3. **Error Handling** - Some edge cases may need better error messages

## 📋 **Backlog & Next Steps**

### 🎯 **Milestone 5: Polish & Production Readiness**

#### **High Priority**
- [ ] **Database Migration** - Run SQL migration in Supabase dashboard
- [ ] **Authentication Testing** - Test signup/login flow end-to-end
- [ ] **Error Handling** - Improve error messages and user feedback
- [ ] **Loading States** - Add loading indicators for all async operations
- [ ] **Form Validation** - Enhance client-side validation rules

#### **Medium Priority**
- [ ] **Offline Support** - Implement offline caching for balance types
- [ ] **Data Export** - Add CSV export functionality for balance history
- [ ] **Search Enhancement** - Add advanced search with multiple criteria
- [ ] **Statistics Charts** - Add visual charts for progress tracking
- [ ] **Push Notifications** - Reminders for follow-up sessions

#### **Low Priority**
- [ ] **Theme Customization** - Allow users to customize colors
- [ ] **Data Backup** - Automatic backup to cloud storage
- [ ] **Multi-language** - Internationalization support
- [ ] **Advanced Analytics** - Detailed progress reports
- [ ] **Social Features** - Share progress with practitioners (optional)

### 🔧 **Technical Debt**

#### **Immediate**
- [ ] **Package Updates** - Update packages to recommended versions
- [ ] **Linting** - Fix all ESLint warnings and errors
- [ ] **Type Safety** - Improve TypeScript type definitions
- [ ] **Performance** - Optimize bundle size and loading times

#### **Future**
- [ ] **Testing** - Add unit and integration tests
- [ ] **CI/CD** - Set up automated testing and deployment
- [ ] **Monitoring** - Add error tracking and analytics
- [ ] **Documentation** - Add API documentation and user guides

## 🛠️ **Development Setup**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Expo CLI
- Supabase account

### **Installation**
```bash
# Clone repository
git clone <repository-url>
cd harmonyk

# Install dependencies
npm install

# Create .env file with Supabase credentials
echo "EXPO_PUBLIC_SUPABASE_URL=your_supabase_url" > .env
echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env

# Start development server
npm run dev
```

### **Environment Variables**
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### **Database Setup**
1. Create a Supabase project
2. Run the SQL migration from `supabase/migrations/20250801111332_shrill_trail.sql`
3. Configure authentication settings in Supabase dashboard

## 📱 **App Structure**

```
app/
├── _layout.tsx              # Root layout with auth routing
├── (auth)/                  # Authentication screens
│   ├── login.tsx           # Login form
│   ├── signup.tsx          # Registration form
│   ├── reset.tsx           # Password reset
│   └── _layout.tsx         # Auth layout
├── (tabs)/                 # Main app screens
│   ├── index.tsx           # Dashboard with statistics
│   ├── create.tsx          # Balance creation form
│   ├── history.tsx         # Balance history list
│   ├── profile.tsx         # User profile (placeholder)
│   └── _layout.tsx         # Tab navigation
└── +not-found.tsx          # 404 page

lib/
├── supabase.ts             # Supabase client configuration
└── database.ts             # Database utilities

types/
└── database.ts             # TypeScript database types

supabase/
└── migrations/
    └── 20250801111332_shrill_trail.sql  # Database schema
```

## 🎨 **Design System**

### **Color Palette**
- **Primary**: `#3B82F6` (Blue)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Yellow)
- **Error**: `#EF4444` (Red)
- **Neutral**: `#6B7280` (Gray)

### **Status Colors**
- **Completed**: Green (`#10B981`)
- **Active**: Blue (`#3B82F6`)
- **Follow-up Needed**: Orange (`#F59E0B`)

## 🔒 **Security Features**

### **Row-Level Security (RLS)**
- Users can only access their own balance records
- Balance types are publicly readable for authenticated users
- All database operations are protected by RLS policies

### **Authentication**
- Email/password authentication via Supabase Auth
- Session persistence with AsyncStorage
- Automatic token refresh
- Secure password requirements

## 📈 **Performance Considerations**

### **Current Optimizations**
- Lazy loading of screens
- Efficient database queries with joins
- Minimal bundle size with tree shaking
- Optimized images and assets

### **Future Optimizations**
- Implement virtual scrolling for large lists
- Add caching for frequently accessed data
- Optimize database queries with indexes
- Implement progressive web app features

## 🧪 **Testing Strategy**

### **Manual Testing Checklist**
- [ ] Authentication flow (signup, login, logout)
- [ ] Balance creation with all field types
- [ ] History search and filtering
- [ ] Dashboard statistics accuracy
- [ ] Error handling scenarios
- [ ] Cross-platform compatibility

### **Automated Testing (Future)**
- Unit tests for utility functions
- Integration tests for database operations
- E2E tests for critical user flows
- Performance testing for large datasets

## 🚀 **Deployment**

### **Development**
```bash
npm run dev
```

### **Production Build**
```bash
# Web
npm run build:web

# Mobile (requires Expo account)
expo build:android
expo build:ios
```

## 📞 **Support & Contributing**

### **Getting Help**
- Check the console logs for debugging information
- Use the "Test Database Connection" button on dashboard
- Review the Supabase dashboard for database issues

### **Contributing**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Development (Milestones 1-4 Complete)