import * as React from 'react'
import { StatusBar, Platform, View } from 'react-native'
import { Button } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import { AppearanceProvider, useColorScheme } from 'react-native-appearance'
import * as Haptics from 'expo-haptics'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

import HomeScreen from '../screens/HomeScreen'
import SavedScreen from '../screens/SavedScreen'
import SettingsScreen from '../screens/SettingsScreen'

import { connect } from 'react-redux'
import { setCurrentTheme } from '../redux/settings/settings.action'
import { colors } from '../lib/colors'
import { createStructuredSelector } from 'reselect'
import { selectTheme, selectSystemThemeEnabled, selectHaptics } from '../redux/settings/settings.selectors'

interface Props {
    theme: 'light' | 'dark'
    setCurrentTheme: (e: 'light' | 'dark') => void
    systemThemeEnabled: boolean
    hapticsEnabled: boolean
}

const AppNavigator: React.FC<Props> = ({ theme, setCurrentTheme, systemThemeEnabled, hapticsEnabled }) => {
    const deviceTheme = useColorScheme()
    if ((deviceTheme === 'light' || deviceTheme === 'dark') && systemThemeEnabled) {
        setCurrentTheme(deviceTheme)
    }

    const Stack = createStackNavigator()
    return (
        <AppearanceProvider>
            <NavigationContainer>
                {Platform.OS === 'ios' && <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />}
                <Stack.Navigator
                    mode='modal'
                    headerMode='screen'
                    screenOptions={{
                        ...TransitionPresets.ModalPresentationIOS,
                        gestureEnabled: true,
                        cardOverlayEnabled: true,
                        cardShadowEnabled: true,
                    }}>
                    <Stack.Screen
                        name='Home Screen'
                        component={HomeScreen}
                        options={{
                            title: 'Fast Rhymes',
                            headerTitleAlign: 'center',
                            headerStyle: {
                                backgroundColor: colors[theme].bg,
                                shadowColor: 'transparent',
                                borderBottomWidth: 0,
                            },
                            headerTitleStyle: {
                                marginTop: 10,
                                fontSize: 30,
                                fontFamily: 'mustang-regular'
                            },
                            headerTintColor: colors[theme].txt
                        }} />
                    <Stack.Screen
                        name='Saved Screen'
                        component={SavedScreen}
                        options={({ navigation }) => ({
                            headerLeft: () => null,
                            headerRight: () => (
                                <TouchableOpacity onPress={() => {
                                    navigation.pop()
                                    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                                }}>
                                    <MaterialCommunityIcons
                                        style={{ marginRight: 25, color: colors[theme].txt }}
                                        name='close'
                                        size={22}
                                    />
                                </TouchableOpacity>
                            ),
                            title: 'Saved Words',
                            headerTitleAlign: 'center',
                            headerStyle: {
                                backgroundColor: colors[theme].bg,
                                shadowColor: 'transparent',
                                borderBottomWidth: 0,
                            },
                            headerTintColor: colors[theme].txt
                        })} />
                    <Stack.Screen
                        name='Settings Screen'
                        component={SettingsScreen}
                        options={({ navigation }) => ({
                            headerLeft: () => null,
                            headerRight: () => (
                                <TouchableOpacity onPress={() => {
                                    navigation.pop()
                                    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync()
                                }}>
                                    <MaterialCommunityIcons
                                        style={{ marginRight: 25, color: colors[theme].txt }}
                                        name='close'
                                        size={22}
                                    />
                                </TouchableOpacity>
                            ),
                            title: 'Settings',
                            headerTitleAlign: 'center',
                            headerStyle: {
                                backgroundColor: colors[theme].bg,
                                shadowColor: 'transparent',
                                borderBottomWidth: 0,
                            },
                            headerTintColor: colors[theme].txt
                        })} />
                </Stack.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
    )
}

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    systemThemeEnabled: selectSystemThemeEnabled,
    hapticsEnabled: selectHaptics
})

export default connect(mapStateToProps, { setCurrentTheme })(AppNavigator)