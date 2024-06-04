import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
}

export const dataTransfer = createSlice({
    name: 'transferData',
    initialState,
    reducers: {
        updateTransferInput: (state, action) => {
            const { name, value } = action.payload;
            state.value[name] = value;
        },
        transferSubmit: (state, action) => {
            const { data } = action.payload;
            state.value = { ...state.value, ...data };
        },
    },
})

export const { transferSubmit, updateTransferInput } = dataTransfer.actions

export default dataTransfer.reducer
