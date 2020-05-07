import React from 'react'
import { View, TouchableOpacity, Text, Clipboard, Keyboard, Platform, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { showToast } from '../lib/functions'
import { connect } from 'react-redux'
import { colors } from '../lib/colors'
import { saveWord } from '../redux/saved-words/saved-words.action'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectHaptics } from '../redux/settings/settings.selectors'

interface Props {
    word: string
    removeWordConfirmation: (e: string) => void
    saveWord: (e: string) => void
    hapticsEnabled: boolean
    theme: 'light' | 'dark'
    type: string
}

const RowItem: React.FC<Props> = ({ word, removeWordConfirmation, saveWord, hapticsEnabled, theme, type }) => {

    const styles = getStyleSheet(theme)

    const copyToClipboard = () => {
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success' as any)
        Keyboard.dismiss()
        Clipboard.setString(word)
        showToast(`copied «${word}» to the clipboard`)
    }

    const longPressAction = () => {
        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()

        if (type === 'search') saveWord(word)
        if (type === 'saved') removeWordConfirmation(word)
    }

    return <View style={styles.containerRowItem}>
        <TouchableOpacity
            onPress={copyToClipboard}
            onLongPress={longPressAction}>
            <Text style={styles.word}>{word}</Text>
        </TouchableOpacity>
    </View>
}

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    hapticsEnabled: selectHaptics
})

const getStyleSheet = (theme: 'light' | 'dark') => {
    return StyleSheet.create({
        word: {
            fontSize: 20,
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 10,
            color: colors[theme].txt,
        },
        containerRowItem: {
            justifyContent: 'center',
            borderColor: colors[theme].borderColor,
        },
    })
}

export default connect(mapStateToProps, { saveWord })(RowItem)