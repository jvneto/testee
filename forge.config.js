const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');

const { version, isBeta } = packageJson;
const iconDir = path.resolve(__dirname, 'assets', 'icons');

if (process.env['WINDOWS_CODESIGN_FILE']) {
  const certPath = path.join(__dirname, 'win-certificate.pfx');
  const certExists = fs.existsSync(certPath);

  if (certExists) {
    process.env['WINDOWS_CODESIGN_FILE'] = certPath;
  }
}

const commonLinuxConfig = {
  icon: {
    scalable: path.resolve(iconDir, 'sbotics.svg'),
  },
  mimeType: ['x-scheme-handler/sbotics'],
};

const config = {
  packagerConfig: {
    name: 'sBotics',
    executableName: 'sbotics',
    asar: true,
    icon: path.resolve(__dirname, 'assets', 'icons', 'sbotics'),
    appBundleId: 'com.sbotics.launcher',
    usageDescription: {},
    appCategoryType: 'public.app-category.developer-tools',
    protocols: [
      {
        name: 'sBotics Launch Protocol',
        schemes: ['sbotics'],
      },
    ],
    win32metadata: {
      CompanyName: 'sBotics',
      OriginalFilename: 'sBotics',
    },
    osxSign: {
      identity: 'Developer ID Application: Julio Cesar Vera Neto (5UQ7TRCVCT)',
      hardenedRuntime: true,
      'gatekeeper-assess': false,
      entitlements: 'static/entitlements.plist',
      'entitlements-inherit': 'static/entitlements.plist',
      'signature-flags': 'library',
    },
  },
  makers: [
    // {
    //   name: '@electron-forge/maker-appx',
    //   platforms: ['win32'],
    //   config: {
    //     publisher: 'CN=developmentca',
    //     publisherDisplayName: 'Julio Cesar Vera Neto',
    //     packageVersion: `1.${version}`,
    //     packageName: 'sBotics',
    //     packageDisplayName: 'sBotics',
    //     packageDescription: 'sBotics Launcher for Desktops',
    //   },
    // },
    {
      name: '@electron-forge/maker-squirrel',
      platforms: ['win32'],
      config: (arch) => ({
        name: 'sBotics',
        authors: 'sBotics',
        exe: 'sbotics.exe',
        iconUrl:
          'https://raw.githubusercontent.com/electron/fiddle/0119f0ce697f5ff7dec4fe51f17620c78cfd488b/assets/icons/fiddle.ico',
        loadingGif: '',
        noMsi: true,
        setupExe: `sbotics-${version}${
          isBeta ? '-BETA' : ''
        }-win32-${arch}-setup.exe`,
        setupIcon: path.resolve(iconDir, 'sbotics.ico'),
        certificateFile: process.env['WINDOWS_CODESIGN_FILE'],
        certificatePassword: process.env['WINDOWS_CODESIGN_PASSWORD'],
      }),
    },
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      arch: 'all',
      config: {
        icon: path.resolve(iconDir, 'icon.icns'),
        overwrite: true,
      },
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux'],
      config: commonLinuxConfig,
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'jvneto',
          name: 'testee',
        },
        draft: true,
        prerelease: isBeta,
      },
    },
  ],
};

function notarizeMaybe() {
  if (process.platform !== 'darwin') {
    return;
  }

  if (!process.env.CI) {
    console.log(`Not in CI, skipping notarization`);
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.warn(
      'Should be notarizing, but environment variables APPLE_ID or APPLE_ID_PASSWORD are missing!',
    );
    return;
  }

  config.packagerConfig.osxNotarize = {
    appBundleId: 'com.sbotics.launcher',
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    ascProvider: '5UQ7TRCVCT',
  };
}

notarizeMaybe();

// Finally, export it
module.exports = config;
