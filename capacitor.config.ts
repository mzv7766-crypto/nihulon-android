import 'dotenv/config';
import type { CapacitorConfig } from '@capacitor/cli';

const appUrl = process.env.NIHULON_APP_URL || 'https://REPLACE-ME.base44.app';

const config: CapacitorConfig = {
  appId: 'com.nihulon.app',
  appName: 'ניהולון',
  webDir: 'www',
  server: {
    url: appUrl,
    cleartext: false,
    allowNavigation: ['*.base44.app']
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#111827'
  }
};

export default config;
