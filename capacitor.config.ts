import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cryptovision.app',
  appName: 'CryptoVision',
  webDir: 'public',
  server: {
    url: 'https://ai-crypto-ameino96s-projects.vercel.app', // Update this with your actual Vercel URL
    cleartext: true
  }
};

export default config;
