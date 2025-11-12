import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    maximas: [],
    minimas: [],
};

const pronosticoSlice = createSlice({
    name: "pronostico",
    initialState,
    reducers: {
        guardarMaximas: (state, action) => {
            state.maximas = action.payload;
        },
        guardarMinimas: (state, action) => {
            state.minimas = action.payload;
        },
    },
});

export const { guardarMaximas, guardarMinimas } = pronosticoSlice.actions;

export default pronosticoSlice.reducer;