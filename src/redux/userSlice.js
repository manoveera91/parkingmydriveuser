import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: {
        isLoggedIn: false,
        username: '',
        email: '',
        token: '',
        mobile: '',
        spotLength: 0 
    },
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveUser: (state, action) => {
            console.log('redux', state, 'action', action.payload)
            const { data } = action.payload;
            return {
                ...state,
                value: { ...state.value, ...data }
            };
        },
    },
})

export const { saveUser } = userSlice.actions

export default userSlice.reducer
