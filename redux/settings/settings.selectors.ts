import { createSelector } from 'reselect'

interface SettingsType {
    theme: 'light' | 'dark'
    maxResults: number
    sortedBySyllablesEnabled: boolean
    hapticsEnabled: boolean
    systemThemeEnabled: boolean
}

const selectSettingsState = (state: { settings: SettingsType }) => state.settings

export const selectSettings = createSelector([selectSettingsState], settings => settings)
export const selectTheme = createSelector([selectSettingsState], settings => settings.theme)
export const selectMaxResults = createSelector([selectSettingsState], settings => settings.maxResults)
export const selectSortedBySyllablesEnabled = createSelector([selectSettingsState], settings => settings.sortedBySyllablesEnabled)
export const selectHaptics = createSelector([selectSettingsState], settings => settings.hapticsEnabled)
export const selectSystemThemeEnabled = createSelector([selectSettingsState], settings => settings.systemThemeEnabled)