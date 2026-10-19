import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// Calculate fare estimates across tiers
export const fetchFareEstimates = createAsyncThunk(
    'ride/fetchFareEstimates',
    async ({ distanceKm, durationMin }, { rejectWithValue }) => {
        try {
            const response = await api.post('/rides/estimate', { distanceKm, durationMin });
            return response.data.estimates || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to estimate fares');
        }
    }
);

// Book a ride
export const bookRide = createAsyncThunk(
    'ride/bookRide',
    async (rideData, { rejectWithValue }) => {
        try {
            const response = await api.post('/rides', rideData);
            return response.data.ride;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to book ride');
        }
    }
);

// Fetch ride details
export const getRideDetails = createAsyncThunk(
    'ride/getRideDetails',
    async (rideId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/rides/${rideId}`);
            return response.data.ride;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get ride details');
        }
    }
);

// Accept a ride request (Driver assignment)
export const acceptRide = createAsyncThunk(
    'ride/acceptRide',
    async ({ rideId, driverData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rides/${rideId}/accept`, driverData || {});
            return response.data.ride;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to accept ride');
        }
    }
);

// Decline a ride request
export const declineRide = createAsyncThunk(
    'ride/declineRide',
    async (rideId, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rides/${rideId}/decline`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to decline ride');
        }
    }
);

// Update ride lifecycle status
export const updateRideStatus = createAsyncThunk(
    'ride/updateRideStatus',
    async ({ rideId, status, reason }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/rides/${rideId}/status`, { status, reason });
            return response.data.ride;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update ride status');
        }
    }
);

// Get driver availability
export const fetchDriverAvailability = createAsyncThunk(
    'ride/fetchDriverAvailability',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/driver/availability');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get driver availability');
        }
    }
);

// Toggle driver availability
export const toggleDriverAvailability = createAsyncThunk(
    'ride/toggleDriverAvailability',
    async (isAvailable, { rejectWithValue }) => {
        try {
            const response = await api.patch('/driver/availability', { isAvailable });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle availability');
        }
    }
);

const initialState = {
    selectedTier: 'SEDAN',
    estimates: [],
    currentRide: null,
    driverAvailability: true,
    loadingEstimates: false,
    bookingLoading: false,
    bookingSuccess: false,
    statusUpdating: false,
    error: null,
};

const rideSlice = createSlice({
    name: 'ride',
    initialState,
    reducers: {
        setSelectedTier: (state, action) => {
            state.selectedTier = action.payload;
        },
        setCurrentRide: (state, action) => {
            state.currentRide = action.payload;
        },
        resetBookingState: (state) => {
            state.bookingSuccess = false;
            state.currentRide = null;
            state.error = null;
        },
        clearRideState: (state) => {
            state.estimates = [];
            state.currentRide = null;
            state.bookingSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchFareEstimates
            .addCase(fetchFareEstimates.pending, (state) => {
                state.loadingEstimates = true;
                state.error = null;
            })
            .addCase(fetchFareEstimates.fulfilled, (state, action) => {
                state.loadingEstimates = false;
                state.estimates = action.payload;
            })
            .addCase(fetchFareEstimates.rejected, (state, action) => {
                state.loadingEstimates = false;
                state.error = action.payload;
            })

            // bookRide
            .addCase(bookRide.pending, (state) => {
                state.bookingLoading = true;
                state.error = null;
            })
            .addCase(bookRide.fulfilled, (state, action) => {
                state.bookingLoading = false;
                state.bookingSuccess = true;
                state.currentRide = action.payload;
            })
            .addCase(bookRide.rejected, (state, action) => {
                state.bookingLoading = false;
                state.error = action.payload;
            })

            // getRideDetails
            .addCase(getRideDetails.fulfilled, (state, action) => {
                state.currentRide = action.payload;
            })

            // acceptRide
            .addCase(acceptRide.pending, (state) => {
                state.statusUpdating = true;
            })
            .addCase(acceptRide.fulfilled, (state, action) => {
                state.statusUpdating = false;
                state.currentRide = action.payload;
            })
            .addCase(acceptRide.rejected, (state, action) => {
                state.statusUpdating = false;
                state.error = action.payload;
            })

            // updateRideStatus
            .addCase(updateRideStatus.pending, (state) => {
                state.statusUpdating = true;
            })
            .addCase(updateRideStatus.fulfilled, (state, action) => {
                state.statusUpdating = false;
                state.currentRide = action.payload;
            })
            .addCase(updateRideStatus.rejected, (state, action) => {
                state.statusUpdating = false;
                state.error = action.payload;
            })

            // fetchDriverAvailability
            .addCase(fetchDriverAvailability.fulfilled, (state, action) => {
                state.driverAvailability = action.payload.isAvailable;
            })

            // toggleDriverAvailability
            .addCase(toggleDriverAvailability.fulfilled, (state, action) => {
                state.driverAvailability = action.payload.isAvailable;
            });
    }
});

export const { setSelectedTier, setCurrentRide, resetBookingState, clearRideState } = rideSlice.actions;
export default rideSlice.reducer;
