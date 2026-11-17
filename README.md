# Color Clash

Color Clash is a mobile-first Expo game about visual perception. Each round displays a grid of tiles that are almost the same color. Exactly one tile is a slightly different shade, and the player must tap the odd tile out.

## Requirements

- Git
- Node.js (the current LTS release is recommended)
- npm (included with Node.js)
- A phone with [Expo Go](https://expo.dev/go), an Android emulator, an iOS simulator, or a web browser

This repository uses **Expo SDK 58**, **React Native**, **TypeScript**, and **Expo Router**. The project currently uses npm, so use `npm` commands and keep `package-lock.json` in sync with `package.json`.

## Get access to the code

If this is a private GitHub repository, a repository owner must add each teammate as a collaborator before they can clone and push code:

1. Open the repository on GitHub.
2. Go to **Settings → Collaborators** (or **Manage access**).
3. Invite each teammate's GitHub username or email address.
4. Give teammates the appropriate write access for the project.

After accepting the invitation, clone the repository and enter its folder:

```bash
git clone https://github.com/BrooklynD23/Captcha-Mayhem.git
cd Captcha-Mayhem
```

If the repository is public, teammates can clone it without an invitation, but they still need collaborator access or a fork to push changes directly.

## Install and run

From the project folder, install the exact dependency versions recorded in the lockfile:

```bash
npm ci
npm start
```

The Expo development server will show a QR code and keyboard shortcuts. Use one of these options:

- **Physical device:** open Expo Go and scan the QR code. Keep the device and computer on the same network.
- **Web:** press `w`, or run `npm run web`.
- **Android emulator:** press `a`, or run `npm run android`.
- **iOS simulator:** press `i`, or run `npm run ios` (requires macOS and Xcode).

The app uses file-based routing. Screens are in `src/app/`; shared components, hooks, and theme files live outside that directory.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run web` | Start the app for the web |
| `npm run android` | Start the app on an Android emulator or connected device |
| `npm run ios` | Start the app in the iOS simulator |
| `npm run lint` | Run the Expo ESLint checks |
| `npx tsc --noEmit` | Check TypeScript without generating files |
| `npx expo-doctor` | Check Expo dependencies and project configuration |
| `npx expo start --clear` | Restart Expo after clearing its cache |

Run the checks before opening a pull request:

```bash
npm run lint
npx tsc --noEmit
```

## Team workflow

Keep `main` stable and create a branch for each change:

```bash
git switch main
git pull origin main
git switch -c feature/your-change
```

After making and testing your changes:

```bash
git add .
git commit -m "Describe the change"
git push -u origin feature/your-change
```

Open a pull request on GitHub so another teammate can review it before it is merged. If dependencies change, run `npm install` and commit the resulting `package-lock.json` update with `package.json`.

## Game concept

Each round should:

1. Generate a grid of tiles using one base color.
2. Make exactly one tile a subtly different shade of that color.
3. Let the player select the tile they believe is different.
4. Give feedback and start the next round or update the score and timer.

As difficulty increases, the shade difference can become smaller or the grid can become larger. The game should remain playable on small screens and across Android, iOS, and web.

## Project structure

```text
src/
├── app/          # Expo Router screens and layouts
├── components/   # Reusable UI components
├── constants/    # Theme and shared constants
└── hooks/        # Reusable React hooks
assets/           # App icons, splash screen, and other static assets
app.json          # Expo configuration
package.json      # Scripts and dependencies
```

## Troubleshooting

- If the QR code does not connect, verify that the phone and computer are on the same network, then restart with `npx expo start --clear`.
- If dependencies are out of sync, remove `node_modules` and run `npm ci` again.
- If a native package is added, use Expo-compatible versions and follow the Expo development-build guidance. Do not create or edit `ios/` or `android/` manually when those folders are not present.

## Useful documentation

- [Expo SDK 58 documentation](https://docs.expo.dev/versions/v58.0.0/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
