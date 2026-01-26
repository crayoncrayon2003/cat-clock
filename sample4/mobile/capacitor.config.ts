import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.catclock',
  appName: 'Cat Clock',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  ios: {
    contentInset: 'automatic'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;