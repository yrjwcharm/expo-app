import { createSelector } from 'reselect'

interface SavedWords {
    savedWords: string[]
}

const selectSavedWordsState = (state: { savedWords: SavedWords }) => state.savedWords

export const selectSavedWords = createSelector([selectSavedWordsState], savedWords => savedWords.savedWords)