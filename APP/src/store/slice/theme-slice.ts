import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Theme {
  class: string;
}


const initialState: Theme = {
  class: localStorage?.theme ? localStorage.theme :'light',
};

export const themeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setTheme: (state:any , action: PayloadAction<string>): void => {
      state.class = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTheme } = themeSlice.actions;
// export const selectLocale = (state:RootState) => state.locale;
export default themeSlice.reducer;
