import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import logger from 'redux-logger'
import createSentryMiddleware from "redux-sentry-middleware"
import * as Sentry from 'sentry-expo'

import rootReducer from './root-reducer'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const middelwares: any[] = []
middelwares.push(createSentryMiddleware(Sentry))
if (process.env.NODE_ENV === 'development') middelwares.push(logger)

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
    let store: any = createStore(persistedReducer, applyMiddleware(...middelwares))
    let persistor = persistStore(store)
    return { store, persistor }
}