import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../../types/types';

const initialState: Account[] = [];

const existingAccountsSlice = createSlice({
	name: 'existing-account',
	initialState,
	reducers: {
		setExistingAccounts: (_state, action: PayloadAction<Account[]>) => {
			return action.payload;
		}
	}
});

export const { setExistingAccounts } = existingAccountsSlice.actions;
export default existingAccountsSlice.reducer;
