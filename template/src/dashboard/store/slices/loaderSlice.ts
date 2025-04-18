import { createSlice } from '@reduxjs/toolkit';

interface LoaderState {
    fullLoader: boolean;
}

const initialState: LoaderState = {
    fullLoader: false,
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        setFullLoader: (state, action: { payload: boolean }) => {
            state.fullLoader = action.payload;
        },
    },
});

export const { setFullLoader } = loaderSlice.actions;
export default loaderSlice.reducer;