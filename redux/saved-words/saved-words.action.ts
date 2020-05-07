import { SAVE_WORD, REMOVE_WORD, CLEAR_SAVED } from './saved-words.types'

export const saveWord = (word: string) => ({
    type: SAVE_WORD,
    payload: word
})

export const removeWord = (word: string) => ({
    type: REMOVE_WORD,
    payload: word
})

export const clearSaved = () => ({
    type: CLEAR_SAVED,
})