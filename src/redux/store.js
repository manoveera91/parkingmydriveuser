import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'

import transferReducer from './dataTransfer'
import SearchReducer from './searchSlice'
import UserReducer from './userSlice'
import { persistReducer } from 'redux-persist';

const reducers = combineReducers({
    data: transferReducer,
    search: SearchReducer,
    user: UserReducer
});

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['search/searchSubmit']
            },
        }),
})




