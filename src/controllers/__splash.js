var ipcRenderer = require('electron').ipcRenderer;
import { Application } from '../class/__instance_application.js';

let progressBar;
let application = new Application();

window.onload = () => {
  document.getElementById(
    'text-version',
  ).innerText = `Versão: ${ipcRenderer.sendSync(
    'get-version',
  )} ${ipcRenderer.sendSync('get-release-type')}`;

  if (application.SLMP()) {
    application.instanceWindowAuth();
  }
};

ipcRenderer.on('autoUpdateAvailable', (event, arg) => {
  if (arg.state) {
    document.getElementById(
      'text-update-state',
    ).innerHTML = `Atualizando sBotics Launcher! <span class="text-xs text-gray-700">Aguarde, isso pode demorar...</span>`;
    let timeCounter = 5;
    document
      .getElementById('container-progress-bar')
      .classList.remove('hidden');
    progressBar = setInterval(() => {
      document.getElementById(
        'progress-progress-bar',
      ).style.width = `${(timeCounter =
        timeCounter >= 100
          ? 2
          : timeCounter * 1.2 > 100
          ? 100
          : timeCounter * 1.2)}%`;
    }, 700);
  }
});

ipcRenderer.on('autoUpdateError', (event, arg) => {
  document.getElementById(
    'text-update-state',
  ).innerHTML = `<span class="text-xs text-red-700">${arg.message}</span>`;
  document.getElementById('button-close').classList.remove('hidden');
  document.getElementById('container-progress-bar').classList.remove('hidden');
  document.getElementById('progress-progress-bar').style.width = '100%';
  document.getElementById('progress-progress-bar').classList.add('bg-red-300');
  clearInterval(progressBar);
});

window.CloseAll = function CloseAll() {
  application.closeAll();
};
