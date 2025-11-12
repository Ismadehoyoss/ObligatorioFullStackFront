import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    logged:false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loguear: (state) => {
        state.logged = true;
    },
    desloguear: (state) => {
        state.logged = false;
    },
    registrarse: (state, action) => {
        state.logged = true;
    },
  },
});

export const { loguear, desloguear, registrarse } = userSlice.actions;
export default userSlice.reducer;

