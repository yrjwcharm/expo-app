import { combineReducers } from 'redux'

import savedWordsReducer from './saved-words/saved-words.reducer'
import settingsReducer from './settings/settings.reducer'

export default combineReducers({
    savedWords: savedWordsReducer,
    settings: settingsReducer
})