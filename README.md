# React Native Background Geolocation Sample

This project is a sample application demonstrating the use of [react-native-background-geolocation](https://github.com/transistorsoft/react-native-background-geolocation).

## Features

- Periodically sends location data in the background.
- Utilizes a Geofence loop for efficient background tracking.
- Periodically uploads location data to Firestore.

## Setup

1. **Create a Firebase Project**

   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Set up Firestore in your Firebase project.

2. **Download Firebase Config Files**

   - In the Firebase Console, add an iOS and Android app to your project.
   - Download the `GoogleService-Info.plist` and `google-services.json` file and place it in your project's root directory.

3. **Update Bundle Identifier and Apple Team ID**

   - Edit the `app.json` file and set the `expo.ios.bundleIdentifier` and `expo.android.package` to match app ID you registered in the Firebase Console.
   - Also, set the `expo.ios.appleTeamId` to your Apple Developer Team ID used in the Firebase Console.

## Build & Run

- To run the app on iOS, use the following command:
  ```sh
  expo run:ios --device
  expo run:android
  ```
- Alternatively, you can build the app using EAS:
  ```sh
  eas build --profile preview --platform ios
  eas build --profile preview --platform android
  ```
