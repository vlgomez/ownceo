// Global state store — wire up Zustand / Redux / Jotai here when ready

export type AppStore = {
  user: null
  theme: 'dark' | 'light'
}

export const initialState: AppStore = {
  user: null,
  theme: 'dark',
}
