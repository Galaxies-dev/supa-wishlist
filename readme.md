# SupaWishlist

A mobile application built with Expo, React Native, and Supabase.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Clone the repository:
bash
git clone [your-repo-url]
cd [project-directory]

2. Install dependencies:
bash
npm install
or
yarn install

3. Create environment files:
bash
cp .env.example .env.local

4. Configure your environment variables in `.env.local`:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

### Development

Start the development server:
bash
npm start
or
yarn start

Then, press:
- `i` to open iOS simulator
- `a` to open Android emulator
- `w` to open in web browser

## 📱 Building for Production

### EAS Build

This project uses EAS Build for production builds. Make sure you have an Expo account and EAS CLI installed:

bash
npm install -g eas-cli
eas login

To create a build:
bash
For iOS
eas build --platform ios
For Android
eas build --platform android

## 🔧 Project Structure

├── app/ # App directory (Expo Router)
│ ├── (app)/ # Main app routes
│ └── layout.tsx # Root layout
├── store/ # State management
├── supabase/ # Supabase edge functions
│ └── functions/
└── ...

## 🛠️ Tech Stack

- [Expo](https://docs.expo.dev/) - React Native framework
- [React Navigation](https://reactnavigation.org/) - Navigation
- [Supabase](https://supabase.com/) - Backend and database
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Expo Router](https://docs.expo.dev/routing/introduction/) - File-based routing

## 📝 Environment Variables

Required environment variables:

- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🚀 Deployment

### Supabase Edge Functions

Deploy Supabase Edge Functions:

bash
supabase functions deploy list

### Mobile App

1. Configure EAS in `eas.json`
2. Build your app: `eas build --platform all`
3. Submit to stores: `eas submit`

## 🚀 More

**Take a shortcut from web developer to mobile development fluency with guided learning**

Enjoyed this project? Learn to use React Native to build production-ready, native mobile apps for both iOS and Android based on your existing web development skills.

<a href="https://galaxies.dev"><img src="banner.png" height="auto" width="100%"></a>
