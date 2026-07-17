# Stockline

Stockline is a cross-platform mobile application built with **React Native**, **Expo SDK 52**, **Nx**, and **Yarn Berry**.

## Tech stack

- React Native
- Expo SDK 52
- Nx 22
- Yarn 4
- TypeScript
- Metro

## Project structure

```text
stockline/
├── apps/
│   └── stockline/
│       ├── src/
│       ├── app.json
│       ├── metro.config.js
│       └── project.json
├── nx.json
├── package.json
├── tsconfig.base.json
├── .yarnrc.yml
└── README.md
```

## Prerequisites

Before running the project, install:

- Node.js
- Corepack
- Yarn 4
- Xcode for iOS development
- Android Studio and JDK 17 for Android development
- CocoaPods for iOS native dependencies

Confirm the main tools are available:

```bash
node --version
yarn --version
pod --version
```

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
cd stockline
```

Enable Corepack and install the project dependencies:

```bash
corepack enable
yarn install
```

## Running the app

Start the Expo development server from the workspace root:

```bash
yarn nx start stockline
```

You can also start Expo directly from the application folder:

```bash
cd apps/stockline
yarn expo start
```

After Metro starts:

- Press `i` to open the iOS Simulator.
- Press `a` to open an Android emulator.
- Scan the QR code with a compatible development build when using a physical device.

To clear the Metro cache:

```bash
yarn nx start stockline --clear
```

If the Nx target does not forward Expo arguments, run:

```bash
cd apps/stockline
yarn expo start --clear
```

## Nx commands

View the available projects:

```bash
yarn nx show projects
```

View all configured targets for Stockline:

```bash
yarn nx show project stockline
```

Open the Nx dependency graph:

```bash
yarn nx graph
```

Run a target using:

```bash
yarn nx <target> stockline
```

## Expo checks

Validate the Expo configuration and dependencies:

```bash
cd apps/stockline
yarn expo-doctor
```

Where dependency versions need alignment, run:

```bash
yarn expo install --fix
```

## iOS setup

CocoaPods is only required for iOS native projects.

When an `ios` directory exists, install its native dependencies with:

```bash
cd apps/stockline/ios
pod install
```

For an Expo managed project using Continuous Native Generation, native folders can be generated with:

```bash
cd apps/stockline
yarn expo prebuild
```

Avoid manually changing generated native files unless the project intentionally uses the bare workflow.

## Android setup

Android does not use CocoaPods.

Before running Android, ensure that:

- Android Studio is installed.
- An Android SDK is configured.
- An emulator is running or a physical device is connected.
- JDK 17 is active.

Start Expo and press `a`, or run the configured Android target when one is available.

## Package management

This project uses Yarn Berry with the `node-modules` linker.

The `.yarnrc.yml` file should include:

```yaml
nodeLinker: node-modules
enableGlobalCache: false
```

Use Yarn for dependency management:

```bash
yarn add <package>
yarn add -D <package>
yarn remove <package>
```

Do not mix `npm install` and `yarn install` in this repository.

## Git workflow

Create a new branch before starting a change:

```bash
git checkout -b feature/your-feature-name
```

Commit your work:

```bash
git add .
git commit -m "feat: describe the change"
```

Push the branch:

```bash
git push -u origin feature/your-feature-name
```

## Troubleshooting

### Nx cannot find the `start` target

Confirm that `apps/stockline/project.json` contains a `start` target:

```json
{
  "targets": {
    "start": {
      "executor": "nx:run-commands",
      "cache": false,
      "continuous": true,
      "options": {
        "command": "yarn exec expo start",
        "cwd": "apps/stockline"
      }
    }
  }
}
```

### Yarn cannot find the `nx` command

Run the command from the workspace root:

```bash
cd ~/Documents/stockline
yarn nx show projects
```

### Metro cache issues

```bash
cd apps/stockline
yarn expo start --clear
```

### Expo configuration issues

```bash
cd apps/stockline
yarn expo-doctor
```

## Contributing

1. Create a feature branch.
2. Make and test your changes.
3. Use a clear conventional commit message.
4. Push the branch and open a pull request.

## License

Add the appropriate licence for this project before public distribution.