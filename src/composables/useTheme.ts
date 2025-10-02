import { computed, ref, watchEffect } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'vk-theme'
const preference = ref<ThemePreference>(read())
const systemDark = ref(typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches)

function read(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

if (typeof matchMedia === 'function') {
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => (systemDark.value = e.matches))
}

/** Shared light/dark/system switch; writes data-theme on <html>, which the tokens respond to. */
export function useTheme() {
  watchEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (preference.value === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', preference.value)
    try {
      if (preference.value === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, preference.value)
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this session.
    }
  })

  return {
    preference,
    resolved: computed<'light' | 'dark'>(() => (preference.value === 'system' ? (systemDark.value ? 'dark' : 'light') : preference.value)),
    set: (value: ThemePreference) => (preference.value = value),
  }
}
