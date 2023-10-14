import { combineReducers, configureStore } from '@reduxjs/toolkit';
import existingAccountsReducer from '../slices/existingAccountsSlice';

const rootReducer = combineReducers({
	existingAccounts: existingAccountsReducer
});

const store = configureStore({
	reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
