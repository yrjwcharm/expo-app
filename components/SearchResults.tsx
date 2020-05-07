import React, { useState, useEffect } from 'react'
import { View, FlatList, Text, StyleSheet, Keyboard } from 'react-native'
import axios from 'axios'
import NetInfo from '@react-native-community/netinfo'
import * as Sentry from 'sentry-expo'

import { connect } from 'react-redux'
import { colors } from '../lib/colors'

import Usage from './Usage'
import SyllableView from './SyllableView'
import { ScrollView } from 'react-native-gesture-handler'
import RowItem from './RowItem'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectMaxResults, selectSortedBySyllablesEnabled } from '../redux/settings/settings.selectors'

interface Props {
    theme: 'light' | 'dark'
    term: string
    searchEndpoint: string
    maxResults: number
    sortedBySyllablesEnabled: boolean
}

interface ResultData {
    numSyllables: number
    word: string
    score: number
}

type ArrayBySyllable = {
    [key: number]: {
        numSyllables: number
        result_list: ResultData[]
    }
}

const SearchResults: React.FC<Props> = ({ theme, term, searchEndpoint, maxResults, sortedBySyllablesEnabled }) => {

    const styles = getStyleSheet(theme)

    const [results, setResults] = useState<ResultData[]>([])
    const [sortedResults, setSortedResults] = useState<any[]>([])
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => setConnected(state.isConnected))
        return () => {
            unsubscribe()
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [term, searchEndpoint])

    const categorizeBySyllable = (originalData: ResultData[]) => {
        const newArr: ArrayBySyllable = {}
        for (const { numSyllables, word, score } of originalData) {
            const prevValues = newArr[numSyllables]

            const prevResults = prevValues ? prevValues.result_list : []
            newArr[numSyllables] = {
                numSyllables: numSyllables,
                result_list: [...prevResults, { numSyllables, word, score }]
            }
        }
        return Object.values(newArr);
    }

    const fetchData = async () => {
        try {
            const result = await axios.get(`https://api.datamuse.com/words?max=${maxResults}&${searchEndpoint}=${term}`)
            setResults(result.data)
            if (sortedBySyllablesEnabled) setSortedResults(categorizeBySyllable(result.data))
        } catch (e) {
            Sentry.captureException(e)
        }
    }

    const renderRow = (word: string) => (
        <View style={styles.resultsContainer}>
            <RowItem type='search' word={word} />
        </View>
    )

    const showResults = () => {
        if (connected) {
            if (Boolean(results.length)) {
                if (sortedBySyllablesEnabled && (searchEndpoint === 'rel_rhy' || searchEndpoint === 'sl')) {
                    return <ScrollView style={{ flex: 1 }} onScrollBeginDrag={Keyboard.dismiss}>
                        {
                            sortedResults.map((item: ResultData, index: number) =>
                                <SyllableView
                                    key={item.numSyllables}
                                    data={item}
                                    initiallyCollapsed={index === 0 ? false : true}
                                />)
                        }
                    </ScrollView>
                }
                return <FlatList
                    removeClippedSubviews={false}
                    data={results}
                    keyExtractor={item => item.word}
                    renderItem={({ item }) => renderRow(item.word)}
                    numColumns={2}
                    onScrollBeginDrag={Keyboard.dismiss}
                />
            }
            if (results.length === 0 && term.length > 0 && !term.includes(' ')) {
                return <React.Fragment>
                    <Text style={styles.noresults}>No Results Found</Text>
                    <Text style={styles.noresultsHelper}>Try a different word or tap the magnifying glass in the searchbar to search rhymezone</Text>
                </React.Fragment>
            }
            if (term === '') return <Usage />
        }
        if (!connected) return <Text style={styles.noresults}>Please make sure you are connected to the internet and try again</Text>
    }

    return <View style={{ flex: 1 }}>{showResults()}</View>
}

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    maxResults: selectMaxResults,
    sortedBySyllablesEnabled: selectSortedBySyllablesEnabled,
})

const getStyleSheet = (theme: 'light' | 'dark') => {
    return StyleSheet.create({
        resultsContainer: {
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: colors[theme].borderColor,
        },
        noresults: {
            marginTop: 20,
            textAlign: 'center',
            fontSize: 18,
            color: colors[theme].txt,
        },
        noresultsHelper: {
            textAlign: 'center',
            fontSize: 14,
            color: colors[theme].txt,
            marginTop: 30,
            marginLeft: 30,
            marginRight: 30,
            lineHeight: 30,
            marginBottom: 120,
        }
    })
}

export default connect(mapStateToProps)(SearchResults)