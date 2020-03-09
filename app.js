const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");

let window;

function createWindow(){
    window = new BrowserWindow({
        width: 1366,
        height: 768,
        
    })

    window.loadURL(
        url.format(
            {
                pathname: path.join(__dirname,'dist/index.html'),
                protocol: "file:",
                slashes: true
            }
        )
    )

    window.setMenu(null)

    window.on('closed', ()=>{
        win = null
    })
    window.resizable = false
}


app.on('ready', createWindow)

app.on('window-all-closed', ()=>{

    if(process.platform !== 'darwin'){//check if macOS
        app.quit()
    }
})

app.on('activate', ()=>{
    if(window === null){
        createWindow()
    }
})