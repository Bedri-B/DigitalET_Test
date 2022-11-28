import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import themeReducer from './slice/theme-slice'
import constantSlice from "./slice/constants-slice";

export const store = configureStore({
  reducer: {
    themeReducer,
    constantSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;

setupListeners(store.dispatch);
