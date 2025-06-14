import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.locationapp",
  appName: "MyLocationApp",
  webDir: "dist",
  bundledWebRuntime: false,
  plugins: {
    BackgroundGeolocation: {
      locationAuthorizationRequest: "Always",
      desiredAccuracy: 0,
      distanceFilter: 10,
      stopOnTerminate: false,
      startOnBoot: true,
      foregroundService: true,
      debug: true,
      logLevel: 5, // LOG_LEVEL_VERBOSE
    },
  },
  android: {
    allowMixedContent: true,
  },
  ios: {
    contentInset: "always",
  },
  cordova: {
    preferences: {
      ScrollEnabled: "false",
      "android-minSdkVersion": "21",
      "android-targetSdkVersion": "34",
      BackgroundColor: "0xffffffff",
      BackupWebStorage: "none",
    },
  },
};

export default config;
