import { BrowserWindow } from 'electron'

export default function createWindow() {
  let win = new BrowserWindow({
    minHeight: 400,
    minWidth: 400,
    show: false,
    webPreferences: {
      devTools: true,
    },
  })
  win.on('ready-to-show', () => {
    win.show()
  })
  win.on('close', () => {
    win = null
  })
  return win
}
