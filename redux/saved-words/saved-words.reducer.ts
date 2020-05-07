import { SAVE_WORD, REMOVE_WORD, CLEAR_SAVED } from './saved-words.types'
import { saveWord, removeWord } from './saved-words.utils'

interface ActionTypes {
    type: string,
    payload: string
}

const INITIAL_STATE = {
    savedWords: []
}

const savedWordsReducer = (state = INITIAL_STATE, action: ActionTypes) => {
    switch (action.type) {
        case SAVE_WORD:
            return {
                ...state,
                savedWords: saveWord(state.savedWords, action.payload)
            }
        case REMOVE_WORD:
            return {
                ...state,
                savedWords: removeWord(state.savedWords, action.payload)
            }
        case CLEAR_SAVED:
            return {
                ...state,
                savedWords: []
            }
        default:
            return state
    }
}

export default savedWordsReducer