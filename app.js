const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");

let window;

function createWindow(){
    window = new BrowserWindow({
        width: 800,
        height: 600,
    })

    window.loadURL(
        url.format(
            {
                pathname: path.join(__dirname, 'dist/index.html'),
                protocol: "file:",
                slashes: true
            }
        )
    )

    window.on('closed', ()=>{
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', ()=>{

    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', ()=>{
    if(window === null){
        createWindow()
    }
})