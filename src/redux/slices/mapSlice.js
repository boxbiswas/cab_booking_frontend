import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// Search place autocomplete via backend geocoder
export const searchPlaces = createAsyncThunk(
    'map/searchPlaces',
    async (payload, { getState, rejectWithValue }) => {
        try {
            const query = typeof payload === 'string' ? payload : payload?.query;
            if (!query || query.trim().length < 2) return [];

            const state = getState();
            // Automatically detect active coordinates to bias search towards user's area
            const activeCoords = typeof payload === 'object' && payload?.lat
                ? payload
                : state.map?.pickup || state.map?.destination;

            let url = `/maps/search?q=${encodeURIComponent(query.trim())}`;
            if (activeCoords?.latitude && activeCoords?.longitude) {
                url += `&lat=${activeCoords.latitude}&lng=${activeCoords.longitude}`;
            }

            const response = await api.get(url);
            return response.data.results || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search places');
        }
    }
);

// Calculate route between pickup and destination
export const calculateRoute = createAsyncThunk(
    'map/calculateRoute',
    async ({ pickup, destination }, { rejectWithValue }) => {
        try {
            if (!pickup?.latitude || !destination?.latitude) return null;
            const response = await api.get(
                `/maps/route?startLat=${pickup.latitude}&startLng=${pickup.longitude}&endLat=${destination.latitude}&endLng=${destination.longitude}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to calculate route');
        }
    }
);

const defaultPickup = {
    address: 'Connaught Place, Central Delhi, Delhi, India',
    shortName: 'Connaught Place',
    latitude: 28.6315,
    longitude: 77.2167
};

const initialState = {
    pickup: defaultPickup,
    destination: null,
    route: null, // { distanceKm, durationMin, coordinates }
    suggestions: [],
    isSearching: false,
    isRouting: false,
    error: null,
};

const mapSlice = createSlice({
    name: 'map',
    initialState,
    reducers: {
        setPickup: (state, action) => {
            state.pickup = action.payload;
            state.suggestions = [];
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
            state.suggestions = [];
        },
        swapLocations: (state) => {
            const temp = state.pickup;
            state.pickup = state.destination || defaultPickup;
            state.destination = temp;
        },
        clearDestination: (state) => {
            state.destination = null;
            state.route = null;
        },
        clearSuggestions: (state) => {
            state.suggestions = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // searchPlaces
            .addCase(searchPlaces.pending, (state) => {
                state.isSearching = true;
                state.suggestions = [];
                state.error = null;
            })
            .addCase(searchPlaces.fulfilled, (state, action) => {
                state.suggestions = action.payload;
                state.isSearching = false;
            })
            .addCase(searchPlaces.rejected, (state, action) => {
                state.isSearching = false;
                state.suggestions = [];
                state.error = action.payload;
            })

            // calculateRoute
            .addCase(calculateRoute.pending, (state) => {
                state.isRouting = true;
                state.error = null;
            })
            .addCase(calculateRoute.fulfilled, (state, action) => {
                state.route = action.payload;
                state.isRouting = false;
            })
            .addCase(calculateRoute.rejected, (state, action) => {
                state.isRouting = false;
                state.error = action.payload;
            });
    }
});

export const { setPickup, setDestination, swapLocations, clearDestination, clearSuggestions } = mapSlice.actions;
export default mapSlice.reducer;
