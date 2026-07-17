export function localGet(key: string) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(value as string)
  } catch {
    return value
  }
}

export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove(key: string) {
  window.localStorage.removeItem(key)
}

export function localClear() {
  window.localStorage.clear()
}
