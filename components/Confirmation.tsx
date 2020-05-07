import React from 'react'
import { StyleSheet, View, Text, Platform } from 'react-native'
import { Button } from 'react-native-paper'
import * as Haptics from 'expo-haptics';
import { getBottomSpace } from 'react-native-iphone-x-helper'

import { colors } from '../lib/colors'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectHaptics } from '../redux/settings/settings.selectors'

interface Props {
    theme: 'light' | 'dark'
    hapticsEnabled: boolean
    cancelAction: () => void
    submitAction: () => void
    question: string
    submitText: string
}

const Confirmation: React.FC<Props> = ({ theme, hapticsEnabled, cancelAction, submitAction, question, submitText }) => {

    const styles = getStyleSheet(theme)

    return <View style={styles.container}>
        <Text style={styles.text}>{question}</Text>
        <View style={{ flexDirection: 'row' }}>
            <Button
                icon='delete'
                style={{ margin: 10, borderColor: colors[theme].txt }}
                color={colors[theme].txt}
                mode="outlined"
                onPress={() => {
                    submitAction()
                    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success' as any)
                }}>
                {submitText}
            </Button>
            <Button
                style={{ margin: 10, borderColor: colors[theme].txt }}
                color={colors[theme].txt}
                mode="outlined"
                onPress={() => {
                    cancelAction()
                    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                }}>
                Cancel
      </Button>
        </View>
    </View>
}

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    hapticsEnabled: selectHaptics
})

const getStyleSheet = (theme: 'light' | 'dark') => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: getBottomSpace() + 10
        },
        text: {
            fontSize: 20,
            margin: 20,
            textAlign: 'center',
            lineHeight: 35,
            color: colors[theme].txt,
        },
    })
}

export default connect(mapStateToProps)(Confirmation)