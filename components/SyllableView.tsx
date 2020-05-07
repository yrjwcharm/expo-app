import React, { useState, useEffect } from 'react'
import { StyleSheet, FlatList, View, Platform } from 'react-native'
import { Button } from 'react-native-paper'
import Collapsible from 'react-native-collapsible'
import { connect } from 'react-redux'
import * as Haptics from 'expo-haptics'
import { colors } from '../lib/colors'
import RowItem from '../components/RowItem'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectHaptics } from '../redux/settings/settings.selectors'

interface WordItem {
    word: string
}

interface Data {
    numSyllables: number
    result_list: WordItem[]
}

interface Props {
    initiallyCollapsed: boolean
    data: Data
    theme: 'light' | 'dark'
    hapticsEnabled: boolean
}

const SyllableView: React.FC<Props> = ({ initiallyCollapsed, data, theme, hapticsEnabled }) => {

    const styles = getStyleSheet(theme)

    const [collapsed, setCollapsed] = useState(true)

    useEffect(() => {
        setCollapsed(initiallyCollapsed)
    }, [])

    const renderRow = (word: string) => (
        <View style={styles.resultsContainer}>
            <RowItem type='search' word={word} />
        </View>
    )

    return <View style={styles.container}>
        <Button
            style={{ flex: 1, alignSelf: 'center', margin: 10, marginBottom: 20, borderColor: colors[theme].txt }}
            color={colors[theme].txt}
            mode={collapsed ? 'outlined' : 'contained'}
            onPress={() => {
                if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                setCollapsed(!collapsed)
            }
            }>Syllable: {data.numSyllables}</Button>
        <Collapsible collapsed={collapsed}>
            <FlatList
                contentContainerStyle={{ marginTop: 10 }}
                key={data.numSyllables}
                removeClippedSubviews={false}
                data={data.result_list}
                keyExtractor={(item: WordItem) => item.word}
                renderItem={({ item }) => renderRow(item.word)}
                scrollEnabled={false}
                numColumns={2} />
        </Collapsible>
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
            paddingBottom: 10,
        },
        resultsContainer: {
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: colors[theme].borderColor,
        },
    })
}

export default connect(mapStateToProps)(SyllableView)