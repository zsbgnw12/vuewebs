import { ls } from '@/utils/storage'

const LOCAL_NAME = 'appSetting'

export interface AppState {
  siderCollapsed?: boolean
}

export function defaultSetting(): AppState {
  return { siderCollapsed: false }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ls.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ls.set(LOCAL_NAME, setting)
}
