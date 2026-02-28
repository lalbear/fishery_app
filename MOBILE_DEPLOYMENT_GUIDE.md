# 📱 Fishing God Mobile App - Deployment Guide

## Overview

The Fishing God mobile app is built with **React Native + Expo**, making it deployable to both Android and iOS devices. This guide covers all deployment options from development testing to production app stores.

---

## 🎯 Deployment Options Summary

| Method | Cost | Best For | Time |
|--------|------|----------|------|
| **Expo Go (Development)** | Free | Testing during development | 5 min |
| **Internal Distribution** | Free | Team/Organization testing | 30 min |
| **Google Play (Production)** | $25 one-time | Public Android release | 1-2 days |
| **App Store (Production)** | $99/year | Public iOS release | 1-3 days |

---

## 📋 Prerequisites

### Required Accounts
1. **Expo Account** (Free)
   - Sign up at https://expo.dev
   - Needed for cloud builds

2. **Google Play Console Account** ($25 one-time fee)
   - https://play.google.com/console
   - For Android Play Store

3. **Apple Developer Account** ($99/year)
   - https://developer.apple.com
   - For iOS App Store

### Development Environment
```bash
# Install Expo CLI
npm install -g eas-cli

# Login to Expo
eas login

# Verify installation
eas --version
```

---

## 🚀 Deployment Methods

---

### Method 1: Expo Go (Development & Testing)

**Best for:** Developers, immediate testing, demo purposes

**How it works:**
Users install the Expo Go app from Play Store/App Store, then scan a QR code to run your app.

**Steps:**

```bash
cd mobile

# Install dependencies
npm install

# Start development server
npx expo start
```

**Share with others:**
1. Run `npx expo start`
2. A QR code appears in terminal
3. Others scan with Expo Go app
4. App loads instantly

**Limitations:**
- ❌ Cannot use custom native modules
- ❌ Requires internet connection
- ❌ Not for production use
- ❌ App store distribution not possible

---

### Method 2: Build APK/IPA for Direct Installation

**Best for:** Internal testing, demos, closed beta

**Android APK Build:**

```bash
cd mobile

# Configure build
eas build:configure

# Build APK (Android)
eas build --platform android --profile preview

# Or build with local gradle
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```

**Install APK on Android:**
1. Download APK file from build
2. Transfer to Android device
3. Enable "Install from Unknown Sources" in Settings
4. Tap APK to install

**iOS IPA Build (Requires Mac + Apple Developer):**

```bash
# Build iOS app
eas build --platform ios --profile preview

# Or with Xcode
npx expo prebuild --platform ios
cd ios
xcodebuild -scheme FishingGod archive
```

**Install IPA on iOS:**
1. Use TestFlight for distribution
2. Or use Apple Configurator 2
3. Or deploy through MDM (enterprise)

---

### Method 3: Google Play Store (Production Android)

**Best for:** Public distribution to Android users

#### Step 1: Prepare App

```bash
cd mobile

# Create production build (AAB format recommended)
eas build --platform android --profile production

# Alternative: APK format
eas build --platform android --profile production --type apk
```

#### Step 2: App Store Listing

1. Go to https://play.google.com/console
2. Create new app
3. Fill store listing:
   - **App Name:** Fishing God - Aquaculture Intelligence
   - **Short Description:** AI-powered aquaculture management for Indian farmers
   - **Full Description:** (See template below)
   - **Screenshots:** Upload 2-3 phone screenshots
   - **Feature Graphic:** 1024x500 banner

**Store Listing Template:**
```
Fishing God - India's #1 Aquaculture Intelligence App

🎣 Maximize your fish farming profits with data-driven insights

Features:
✓ Species intelligence for Rohu, Catla, Shrimp, and more
✓ ROI calculator with PMMSY subsidy integration
✓ Offline-first - works without internet
✓ Multi-language support (Hindi, Bengali, Telugu, Tamil, etc.)
✓ Water quality monitoring
✓ Real-time market prices

Built for Indian farmers by Indian developers.
```

#### Step 3: Upload & Release

1. Upload AAB file to Play Console
2. Set content rating (Everyone)
3. Set pricing (Free)
4. Select countries (India)
5. Submit for review (usually 1-2 days)

---

### Method 4: Apple App Store (Production iOS)

**Best for:** Public distribution to iPhone/iPad users

#### Step 1: Prepare Certificates

1. Enroll in Apple Developer Program ($99/year)
2. Create App ID at https://developer.apple.com
3. Generate distribution certificate
4. Create provisioning profile

#### Step 2: Build App

```bash
cd mobile

# Configure iOS build
eas build:configure

# Build for App Store
eas build --platform ios --profile production
```

#### Step 3: Submit to App Store

1. Download IPA from Expo build
2. Use Transporter app (Mac) or Xcode to upload
3. Go to https://appstoreconnect.apple.com
4. Create new app
5. Fill metadata (similar to Play Store)
6. Submit for review (usually 1-3 days)

---

## 🔧 Configuration for Production

### 1. Update API Endpoint

```typescript
// mobile/src/config/api.ts
export const API_CONFIG = {
  // Development
  // API_BASE_URL: 'http://localhost:3000',
  
  // Production (use your deployed backend URL)
  API_BASE_URL: 'https://api.fishinggod.app',
  
  ENABLE_OFFLINE_SYNC: true,
  SYNC_INTERVAL_MINUTES: 15,
};
```

### 2. Configure App.json

```json
{
  "expo": {
    "name": "Fishing God",
    "slug": "fishing-god",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#2E7D32"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.fishinggod"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2E7D32"
      },
      "package": "com.yourcompany.fishinggod"
    }
  }
}
```

### 3. Environment Variables

Create `mobile/.env.production`:
```env
API_BASE_URL=https://api.fishinggod.app
ENABLE_OFFLINE_SYNC=true
GOOGLE_MAPS_API_KEY=your_production_key
```

---

## 📦 Build Profiles

Configure in `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

---

## 🧪 Testing Before Release

### Test Checklist
- [ ] App launches without crashes
- [ ] Offline mode works (toggle airplane mode)
- [ ] Species data loads correctly
- [ ] Economics calculator produces results
- [ ] Map loads and shows location
- [ ] Language switching works
- [ ] Water quality logs save
- [ ] Sync works when back online

### Test on Real Devices
```bash
# Build for testing
eas build --platform android --profile preview

# Install on device
# Download APK from Expo dashboard and install
```

---

## 💰 Cost Breakdown

| Item | Cost | Frequency |
|------|------|-----------|
| Expo Account | Free | - |
| Google Play Console | $25 | One-time |
| Apple Developer | $99 | Annual |
| Expo EAS Builds | Free* | - |
| App Store/Play Store | 15-30% | Per transaction (if paid) |

*Free tier: 30 iOS builds/month, unlimited Android builds

---

## 🚀 Quick Start Commands

```bash
# Setup
cd mobile
npm install
eas login

# Development
npx expo start

# Internal Testing
eas build --platform android --profile preview

# Production Release
eas build --platform android --profile production
eas build --platform ios --profile production
```

---

## 📱 Minimum Device Requirements

**Android:**
- Android 8.0 (API 26) or higher
- 2GB RAM
- 100MB storage

**iOS:**
- iOS 13.0 or higher
- iPhone 6s or newer
- 100MB storage

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear caches
npx expo prebuild --clean
cd android && ./gradlew clean
cd ios && xcodebuild clean

# Rebuild
npx expo prebuild
eas build
```

### App Won't Install
- Android: Enable "Unknown Sources" in Settings > Security
- iOS: Must use TestFlight or registered device

### App Crashes on Launch
- Check API_BASE_URL is correct
- Verify backend is running
- Check logs: `adb logcat` (Android) or Xcode Console (iOS)

---

## 📞 Support

For deployment help:
- Expo Documentation: https://docs.expo.dev
- Expo Forums: https://forums.expo.dev
- React Native Docs: https://reactnative.dev

---

**Ready to publish? Follow the steps above and your app will be live in 1-3 days! 🎉**