var ipcRenderer = require('electron').ipcRenderer;
import { UpdateInit, UpdateAvailable, UpdateInstall } from '../utils/autoupdate-manager.js';

var donwloadStateInit = false;

async function AutoUpdateLauncher() {
  try {
    console.log('Buscando atualização');
    if (UpdateInit()) {
      if (await UpdateAvailable()['state']) {
        console.log('Atualização disponível baixando! Por favor, espere...');
        donwloadStateInit = true;
      } else {
        console.log('sBotics Launcher está na última versão disponível!');
      }
    }

    // else if (!SLMP()) {
    //       console.log('Não foi possível procurar atualizações. Tente mais tarde!');
    //     }
  } catch (error) {
    console.log(
      'A pesquisa de atualização foi abortada devido a uma falha localizada!',
    );
  }
}

window.onload = () => {
  document.getElementById(
    'text-version',
  ).innerText = `Versão: ${ipcRenderer.sendSync('get-version')} BETA`;
  AutoUpdateLauncher();
};

ipcRenderer.on('update-download-progress', (event, arg) => {
  console.log(arg['progress']['percent']);

  //   const percentage =
  //     arg['progress']['percent'] == 100 && donwloadStateCallback
  //       ? 1
  //       : arg['progress']['percent'];
  //   donwloadStateCallback = false;
  //   if (donwloadStateInit)
  //     Update({
  //       id: 'LoadBar',
  //       addState: 'success',
  //       removeState: 'info',
  //       percentage: percentage,
  //       text: [
  //         {
  //           textContainer: 'TextProgress',
  //           message: `<i class="fas fa-file-archive text-success"></i> <strong style="margin-left: 13px">${Lang(
  //             'Update available by downloading! Please wait...',
  //           )}</strong>`,
  //         },
  //       ],
  //     });
});

ipcRenderer.on('update-downloaded', (event, arg) => {
  (async () => {
    console.log('Reiniciando para finalizar a atualização...');
    // Update({
    //   id: 'LoadBar',
    //   addState: 'success',
    //   removeState: 'info',
    //   percentage: 100,
    //   text: [
    //     {
    //       textContainer: 'TextProgress',
    //       message: `<i class="fas fa-redo-alt text-success"></i> <strong style="margin-left: 13px">${Lang(
    //         'Restarting to finish update...',
    //       )}</strong>`,
    //     },
    //   ],
    // });
    // await asyncWait(300);
    UpdateInstall();
  })();
});
