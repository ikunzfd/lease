import { defineStore } from 'pinia'

interface DarkModeState {
  darkMode: boolean
}

export const useDarkModeStore = defineStore({
  id: 'app-h5-dark-mode',
  state: (): DarkModeState => ({
    darkMode: false,
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
  },
  persist: true,
})
