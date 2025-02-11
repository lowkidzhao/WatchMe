const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	onCloseVueApp: (callback) => ipcRenderer.on("close-vue-app", callback),
	sendVueAppClosed: () => ipcRenderer.send("vue-app-closed"),
});
