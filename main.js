

const electron = require('electron');

require('electron-reload')(__dirname);


var args = process.argv.slice(2);


const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
var mainWindow = null;

app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }});

app.on('ready', function() {
    const myLocation = 'file://' + __dirname
    mainWindow = new BrowserWindow({width:800, height: 800,resizable: true,title:'Dan Ellis 2016' ,
                                        webPreferences: {
  nodeIntegration: true
},
    show:true});
    mainWindow.openDevTools();    // and load the index.html of the app.
    mainWindow.loadURL( myLocation + '/'+ (args[0]||'index.html')+'#'+args[1]);


    mainWindow.on('closed', function() { mainWindow = null;  app.quit();});
});



///pdf

// import the following to deal with pdf
const fs = require('fs');
const os = require('os');
const ipc = electron.ipcMain;
const shell = electron.shell;

const path = require('path')
const url = require('url')

ipc.on('print-to-pdf', (event,arg) => {
  const pdfPath = path.join(//os.tmpdir(),
  './',arg+'.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);

  win.webContents.printToPDF({}, (error, data) => {
    if (error) return console.log(error.message);

    fs.writeFile(pdfPath, data, err => {
      if (err) return console.log(err.message);
      app.exit()
      //shell.openExternal('file://' + pdfPath);
      //event.sender.send('wrote-pdf', pdfPath);
    })

  })
});


