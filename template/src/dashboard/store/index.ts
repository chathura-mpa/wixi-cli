import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import loaderReducer from './slices/loaderSlice';

const logger = createLogger({
    collapsed: true,
    duration: true,
    timestamp: true,
});

export const store = configureStore({
    reducer: {
        loader: loaderReducer,
        // templates: warrantyTemplatesReducer,
        // warrantyForm: warrantyFormReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;