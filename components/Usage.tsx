import React from 'react'
import { StyleSheet, Dimensions, Text, View } from 'react-native'
import { connect } from 'react-redux'

import { colors } from '../lib/colors'
import { createStructuredSelector } from 'reselect'
import { selectTheme } from '../redux/settings/settings.selectors'

interface Props {
    theme: 'light' | 'dark'
}

const Usage: React.FC<Props> = ({ theme }) => {

    const styles = getStyleSheet(theme)

    return <React.Fragment>
        <Text style={styles.tipsHeader}>Usage:</Text>
        <View style={styles.tipsContainer}>

            <View style={styles.tipContainer}>
                <Text style={styles.tipsNumber}>1. </Text><Text style={styles.tipsText}>Type a word in the searchbar</Text>
            </View>

            <View style={styles.tipContainer}>
                <Text style={styles.tipsNumber}>2. </Text><Text style={styles.tipsText}>Press a word to copy it</Text>
            </View>

            <View style={styles.tipContainer}>
                <Text style={styles.tipsNumber}>3. </Text><Text style={styles.tipsText}>Long press a word to save it</Text>
            </View>

            <View style={styles.tipContainer}>
                <Text style={styles.tipsNumber}>4. </Text><Text style={styles.tipsText}>Press the star icon to see and{'\n'}manage saved words</Text>
            </View>

            <View style={styles.tipContainer}>
                <Text style={styles.tipsNumber}>5. </Text><Text style={styles.tipsText}>Press the magnifying glass in the searchbar to search rhymezone</Text>
            </View>

            <View style={styles.tipContainer}>
                <Text style={styles.tipsNumber}>6. </Text><Text style={styles.tipsText}>Select search type from the{'\n'}options below the searchbar</Text>
            </View>

            <View style={styles.tipContainer}>
                <Text style={styles.tipsNumber}>7. </Text><Text style={styles.tipsText}>Toggle sorting by syllables{'\n'}in the settings</Text>
            </View>
        </View>
    </React.Fragment>
}

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme
})

const getStyleSheet = (theme: 'light' | 'dark') => {
    return StyleSheet.create({
        tipsText: {
            textAlign: 'left',
            fontSize: 16,
            color: colors[theme].txt,
        },
        tipsHeader: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].txt,
            marginTop: 30,
            fontWeight: '600'
        },
        tipsContainer: {
            marginLeft: Dimensions.get('window').width / 6,
            maxWidth: Dimensions.get('window').width / 1.3,
            padding: 20
        },
        tipContainer: {
            flexDirection: 'row',
            marginBottom: 15
        },
        tipsNumber: {
            fontSize: 17,
            fontWeight: 'bold',
            color: colors[theme].txt,
        },
    })
}

export default connect(mapStateToProps)(Usage)