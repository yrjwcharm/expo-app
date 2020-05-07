import React, { useState } from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, Platform } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Button } from 'react-native-paper'
import * as Haptics from 'expo-haptics'
import { getBottomSpace } from 'react-native-iphone-x-helper'

import { connect } from 'react-redux'
import { removeWord, clearSaved } from '../redux/saved-words/saved-words.action'

import { colors } from '../lib/colors'
import RowItem from '../components/RowItem'
import Confirmation from '../components/Confirmation'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectHaptics } from '../redux/settings/settings.selectors'
import { selectSavedWords } from '../redux/saved-words/saved-words.selectors'

interface Props {
    theme: 'light' | 'dark'
    savedWords: string[]
    removeWord: (e: string) => void
    clearSaved: () => void
    hapticsEnabled: boolean
}

const SavedScreen: React.FC<Props> = ({ theme, savedWords, removeWord, clearSaved, hapticsEnabled }) => {

    const styles = getStyleSheet(theme)

    const [confirmationWord, setConfirmationWord] = useState('')
    const [confirmation, setConfirmation] = useState(false)

    const renderRow = (word: string, index: number) => {
        if (index === 0 || index === 1) {
            return <View style={{ ...styles.resultContainer, borderTopWidth: StyleSheet.hairlineWidth }}>
                <RowItem type='saved' removeWordConfirmation={removeWordConfirmation} word={word} />
            </View>
        } else {
            return <View style={styles.resultContainer}>
                <RowItem type='saved' removeWordConfirmation={removeWordConfirmation} word={word} />
            </View>
        }
    }

    const removeWordConfirmation = (word: string) => setConfirmationWord(word)

    const renderSavedWords = () => (
        <View>
            <FlatList
                style={{ flex: 1, width: Dimensions.get('window').width, marginTop: 40 }}
                removeClippedSubviews={false}
                data={savedWords}
                keyExtractor={word => word}
                renderItem={({ item, index }) => renderRow(item, index)}
                numColumns={2} />
            <Button
                style={styles.button}
                icon='delete'
                color={colors[theme].txt}
                mode='outlined'
                onPress={() => {
                    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                    setConfirmation(true)
                }}>
                Clear All
            </Button>
        </View>
    )

    const renderNoSavedWords = () => (
        <View style={{ marginBottom: getBottomSpace() }}>
            <MaterialCommunityIcons
                name={'information-outline'}
                size={40}
                style={styles.icon} />
            <Text style={styles.text}>Long press a word {'\n'} to save it here</Text>
        </View>
    )

    const renderConfirmationWord = () => (
        <Confirmation
            question={`Do you want to remove «${confirmationWord}» ${'\n'} from saved words?`}
            submitText='Remove'
            submitAction={() => {
                removeWord(confirmationWord)
                setConfirmationWord('')
            }
            }
            cancelAction={() => {
                setConfirmationWord('')
            }}
        />
    )

    const renderConfirmation = () => (
        <Confirmation
            question={`Do you want to clear ${'\n'} all saved words?`}
            submitText='Clear'
            submitAction={() => {
                clearSaved()
                setConfirmation(false)
            }}
            cancelAction={() => {
                setConfirmation(false)
            }}
        />
    )

    const renderContent = () => {
        if (confirmation == false && confirmationWord === '') {
            if (savedWords.length === 0) return renderNoSavedWords()
            else if (savedWords.length > 0) return renderSavedWords()
        }
        else if (confirmation == true && confirmationWord === '') return renderConfirmation()
        else if (confirmationWord.length > 0) return renderConfirmationWord()
    }

    return <View style={styles.container}>
        {renderContent()}
    </View>
}

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    hapticsEnabled: selectHaptics,
    savedWords: selectSavedWords
})

const getStyleSheet = (theme: 'light' | 'dark') => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: colors[theme].bg,
            alignItems: 'center',
        },
        resultContainer: {
            flex: 1,
            marginLeft: 10,
            marginRight: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: colors[theme].borderColor
        },
        button: {
            alignSelf: 'center',
            marginBottom: getBottomSpace() + 10,
            margin: 20,
            borderColor: colors[theme].borderColorBtn
        },
        icon: {
            textAlign: 'center',
            color: (theme === 'dark' ? colors.dark.iconColor : colors.light.iconColor),
        },
        text: {
            textAlign: 'center',
            color: colors[theme].txt,
            fontSize: 18,
            margin: 5,
            lineHeight: 30
        },
    })
}

export default connect(mapStateToProps, { removeWord, clearSaved })(SavedScreen)