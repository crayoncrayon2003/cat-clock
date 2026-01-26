## Prerequisites
- Node.js (v16 or higher)
- Java 17
- Android Studio
- For Windows build: Windows OS or Wine (Linux)
- For Mac/iOS build: macOS with Xcode
- For Android build: Android Studio and Java JDK
---

# 1. Init
```bash
npm install
```

# 2. Setup for desktop
```bash
cd desktop
npm install
cd ..
```

# 3. Setup for mobile
```bash
cd mobile
npm install -D typescript
npx cap add android
npx cap add ios     # Mac only
cd ..
```

# 4. Copy shared files
Copy the ./shared to ./desktop and ./mobile.
```bash
npm run sync
```

# 5. Run
```bash
npm run start:desktop
```

# 6. Build
## 6.1. Desktop
```bash
# for Windows
npm run build:desktop:win
# for Mac
npm run build:desktop:mac
# for Linux
npm run build:desktop:linux
```

## 6.2. Mobile
```bash
# for iOS
npm run build:mobile:ios
# for Android
npm run build:mobile:android
```

# 7. Release
## 7.1. Desktop
### 7.1.1. Windows
```bash
desktop/dist/Cat Clock Setup.exe      # Installer version
desktop/dist/Cat Clock Portable.exe   # Portable version (no installation required)
```

### 7.1.2. Mac
```bash
desktop/dist/Cat Clock.dmg    # Installer version
desktop/dist/Cat Clock.zip    # ZIP version
```

### 7.1.3. Linux
```bash
desktop/dist/Cat Clock-1.0.0.AppImage           # AppImage version
desktop/dist/cat-clock-desktop_1.0.0_amd64.deb  # Debian/Ubuntu version
```

## 7.2. Mobile
### 7.2.1. Android
**Step 1: Creating a keystore**
```bash
cd mobile/android
keytool -genkey -v -keystore keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias catclock

> パスワード入力: testpass
> パスワード再入力: testpass
> 名前: [Enter]
> 部署: [Enter]
> 組織: [Enter]
> 市: [Enter]
> 都道府県: [Enter]
> 国コード: JP [Enter]
> 確認: yes [Enter]
```

Note: Remove keystore
```bash
rm keystore.jks
```

**Step 2: Building a Signed APK**
```bash
cd mobile/android
./gradlew clean
./gradlew assembleRelease

jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore keystore.jks app/build/outputs/apk/release/app-release-unsigned.apk catclock
> Enter Passphrase for keystore: testpass

zipalign -v 4 app/build/outputs/apk/release/app-release-unsigned.apk app/build/outputs/apk/release/Cat-Clock.apk
```

**Step 3: Install APK**
```
adb install app/build/outputs/apk/release/Cat-Clock.apk
```
or transfer the APK file to your device and install it directly.


### 7.2.2. iOS
**Step 1: Apple Developer Account Settings**
```
1. Xcode → Settings → Accounts
2. Sign in with Apple ID
3. Select team
```

**Step 2: Signing & Capabilities Settings**
```
1. Select project
2. Select Signing & Capabilities tab
3. Select Team
4. Ensure that the Bundle Identifier is unique
```

**Step 3: Creating an archive**
```
1. Menu → Product → Scheme → Edit Scheme
2. Run → Build Configuration to "Release"
3. Menu → Product → Archive
4. Wait until the archive is complete
```

**Step 4: Release**

**For Beta Test (TestFlight):**
```
1. Click Distribute App
2. Select App Store Connect
3. Select Upload
4. Next → Next → Upload
5. Open the TestFlight tab in App Store Connect
6. Invite testers
```

**For Official Release (App Store):**
```
1. Click Distribute App
2. Select App Store Connect
3. Select Upload
4. Enter your app information in App Store Connect:
   - Screenshots
   - Description
   - Category
   - Pricing
5. Submit for review
```