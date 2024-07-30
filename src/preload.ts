import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  // API 메서드 정의
});
