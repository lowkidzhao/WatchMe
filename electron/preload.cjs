const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	onCloseVueApp: (callback) => ipcRenderer.on("close-vue-app", callback),
	sendVueAppClosed: () => ipcRenderer.send("vue-app-closed"),
	callMainMethod: (arg) => ipcRenderer.invoke("call-main-method", arg),
	minimizeWindow: () => ipcRenderer.send("minimize-window"),
	closeWindow: () => ipcRenderer.send("close-window"),
});
