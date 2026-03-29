const THEME_STORAGE_KEY = 'muz-theme'

export type SiteTheme = 'dark' | 'light'

function resolveStoredTheme(): SiteTheme {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: SiteTheme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

let hasInjectedThemeTransition = false

function ensureThemeTransitionStyle() {
  if (hasInjectedThemeTransition) return

  const style = document.createElement('style')
  style.textContent = `
    html.theme-switching *,
    html.theme-switching *::before,
    html.theme-switching *::after {
      transition:
        background-color .25s ease,
        border-color .25s ease,
        color .25s ease,
        box-shadow .25s ease,
        filter .25s ease !important;
    }
  `
  document.head.appendChild(style)
  hasInjectedThemeTransition = true
}

export function useSiteTheme() {
  const theme = ref<SiteTheme>('dark')
  const isDark = computed(() => theme.value === 'dark')

  function setTheme(nextTheme: SiteTheme) {
    ensureThemeTransitionStyle()
    document.documentElement.classList.add('theme-switching')
    theme.value = nextTheme
    applyTheme(nextTheme)
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-switching')
    }, 280)
  }

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  onMounted(() => {
    setTheme(resolveStoredTheme())
  })

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}

export function initializeSiteTheme() {
  applyTheme(resolveStoredTheme())
}
