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

// Fetch Rider ride history (Day 9)
export const fetchRideHistory = createAsyncThunk(
    'ride/fetchRideHistory',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await api.get('/rides/history', { params });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ride history');
        }
    }
);

// Fetch official ride receipt (Day 9)
export const fetchRideReceipt = createAsyncThunk(
    'ride/fetchRideReceipt',
    async (rideId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/rides/${rideId}/receipt`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch ride receipt');
        }
    }
);

// Send receipt to email (Day 9)
export const emailRideReceipt = createAsyncThunk(
    'ride/emailRideReceipt',
    async ({ rideId, targetEmail }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rides/${rideId}/receipt/email`, { targetEmail });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to email ride receipt');
        }
    }
);

// Submit post-ride review and rating (Day 10)
export const submitRideReview = createAsyncThunk(
    'ride/submitRideReview',
    async ({ rideId, rating, feedback }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rides/${rideId}/review`, { rating, feedback });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
        }
    }
);

// Fetch driver reviews list (Day 10)
export const fetchDriverReviews = createAsyncThunk(
    'ride/fetchDriverReviews',
    async (driverId, { rejectWithValue }) => {
        try {
            const endpoint = driverId ? `/drivers/${driverId}/reviews` : '/drivers/reviews';
            const response = await api.get(endpoint);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch driver reviews');
        }
    }
);

// Fetch driver average rating & distribution (Day 10)
export const fetchDriverRating = createAsyncThunk(
    'ride/fetchDriverRating',
    async (driverId, { rejectWithValue }) => {
        try {
            const endpoint = driverId ? `/drivers/${driverId}/rating` : '/drivers/rating';
            const response = await api.get(endpoint);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch driver rating');
        }
    }
);

const initialState = {
    selectedTier: 'SEDAN',
    estimates: [],
    currentRide: null,
    driverAvailability: true,
    driverLocation: null, // { latitude, longitude, heading, speedKmh, remainingEtaMin }
    notifications: [],   // [{ id, title, message, type, timestamp, read }]
    unreadCount: 0,
    loadingEstimates: false,
    bookingLoading: false,
    bookingSuccess: false,
    statusUpdating: false,
    error: null,

    // Day 9 Ride History & Receipts State
    historyRides: [],
    historyStats: {
        totalRides: 0,
        completedRides: 0,
        cancelledRides: 0,
        totalSpent: 0,
        totalDistanceKm: 0
    },
    historyPagination: {
        total: 0,
        page: 1,
        limit: 50,
        pages: 1
    },
    historyLoading: false,
    selectedHistoryRide: null,
    currentReceipt: null,
    receiptLoading: false,
    emailSending: false,

    // Day 10 Ratings & Reviews State
    activeReviewModalRide: null,
    driverProfileModalOpen: false,
    driverProfileData: null,
    driverReviews: [],
    driverRatingData: {
        averageRating: 4.94,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    },
    reviewSubmitting: false,
    reviewsLoading: false
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
        setDriverLocation: (state, action) => {
            state.driverLocation = action.payload;
        },
        addNotification: (state, action) => {
            state.notifications.unshift({
                ...action.payload,
                read: false,
                id: action.payload.id || `notif-${Date.now()}`
            });
            state.unreadCount += 1;
        },
        markNotificationsRead: (state) => {
            state.notifications.forEach(n => { n.read = true; });
            state.unreadCount = 0;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        resetBookingState: (state) => {
            state.bookingSuccess = false;
            state.currentRide = null;
            state.driverLocation = null;
            state.error = null;
        },
        clearRideState: (state) => {
            state.estimates = [];
            state.currentRide = null;
            state.driverLocation = null;
            state.bookingSuccess = false;
            state.error = null;
        },
        setSelectedHistoryRide: (state, action) => {
            state.selectedHistoryRide = action.payload;
        },
        clearSelectedHistoryRide: (state) => {
            state.selectedHistoryRide = null;
        },
        setCurrentReceipt: (state, action) => {
            state.currentReceipt = action.payload;
        },
        clearCurrentReceipt: (state) => {
            state.currentReceipt = null;
        },

        // Day 10 Ratings & Reviews UI Reducers
        openReviewModal: (state, action) => {
            state.activeReviewModalRide = action.payload;
        },
        closeReviewModal: (state) => {
            state.activeReviewModalRide = null;
        },
        openDriverProfileModal: (state, action) => {
            state.driverProfileModalOpen = true;
            state.driverProfileData = action.payload || null;
        },
        closeDriverProfileModal: (state) => {
            state.driverProfileModalOpen = false;
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
            })

            // Day 9: fetchRideHistory
            .addCase(fetchRideHistory.pending, (state) => {
                state.historyLoading = true;
                state.error = null;
            })
            .addCase(fetchRideHistory.fulfilled, (state, action) => {
                state.historyLoading = false;
                state.historyRides = action.payload.rides || [];
                if (action.payload.stats) {
                    state.historyStats = action.payload.stats;
                }
                if (action.payload.pagination) {
                    state.historyPagination = action.payload.pagination;
                }
            })
            .addCase(fetchRideHistory.rejected, (state, action) => {
                state.historyLoading = false;
                state.error = action.payload;
            })

            // Day 9: fetchRideReceipt
            .addCase(fetchRideReceipt.pending, (state) => {
                state.receiptLoading = true;
                state.error = null;
            })
            .addCase(fetchRideReceipt.fulfilled, (state, action) => {
                state.receiptLoading = false;
                state.currentReceipt = action.payload.receipt;
            })
            .addCase(fetchRideReceipt.rejected, (state, action) => {
                state.receiptLoading = false;
                state.error = action.payload;
            })

            // Day 9: emailRideReceipt
            .addCase(emailRideReceipt.pending, (state) => {
                state.emailSending = true;
            })
            .addCase(emailRideReceipt.fulfilled, (state) => {
                state.emailSending = false;
            })
            .addCase(emailRideReceipt.rejected, (state, action) => {
                state.emailSending = false;
                state.error = action.payload;
            })

            // Day 10: submitRideReview
            .addCase(submitRideReview.pending, (state) => {
                state.reviewSubmitting = true;
                state.error = null;
            })
            .addCase(submitRideReview.fulfilled, (state, action) => {
                state.reviewSubmitting = false;
                const submittedReview = action.payload.review;
                if (state.currentRide && state.currentRide.id === submittedReview.rideId) {
                    state.currentRide.review = submittedReview;
                }
                state.historyRides = state.historyRides.map(r =>
                    r.id === submittedReview.rideId ? { ...r, review: submittedReview } : r
                );
                if (state.selectedHistoryRide && state.selectedHistoryRide.id === submittedReview.rideId) {
                    state.selectedHistoryRide.review = submittedReview;
                }
                state.activeReviewModalRide = null;
            })
            .addCase(submitRideReview.rejected, (state, action) => {
                state.reviewSubmitting = false;
                state.error = action.payload;
            })

            // Day 10: fetchDriverReviews
            .addCase(fetchDriverReviews.pending, (state) => {
                state.reviewsLoading = true;
            })
            .addCase(fetchDriverReviews.fulfilled, (state, action) => {
                state.reviewsLoading = false;
                state.driverReviews = action.payload.reviews || [];
                state.driverRatingData = {
                    averageRating: action.payload.averageRating || 4.94,
                    totalReviews: action.payload.totalReviews || 0,
                    distribution: action.payload.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
                };
            })
            .addCase(fetchDriverReviews.rejected, (state, action) => {
                state.reviewsLoading = false;
                state.error = action.payload;
            })

            // Day 10: fetchDriverRating
            .addCase(fetchDriverRating.fulfilled, (state, action) => {
                state.driverRatingData = action.payload;
            });
    }
});

export const {
    setSelectedTier,
    setCurrentRide,
    setDriverLocation,
    addNotification,
    markNotificationsRead,
    clearNotifications,
    resetBookingState,
    clearRideState,
    setSelectedHistoryRide,
    clearSelectedHistoryRide,
    setCurrentReceipt,
    clearCurrentReceipt,
    openReviewModal,
    closeReviewModal,
    openDriverProfileModal,
    closeDriverProfileModal
} = rideSlice.actions;
export default rideSlice.reducer;
