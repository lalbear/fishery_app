# TestFlight Setup

This Expo app is now configured for EAS-based iOS builds.

## Repo-side setup already added

- [app.json](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/app.json)
  - iOS bundle identifier: `com.pranjalupadhyay.fishinggod`
  - iOS build number: `1`
  - Android package/version code added too
  - Location permission text added for App Review
- [eas.json](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/eas.json)
  - `development`, `preview`, and `production` build profiles
  - `submit.production.ios.ascAppId` placeholder
- [.env.example](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/.env.example)
  - documents the required `EXPO_PUBLIC_BACKEND_URL`

## What you still need to do

### 1. Apple-side requirements

- Enroll in the Apple Developer Program
- Create the app in App Store Connect
- Use the same bundle ID as the repo config:
  - `com.pranjalupadhyay.fishinggod`

If you want a different bundle ID, update it in [app.json](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/app.json) before creating the App Store Connect app record.

### 2. Deploy the backend

TestFlight builds cannot use `localhost`.

You need a public HTTPS backend URL, for example:

```env
EXPO_PUBLIC_BACKEND_URL=https://api.your-domain.com
```

### 3. Create a local env file

Create `mobile/.env`:

```env
EXPO_PUBLIC_BACKEND_URL=https://api.your-domain.com
```

Or set the same variable in Expo/EAS environment settings before cloud builds.

### 4. Install and log in to EAS

```bash
npm install -g eas-cli
eas login
```

### 5. Configure the Expo project for EAS

From the `mobile` directory:

```bash
eas init
```

If Expo asks to link the project, complete that flow.

### 6. Build for iOS

Internal ad hoc build:

```bash
eas build --platform ios --profile preview
```

TestFlight/App Store Connect build:

```bash
eas build --platform ios --profile production
```

### 7. Submit to TestFlight

Replace `YOUR_ASC_APP_ID` in [eas.json](/Users/pranjalupadhyay/Desktop/projects/fishery_app/mobile/eas.json) with the real App Store Connect app ID, then run:

```bash
eas submit --platform ios --profile production
```

## Recommended first path

1. Deploy backend
2. Set `EXPO_PUBLIC_BACKEND_URL`
3. Create App Store Connect app with bundle ID `com.pranjalupadhyay.fishinggod`
4. Run `eas build --platform ios --profile production`
5. Run `eas submit --platform ios --profile production`
6. Add internal testers in App Store Connect TestFlight

## Notes

- `preview` is useful for internal ad hoc sharing.
- `production` is the profile you want for TestFlight.
- If `EXPO_PUBLIC_BACKEND_URL` is missing, production builds now fail against an invalid placeholder domain instead of accidentally using `localhost`.
