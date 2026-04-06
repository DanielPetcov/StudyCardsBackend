import { INestApplicationContext } from "@nestjs/common"

let appContext: INestApplicationContext | null = null

export function setAppContext(app: INestApplicationContext) {
  appContext = app
}

export function getAppContext() {
  if (!appContext) throw new Error("Nest app context not initialized")
  return appContext
}