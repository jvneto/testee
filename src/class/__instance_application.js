let ipcRenderer = require('electron').ipcRenderer;
const os = require('os');

class Application {
  constructor() {}
  SLMP() {
    return !ipcRenderer.sendSync('is-packaged');
  }
  getLocale() {
    const locale = ipcRenderer.sendSync('get-lang').replace('-', '_');
    const languageAvarible = ['pt_BR'];
    return languageAvarible.indexOf(locale) > -1 ? locale : 'en_US';
  }
  getVersion() {
    return ipcRenderer.sendSync('get-version');
  }
  getOS() {
    return process.platform.toLowerCase();
  }
  getDefaultPath() {
    return ipcRenderer.sendSync('app-defaultpath');
  }
  getOSFolder() {
    const platforms = {
      win32: 'Windows',
      darwin: 'macOS',
      linux: 'Linux',
    };
    return platforms[this.getOS()];
  }
  getOSText() {
    const platforms = {
      win32: 'Windows',
      darwin: 'OSX',
      linux: 'Linux',
    };
    return platforms[this.getOS()];
  }
  getFolderDefault() {
    return `${os.homedir()}/sBotics`;
  }
  getFolderPathLauncher() {
    return `${this.getFolderDefault()}/Launcher`;
  }
  getFolderPathSboticsSimulation() {
    return `${this.getFolderDefault()}/Applications/sBotics_simulation`;
  }
  getFolderPathSboticsSimulationStreamingAssets() {
    const platforms = {
      win32: 'sBotics/sBotics_Data/StreamingAssets/',
      darwin: 'sBotics/sBotics.app/Contents/Resources/Data/StreamingAssets/',
      linux: 'sBotics/sBotics_Data/StreamingAssets/',
    };
    return platforms[this.getOS()];
  }
  getFolderPathSboticsSimulationBlockEduc() {
    const platforms = {
      win32: `/sBotics/Applications/sBotics_simulation/sBotics_Data/StreamingAssets/Addons/`,
      darwin: `/sBotics/Applications/sBotics_simulation/sBotics.app/Contents/Resources/Data/StreamingAssets/Addons/`,
      linux: `/sBotics/Applications/sBotics_simulation/sBotics_Data/StreamingAssets/Addons/`,
    };
    var os = process.platform.toLowerCase();
    return platforms[os];
  }
  openAuthWindows() {
    return ipcRenderer.send('open-window-auth');
  }
  openMainWindow() {
    return ipcRenderer.send('open-window-main');
  }
  openInstallFolder() {
    shell.openPath(this.getFolderPathSboticsSimulation());
  }
  restartApp() {
    return ipcRenderer.send('restart-app');
  }
  closeAll() {
    return ipcRenderer.send('close-app');
  }
  instanceWindowAuth() {
    return ipcRenderer.send('instance-window-auth');
  }
}
export { Application };
