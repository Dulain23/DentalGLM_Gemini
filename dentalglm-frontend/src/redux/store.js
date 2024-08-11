import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import errorReducer from "./error/errorSlice";
import { persistReducer, persistStore } from "redux-persist";
import sessionStorage from "redux-persist/es/storage/session";

// Combine Reducers
const rootReducer = combineReducers({ 
    user: userReducer,
    error: errorReducer,
});

// Setup Redux Persist 
const persistConfig = {
    key: 'root',
    version: 1,
    storage: sessionStorage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);