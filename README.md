# 🌟 HarmonyK – Balance Tracking App

A **premium mobile application** for balance practitioners and individuals seeking personal transformation. Track your balance sessions, monitor progress, and achieve your wellness goals with a beautiful, intuitive interface.

![HarmonyK Logo](https://img.shields.io/badge/HarmonyK-Balance%20Tracker-667eea?style=for-the-badge&logo=mobile&logoColor=white)

## ✨ **What's New in v2.0**

### 🚀 **Major Updates & Enhancements**

✅ **Professional Landing Page** - Beautiful hero section with call-to-action  
✅ **Interactive Onboarding** - 5-screen guided tour of features  
✅ **Multilingual Support** - English, Spanish, and Portuguese  
✅ **Enhanced Profile System** - Comprehensive user profiles with progress tracking  
✅ **Animated Dashboard** - Smooth animations and haptic feedback  
✅ **Production-Ready UX** - Professional design and micro-interactions  
✅ **Smart Authentication** - Success messages and automatic redirects  
✅ **Unified Interface** - Streamlined profile sections with inline editing  

## 📱 **App Features**

### 🎯 **Core Functionality**
- **Balance Session Tracking** - Log detailed balance sessions with insights
- **Progress Monitoring** - Track stress reduction and session outcomes  
- **History Management** - Search, filter, and manage session history
- **Statistics Dashboard** - Real-time analytics and progress charts
- **Secure Data** - Row-level security with private user data

### 🌍 **User Experience**
- **Multilingual Interface** - Full support for English, Spanish, Portuguese
- **Interactive Onboarding** - Learn the app with guided tutorials
- **Professional Landing** - Marketing page with feature highlights
- **Smooth Animations** - 60fps native animations throughout
- **Haptic Feedback** - Touch responses for better interaction
- **Pull-to-Refresh** - Intuitive data refreshing
- **Smart Forms** - Real-time validation with helpful error messages

### 🎨 **Design & Interface**
- **Modern Gradient UI** - Beautiful purple/blue theme
- **Card-Based Layout** - Clean, organized information display
- **Progress Indicators** - Visual feedback for profile completion
- **Consistent Icons** - Lucide React Native icon system
- **Responsive Design** - Works perfectly on all screen sizes
- **Accessibility** - Touch-friendly with proper contrast ratios

## 🏗️ **Technical Architecture**

### **Frontend Stack**
- **React Native** with Expo Router for navigation
- **TypeScript** for type safety and better DX
- **Linear Gradients** for beautiful UI elements
- **Animated** for smooth 60fps interactions
- **AsyncStorage** for persistent local data
- **i18n-js** for internationalization

### **Backend & Database**
- **Supabase** for authentication and database
- **PostgreSQL** with Row-Level Security (RLS)
- **Real-time subscriptions** for live data updates
- **Automatic backups** and point-in-time recovery
- **JWT authentication** with session management

### **Security & Privacy**
- **Row-Level Security** - Users only access their own data
- **Email verification** for account security
- **Session management** with automatic token refresh
- **Data encryption** in transit and at rest
- **GDPR compliant** data handling

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18 or higher
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- Supabase account (free tier available)

### **Quick Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/harmonyk.git
cd harmonyk

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start the development server
npm run dev
```

### **Environment Configuration**
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### **Database Setup**
1. Create a new Supabase project
2. Run the migration file: `supabase/migrations/20250801111332_shrill_trail.sql`
3. Enable email authentication in Supabase Auth settings
4. Your app is ready to use! 🎉

## 📱 **App Structure**

```
harmonyk/
├── app/                         # Expo Router pages
│   ├── index.tsx               # Smart routing logic
│   ├── landing.tsx             # Landing page with hero section
│   ├── onboarding.tsx          # 5-screen interactive tour
│   ├── (auth)/                 # Authentication flow
│   │   ├── login.tsx          # Enhanced login with animations
│   │   ├── signup.tsx         # Registration with validation
│   │   └── reset.tsx          # Password recovery
│   └── (tabs)/                 # Main app interface
│       ├── index.tsx          # Animated dashboard
│       ├── create.tsx         # Balance creation form
│       ├── history.tsx        # Session history management
│       └── profile.tsx        # Unified profile interface
├── components/                  # Reusable components
│   └── LanguageSelector.tsx   # Transparent language modal
├── lib/                        # Utilities and configurations
│   ├── supabase.ts           # Database client
│   └── i18n.ts               # Internationalization
├── types/                      # TypeScript definitions
│   ├── database.ts           # Supabase types
│   └── profile.ts            # Extended profile types
└── docs/                       # Documentation
    ├── NEW_FEATURES_GUIDE.md  # Feature documentation
    └── AUTHENTICATION_GUIDE.md # Auth setup guide
```

## 🎨 **Design System**

### **Color Palette**
```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Success: #10B981 (Emerald)
Warning: #F59E0B (Amber)  
Error: #EF4444 (Red)
Info: #3B82F6 (Blue)
Purple: #8B5CF6 (Violet)
```

### **Typography**
- **Headlines**: 28-36px, Bold (700)
- **Subtitles**: 18-24px, SemiBold (600)  
- **Body Text**: 16px, Medium (500)
- **Labels**: 14px, Regular (400)
- **Font**: System default (San Francisco/Roboto)

### **Components**
- **Cards**: 16px radius, subtle shadows, gradient backgrounds
- **Buttons**: Consistent padding, gradient primaries, haptic feedback
- **Forms**: Inline validation, animated errors, focus states
- **Modals**: Transparent backgrounds, smooth transitions

## 🌍 **Internationalization**

### **Supported Languages**
- 🇺🇸 **English** - Full interface translation
- 🇪🇸 **Español** - Complete Spanish localization  
- 🇧🇷 **Português** - Brazilian Portuguese support

### **Translation Coverage**
- ✅ Authentication screens and error messages
- ✅ Dashboard and navigation elements
- ✅ Profile management and settings
- ✅ Balance tracking and history
- ✅ Landing page and onboarding flow
- ✅ Form validation and success messages

### **Device Language Detection**
The app automatically detects your device language and sets the interface accordingly. Users can change languages anytime through the profile settings.

## 📊 **Features in Detail**

### **🎬 Landing & Onboarding**
- **Professional landing page** with hero section and feature highlights
- **5-screen interactive onboarding** with visual previews
- **Statistics showcase** (10K+ sessions, 95% success rate)
- **User testimonials** with ratings and feedback
- **Call-to-action** buttons leading to signup/login

### **🔐 Enhanced Authentication**
- **Smooth signup flow** with real-time validation
- **Animated login** with shake effects on errors
- **Success celebrations** with emojis and positive messaging
- **Automatic redirects** to appropriate screens after auth
- **Password reset** with friendly instructions

### **📊 Animated Dashboard**
- **Gradient header** with welcome messaging
- **Staggered card animations** that load with visual appeal
- **Pull-to-refresh** with haptic feedback
- **Interactive statistics** showing session progress
- **Quick action buttons** with gradient styling
- **Recent activity** with color-coded status indicators

### **👤 Unified Profile System**
- **Inline editing** - click edit icons to modify any field
- **Profile completion progress** with animated progress bar
- **Personal information** section with contact details
- **Professional details** for certified practitioners
- **Goals and preferences** with multi-line text support
- **Settings integration** with language selector and notifications

### **📝 Balance Tracking**
- **Comprehensive form** with all session details
- **Smart validation** with helpful error messages
- **Session types** with color-coded categories
- **Stress level tracking** before and after sessions
- **Progress notes** and outcome documentation
- **Status management** (active, completed, follow-up needed)

### **📈 History & Analytics**
- **Advanced search** through session notes and beliefs
- **Filter options** by status, type, and date ranges
- **Statistics calculation** for stress reduction trends
- **Progress visualization** with charts and graphs
- **Data export** capabilities (coming soon)

## 🚀 **Performance & Optimization**

### **⚡ Speed Optimizations**
- **Native animations** using 60fps transform animations
- **Efficient re-renders** with proper React optimization
- **Bundle optimization** with tree-shaking and code splitting
- **Image optimization** with proper compression
- **Database queries** optimized with proper indexing

### **📱 Mobile-First Design**
- **Touch-friendly** minimum 44pt touch targets
- **Gesture support** for swipe actions and pull-to-refresh
- **Keyboard avoidance** in forms and inputs
- **Safe area** handling for all device types
- **Haptic feedback** for tactile user interactions

### **🔋 Battery & Memory**
- **Efficient animations** that clean up properly
- **Memory management** with proper component unmounting
- **Network optimization** with caching strategies
- **Background tasks** minimized for battery preservation

## 🧪 **Quality Assurance**

### **✅ Testing Coverage**
- **Manual testing** across iOS and Android devices
- **Authentication flow** end-to-end validation
- **Database operations** with error scenario testing
- **UI responsiveness** on various screen sizes
- **Performance testing** with large datasets
- **Accessibility testing** with screen readers

### **🔧 Code Quality**
- **TypeScript** for type safety throughout
- **ESLint** configuration with React Native rules
- **Prettier** code formatting for consistency
- **Clean architecture** with separation of concerns
- **Error boundaries** for graceful failure handling

## 📦 **Deployment & Distribution**

### **🌐 Web Deployment**
```bash
# Build for web
npm run build:web

# Deploy to Vercel/Netlify
npm run deploy:web
```

### **📱 Mobile App Stores**
```bash
# Android Play Store
expo build:android
expo submit:android

# iOS App Store  
expo build:ios
expo submit:ios
```

### **🔄 Continuous Integration**
- **GitHub Actions** for automated testing
- **Automated builds** on pull requests
- **Deploy previews** for feature branches
- **Version tagging** with semantic versioning

## 🤝 **Contributing**

We welcome contributions! Here's how to get started:

### **Development Workflow**
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes with proper testing
5. **Commit** with descriptive messages: `git commit -m "Add amazing feature"`
6. **Push** to your fork: `git push origin feature/amazing-feature`
7. **Create** a Pull Request with detailed description

### **Code Standards**
- Follow **TypeScript** best practices
- Use **React Native** recommended patterns
- Write **descriptive commit messages**
- Add **comments** for complex logic
- Test on **both iOS and Android**

### **Feature Requests**
Have an idea? Open an issue with:
- Clear description of the feature
- Use cases and benefits
- Possible implementation approach
- Screenshots or mockups if applicable

## 🛠️ **Troubleshooting**

### **Common Issues**

**🚫 Environment Variables Not Loading**
```bash
# Clear Metro cache
npx expo start --clear

# Restart development server
npm run dev
```

**🔗 Database Connection Issues**
- Verify Supabase URL and API key in `.env`
- Check RLS policies are enabled
- Run database migration if needed
- Test connection using dashboard test button

**📱 App Not Loading on Device**
- Ensure device and computer are on same network
- Clear Expo app cache
- Restart Expo development server
- Check firewall settings

**🌐 Translation Issues**
- Verify device language settings
- Clear AsyncStorage: `AsyncStorage.clear()`
- Check i18n configuration in `lib/i18n.ts`

### **Getting Help**
- 📖 Check the [Documentation](./docs/)
- 🐛 Open an [Issue](https://github.com/your-username/harmonyk/issues)
- 💬 Join our [Discussions](https://github.com/your-username/harmonyk/discussions)
- 📧 Email support: support@harmonyk.app

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Supabase** for providing excellent backend services
- **Expo** for the amazing React Native development platform
- **Lucide** for the beautiful icon system
- **React Native community** for continuous improvements
- **All contributors** who helped make this app better

## 📈 **Roadmap**

### **🎯 Coming Soon (v2.1)**
- [ ] **Advanced Analytics** - Detailed progress charts and insights
- [ ] **Data Export** - CSV/PDF export of session history  
- [ ] **Offline Support** - Work without internet connection
- [ ] **Push Notifications** - Reminders for follow-up sessions
- [ ] **Dark Theme** - Complete dark mode interface

### **🚀 Future Versions**
- [ ] **Practitioner Mode** - Multi-client management for professionals
- [ ] **Social Features** - Share progress with community (optional)
- [ ] **Advanced Search** - AI-powered session insights
- [ ] **Integrations** - Connect with health and wellness apps
- [ ] **Backup & Sync** - Cloud backup across devices

---

<div align="center">

**Built with ❤️ for the balance tracking community**

[![Made with React Native](https://img.shields.io/badge/Made%20with-React%20Native-61dafb?style=flat-square&logo=react)](https://reactnative.dev/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ecf8e?style=flat-square&logo=supabase)](https://supabase.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Version 2.0.0** | **Updated: January 2025** | **Status: Production Ready** 🚀

[Download on App Store](#) | [Get it on Google Play](#) | [View Demo](#)

</div>