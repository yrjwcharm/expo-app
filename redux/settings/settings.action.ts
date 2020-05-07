import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS, SET_MAX_RESULTS, SORT_BY_SYLLABLES } from './settings.types'

export const setCurrentTheme = (theme: 'light' | 'dark') => ({
    type: SET_THEME,
    payload: theme
})

export const useSystemTheme = (systemThemeEnabled: boolean) => ({
    type: USE_SYSTEM_THEME,
    payload: systemThemeEnabled
})

export const useHaptics = (hapticsEnabled: boolean) => ({
    type: USE_HAPTICS,
    payload: hapticsEnabled
})

export const setMaxResults = (maxResults: number) => ({
    type: SET_MAX_RESULTS,
    payload: maxResults
})

export const sortBySyllables = (sortedBySyllablesEnabled: boolean) => ({
    type: SORT_BY_SYLLABLES,
    payload: sortedBySyllablesEnabled
})