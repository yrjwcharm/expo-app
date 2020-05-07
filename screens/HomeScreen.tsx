import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Keyboard, Platform } from 'react-native'
import { Searchbar, Button } from 'react-native-paper'
import * as WebBrowser from 'expo-web-browser'
import * as Haptics from 'expo-haptics'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { ScrollView } from 'react-native-gesture-handler'
import * as Sentry from 'sentry-expo'

import SearchResults from '../components/SearchResults'
import { showToast } from '../lib/functions'
import { connect } from 'react-redux'
import { colors } from '../lib/colors'
import ButtonIcon from '../components/ButtonIcon'

import searchTypes from '../lib/searchTypes'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectHaptics } from '../redux/settings/settings.selectors'
import { SplashScreen } from 'expo'

interface Navigation {
    navigate: (e: string) => void
}

interface Props {
    theme: 'light' | 'dark'
    hapticsEnabled: boolean
    navigation: Navigation
}

const HomeScreen: React.FC<Props> = ({ theme, hapticsEnabled, navigation }) => {

    const styles = getStyleSheet(theme)

    const [searchTerm, setSearchTerm] = useState('')
    const [searchEndpoint, setSearchEndpoint] = useState('rel_rhy')

    useEffect(() => {
        SplashScreen.hide()
    }, [])

    const searchRhymeZone = async () => {
        if (searchTerm === undefined || searchTerm === '') {
            if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('error')
            Keyboard.dismiss()
            showToast('Enter a search term to search rhymezone')
        }
        else if (searchTerm.includes(' ')) {
            if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('error')
            Keyboard.dismiss()
            showToast('Phrases are currently unsupported')
        }
        else {
            if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
            await WebBrowser.openBrowserAsync(`https://www.rhymezone.com/r/rhyme.cgi?Word=${searchTerm}&typeofrhyme=perfect&org1=syl&org2=l&org3=y`)
                .catch(e => Sentry.captureException(e))
        }
    }

    const updateTerm = (term: string) => {
        if (term[term.length - 1] === ' ') setSearchTerm(term.substring(0, term.length - 1))
        else setSearchTerm(term)
    }

    return <View style={styles.container}>
        <Searchbar
            keyboardAppearance={theme}
            placeholderTextColor={colors[theme].txt}
            style={styles.searchBar}
            iconColor={theme === 'dark' ? 'white' : 'gray'}
            inputStyle={{ color: colors[theme].txt }}
            placeholder='Search'
            onChangeText={term => updateTerm(term)}
            value={searchTerm}
            onIconPress={() => searchRhymeZone()} />
        <View style={styles.typeContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} onScroll={Keyboard.dismiss} scrollEventThrottle={1000}>
                {
                    searchTypes.map(searchType =>
                        <Button
                            key={searchType.endPoint}
                            style={styles.button}
                            color={colors[theme].txt}
                            mode={searchEndpoint === searchType.endPoint ? 'contained' : 'outlined'}
                            onPress={() => {
                                if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                                setSearchEndpoint(searchType.endPoint)
                            }}>
                            {searchType.type}
                        </Button>
                    )
                }
            </ScrollView>
        </View>
        <SearchResults term={searchTerm} searchEndpoint={searchEndpoint} />

        <View style={styles.buttonContainer}>
            <ButtonIcon icon='settings-outline' styles={styles} onPress={() => {
                if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                navigation.navigate('Settings Screen')
            }} />
            <ButtonIcon icon='star-outline' styles={styles} onPress={() => {
                if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                navigation.navigate('Saved Screen')
            }} />
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
            justifyContent: 'center',
            backgroundColor: colors[theme].bg,
        },
        searchBar: {
            borderRadius: 20,
            margin: 20,
            backgroundColor: colors[theme].sbBg
        },
        icon: {
            marginTop: (Platform.OS === 'ios' ? 2 : -2),
            textAlign: 'center',
            color: (theme === 'dark' ? colors.dark.iconColor : colors.light.iconColor),
        },
        iconContainer: {
            width: 45,
            height: 45,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: colors[theme].borderColorBtn,
            justifyContent: 'center',
            margin: 15,
            marginBottom: 10 + getBottomSpace()
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-evenly'
        },
        button: {
            alignSelf: 'center',
            marginLeft: 10,
            borderColor: colors[theme].borderColorBtn
        },
        typeContainer: {
            marginBottom: 20,
            marginLeft: 10,
            marginRight: 20,
        }
    })
}

export default connect(mapStateToProps)(HomeScreen)