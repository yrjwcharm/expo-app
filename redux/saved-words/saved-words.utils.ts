import { showToast } from "../../lib/functions"

export const saveWord = (savedWords: string[], wordToAdd: string) => {
    const wordExists = savedWords.includes(wordToAdd)

    if (!wordExists) {
        //console.log(`saving: ${wordToAdd}`)
        showToast(`saved «${wordToAdd}»`)
        return [...savedWords, wordToAdd]
    }
    else {
        showToast(`«${wordToAdd}» is already saved`)
        return savedWords
    }
}

export const removeWord = (savedWords: string[], wordToRemove: string) => {
    const removedWordArray = savedWords.filter(savedWord => savedWord !== wordToRemove)
    //console.log(`removing ${wordToRemove}`)
    return removedWordArray
}