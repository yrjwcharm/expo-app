import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native'
import { Switch, Button } from 'react-native-paper'
import { connect } from 'react-redux'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import Constants from 'expo-constants'
import * as Haptics from 'expo-haptics'
import * as StoreReview from 'expo-store-review'
import { Linking } from 'expo'
import * as WebBrowser from 'expo-web-browser'
import * as Sentry from 'sentry-expo'

import { maxResultsDropdownItems, themeDropdownItems } from '../lib/dropdownItems'
import { colors } from '../lib/colors'
import Dropdown from '../components/Dropdown'
import { setCurrentTheme, useSystemTheme, useHaptics, setMaxResults, sortBySyllables } from '../redux/settings/settings.action'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectHaptics, selectSystemThemeEnabled, selectMaxResults, selectSortedBySyllablesEnabled } from '../redux/settings/settings.selectors'

interface Props {
    theme: 'light' | 'dark'
    hapticsEnabled: boolean
    sortedBySyllablesEnabled: boolean
    maxResults: number
    systemThemeEnabled: boolean
    setCurrentTheme: (e: 'light' | 'dark') => void
    useSystemTheme: (e: boolean) => void
    useHaptics: (e: boolean) => void
    setMaxResults: (e: number) => void
    sortBySyllables: (e: boolean) => void
}

const SettingsScreen: React.FC<Props> = ({
    theme,
    hapticsEnabled,
    sortedBySyllablesEnabled,
    maxResults,
    systemThemeEnabled,
    setCurrentTheme,
    useSystemTheme,
    useHaptics,
    setMaxResults,
    sortBySyllables
}) => {

    const styles = getStyleSheet(theme)

    const [selectedTheme, setSelectedTheme] = useState('system')

    useEffect(() => {
        if (systemThemeEnabled) setSelectedTheme('system')
        else setSelectedTheme(theme)
    }, [])

    const openLink = async (link: string) => await WebBrowser.openBrowserAsync(link).catch(e => Sentry.captureException(e))

    const onValueChange = (type: 'theme' | 'maxResults', value: any) => {
        if (type === 'theme') {
            if (value === 'system') {
                useSystemTheme(true)
                setSelectedTheme('system')
            }
            if (value === 'light' || value === 'dark') {
                setSelectedTheme(value)
                setCurrentTheme(value)
                useSystemTheme(false)
            }
        }
        if (type === 'maxResults') {
            setMaxResults(value)
        }
    }

    return <View style={styles.container}>
        <Dropdown
            label='Theme:'
            textStyle={styles.text}
            value={selectedTheme}
            onValueChange={onValueChange}
            type='theme'
            placeholder={{ label: 'Select Theme', value: null, color: '#9EA0A4' }}
            items={themeDropdownItems} />
        <Dropdown
            label='Max Results:'
            textStyle={styles.text}
            value={maxResults}
            onValueChange={onValueChange}
            type='maxResults'
            placeholder={{ label: 'Select Max Results', value: null, color: '#9EA0A4' }}
            items={maxResultsDropdownItems} />
        {
            Platform.OS === 'ios' ?
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.text}>Haptics:</Text>
                    <Switch
                        style={styles.toTheRight}
                        color='grey'
                        value={hapticsEnabled}
                        onValueChange={() => useHaptics(!hapticsEnabled)
                        } />
                </View>
                : null
        }

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.text}>Results by syllable:</Text>
            <Switch
                style={styles.toTheRight}
                color='grey'
                value={sortedBySyllablesEnabled}
                onValueChange={() => sortBySyllables(!sortedBySyllablesEnabled)
                } />
        </View>

        <View style={{ marginBottom: getBottomSpace() }}>
            <Text style={styles.header}>About the App:</Text>
            <View style={{ flexDirection: 'row' }}>
                <Button
                    style={styles.button}
                    color={colors[theme].txt}
                    mode='outlined'
                    onPress={() => {
                        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                        StoreReview.requestReview()
                    }}>
                    Rate App
                        </Button>
                <Button
                    style={styles.button}
                    color={colors[theme].txt}
                    mode='outlined'
                    onPress={() => {
                        if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                        Linking.openURL('mailto:andor.davoti@gmail.com')
                    }}>
                    Contact me
                        </Button>
            </View>
            <TouchableOpacity onPress={() => openLink('https://andordavoti.com')}>
                <Text style={styles.textAuthor}>Developed by Andor Davoti</Text>
            </TouchableOpacity>
            <Text style={styles.textVersion}>Version: {Constants.manifest.version}</Text>
        </View>
    </View>
}

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    hapticsEnabled: selectHaptics,
    systemThemeEnabled: selectSystemThemeEnabled,
    maxResults: selectMaxResults,
    sortedBySyllablesEnabled: selectSortedBySyllablesEnabled
})

const getStyleSheet = (theme: 'light' | 'dark') => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors[theme].bg,
        },
        text: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].txt,
            margin: 10,
        },
        textAuthor: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].txt,
            margin: 10,
            fontStyle: 'italic'
        },
        textVersion: {
            textAlign: 'center',
            fontSize: 20,
            color: colors[theme].txt,
            margin: 10,
            fontWeight: 'bold'
        },
        header: {
            textAlign: 'center',
            fontSize: 25,
            color: colors[theme].txt,
            fontWeight: '600',
            margin: 10,
            marginTop: 50
        },
        button: {
            alignSelf: 'center',
            margin: 15,
            borderColor: colors[theme].borderColorBtn
        },
        rowData: {
            minHeight: 30,
            marginLeft: 25,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        toTheRight: {
            marginRight: 10
        },
    })
}

export default connect(mapStateToProps, { setCurrentTheme, useSystemTheme, useHaptics, setMaxResults, sortBySyllables })(SettingsScreen)