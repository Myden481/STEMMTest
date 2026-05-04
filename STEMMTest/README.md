# STEMM App - Text Filter Prototype
 
A working prototype demonstrating real-time text filtering and profanity moderation for the STEMM App. Built with Expo, React Native, and the `@2toad/profanity` NPM package.
 
## Overview
This project is an assessment prototype designed to evaluate the integration of a text moderation feature in a mobile application. It automatically scans user-generated text inputs (like chat messages) against a predefined dictionary of offensive words, censoring inappropriate language in real-time before it is displayed.
 
## Features
- **Real-Time Filtering**: Instantly scans text for profanity before rendering or sending.
- **On-Device Processing**: Moderation happens locally, ensuring user privacy by not sending private messages to a third-party server.
- **Customizable Dictionary**: Easily add custom words to the blocklist (e.g., custom word "stupid" added for this prototype).
- **Cross-Platform**: Works identically on iOS, Android, and Web through Expo.
 
## Getting Started
 
### Prerequisites
- Node.js (v18 or newer recommended)
- npm or yarn
- [Expo Go](https://expo.dev/client) app on your physical device OR an iOS Simulator / Android Emulator
 
### Installation
 
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Myden481/STEMMTest.git
   cd STEMMTest
   ```
 
2. **Install dependencies:**
   ```bash
   npm install
   ```
 
3. **Start the development server:**
   ```bash
   npx expo start
   ```
 
4. **Run the App:**
   - Press `a` to open in Android Emulator.
   - Press `i` to open in iOS Simulator.
   - Press `w` to open in the browser.
   - Scan the QR code with the Expo Go app on your phone.
 
## Usage
1. Launch the app and navigate to the **Chat** screen (via the bottom tab).
2. Try typing a normal message and click send.
3. Try typing a message containing profanity (or the custom flagged word `stupid`).
4. The application will automatically detect and censor the flagged words (e.g., `st*p*d`) before displaying the message.
 
## References & Acknowledgements
- **[@2toad/profanity](https://www.npmjs.com/package/@2toad/profanity)**: The NPM package powering the text moderation.
- **Expo & React Native**: Used as the foundational mobile development frameworks.
- **Expo Router Default Template**: Used as the starting boilerplate code to set up the navigation and layout of the app prototype.