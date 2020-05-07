import { SET_THEME, USE_SYSTEM_THEME, USE_HAPTICS, SET_MAX_RESULTS, SORT_BY_SYLLABLES } from './settings.types'

interface ActionTypes {
    type: string,
    payload: string | boolean | number
}

const INITIAL_STATE = {
    theme: 'light',
    systemThemeEnabled: true,
    hapticsEnabled: true,
    maxResults: 300,
    sortedBySyllablesEnabled: true
}

const settingsReducer = (state = INITIAL_STATE, action: ActionTypes) => {
    switch (action.type) {
        case SET_THEME:
            return {
                ...state,
                theme: action.payload
            }
        case USE_SYSTEM_THEME:
            return {
                ...state,
                systemThemeEnabled: action.payload
            }
        case USE_HAPTICS:
            return {
                ...state,
                hapticsEnabled: action.payload
            }
        case SET_MAX_RESULTS:
            return {
                ...state,
                maxResults: action.payload
            }
        case SORT_BY_SYLLABLES:
            return {
                ...state,
                sortedBySyllablesEnabled: action.payload
            }
        default:
            return state
    }
}

export default settingsReducer