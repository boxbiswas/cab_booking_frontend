import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import mapReducer from './slices/mapSlice';
import rideReducer from './slices/rideSlice';

const appReducer = combineReducers({
    auth: authReducer,
    map: mapReducer,
    ride: rideReducer,
});

const rootReducer = (state, action) => {
    // When the logout action is fulfilled, reset the entire Redux state
    if (action.type === 'auth/logoutUser/fulfilled') {
        state = undefined;
    }
    return appReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
});