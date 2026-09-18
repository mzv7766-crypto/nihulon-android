import 'dotenv/config';
import type { CapacitorConfig } from '@capacitor/cli';

const appUrl = process.env.NIHULON_APP_URL || 'https://neolon.base44.app';

const config: CapacitorConfig = {
  appId: 'com.nihulon.app',
  appName: 'ניהולון',
  webDir: 'www',
  server: {
    url: appUrl,
    cleartext: false,
    allowNavigation: ['neolon.base44.app', '*.base44.app']
  },
  android: {
    allowMixedContent: false,
    // Keep the native WebView white while the remote app is loading.
    backgroundColor: '#FFFFFF'
  },
  plugins: {
    SplashScreen: {
      // The Android launch screen itself must be white.
      backgroundColor: '#FFFFFF',
      launchShowDuration: 900,
      launchAutoHide: true,
      launchFadeOutDuration: 180,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER',
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false
    }
  }
};

export default config;
