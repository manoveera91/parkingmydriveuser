import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        from: "",
        to: "",
        selectedFromTime: "",
        selectedToTime: "",
        event: "",
        destination: "",
        vehicle_type: "",
        lat: "", lng: "",
        error: {}
    },
}

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        updateSearchInput: (state, action) => {
            const { name, value } = action.payload;
            state.value[name] = value;
        },
        searchSubmit: (state, action) => {
            const { data } = action.payload;
            state.value = { ...state.value, ...data };
        },
    },
})

export const { searchSubmit, updateSearchInput } = searchSlice.actions

export default searchSlice.reducer
