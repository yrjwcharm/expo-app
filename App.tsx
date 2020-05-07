import * as React from 'react'
import AppNavigator from './components/AppNavigator'
import * as Font from 'expo-font'
import { SplashScreen } from 'expo'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'
import { SENTRY_DSN } from './lib/sentry.keys'

import stores from './redux/store'

import { YellowBox } from 'react-native'

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']) // TODO: Remove when fixed

interface Props {
  skipLoadingScreen: any
}

const App: React.FC<Props> = ({ skipLoadingScreen }) => {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const { store, persistor } = stores()

  React.useEffect(() => {

    Sentry.init({
      dsn: SENTRY_DSN,
      enableInExpoDevelopment: true,
      debug: (process.env.NODE_ENV === 'development' ? true : false),
    })

    if (Constants.manifest.revisionId) Sentry.setRelease(Constants.manifest.revisionId)

    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide()

        await Font.loadAsync({
          ...MaterialCommunityIcons.font,
          'mustang-regular': require('./assets/fonts/mustang.ttf'),
        })
      } catch (e) {
        Sentry.captureException(e)
      } finally {
        setLoadingComplete(true)
      }
    }
    loadResourcesAndDataAsync()
  }, [])

  if (!isLoadingComplete && !skipLoadingScreen) return null
  else return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppNavigator />
    </PersistGate>
  </Provider>
}

export default App