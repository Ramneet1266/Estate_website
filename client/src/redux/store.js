import { combineReducers, configureStore } from "@reduxjs/toolkit"
import userReducer from "../redux/user/userSlice"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({ user: userReducer })
//perist is used to store the reducers inside the localstorage and here the key storage and version of localstorage is defined
const peristedConfig = {
	key: "root",
	storage,
	version: 1
}
const persistedReducer = persistReducer(peristedConfig, rootReducer)
export const store = configureStore({
	reducer: persistedReducer,
	//this will not give error for not serializabling the variables
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			serializableCheck: false
		})
})

export const persistor = persistStore(store)
