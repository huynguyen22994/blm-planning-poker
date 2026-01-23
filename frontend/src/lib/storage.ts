export const storage = {
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  },

  remove(key: string) {
    localStorage.removeItem(key)
  },
}
