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

// Day 12 Ride Cancellation (POST /rides/:id/cancel)
export const cancelRide = createAsyncThunk(
    'ride/cancelRide',
    async ({ rideId, reason }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rides/${rideId}/cancel`, { reason });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel ride');
        }
    }
);

// Day 12 Multi-Stop Rides: Add stops (POST /rides/:id/stops)
export const addRideStops = createAsyncThunk(
    'ride/addRideStops',
    async ({ rideId, stops }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rides/${rideId}/stops`, { stops });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add stops');
        }
    }
);

// Day 12 Multi-Stop Rides: Fetch stops (GET /rides/:id/stops)
export const fetchRideStops = createAsyncThunk(
    'ride/fetchRideStops',
    async (rideId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/rides/${rideId}/stops`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stops');
        }
    }
);

// Day 12 Promo Codes: Validate promotion (POST /promotions/validate)
export const validatePromoCode = createAsyncThunk(
    'ride/validatePromoCode',
    async ({ code, rideFare }, { rejectWithValue }) => {
        try {
            const response = await api.post('/promotions/validate', { code, rideFare });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Invalid or expired promo code');
        }
    }
);

// Day 12 Emergency SOS: Trigger SOS (POST /rides/:id/emergency)
export const triggerEmergency = createAsyncThunk(
    'ride/triggerEmergency',
    async ({ rideId, latitude, longitude }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/rides/${rideId}/emergency`, { latitude, longitude });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to trigger emergency SOS');
        }
    }
);

// Day 12 Emergency Contacts: List (GET /emergency-contacts)
export const fetchEmergencyContacts = createAsyncThunk(
    'ride/fetchEmergencyContacts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/emergency-contacts');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch emergency contacts');
        }
    }
);

// Day 12 Emergency Contacts: Add (POST /emergency-contacts)
export const addEmergencyContact = createAsyncThunk(
    'ride/addEmergencyContact',
    async (contactData, { rejectWithValue }) => {
        try {
            const response = await api.post('/emergency-contacts', contactData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add emergency contact');
        }
    }
);

// Day 12 Emergency Contacts: Delete (DELETE /emergency-contacts/:id)
export const deleteEmergencyContact = createAsyncThunk(
    'ride/deleteEmergencyContact',
    async (contactId, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/emergency-contacts/${contactId}`);
            return { contactId, ...response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete emergency contact');
        }
    }
);

// Day 12 Customer Support: List tickets (GET /support/tickets)
export const fetchSupportTickets = createAsyncThunk(
    'ride/fetchSupportTickets',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/support/tickets');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch support tickets');
        }
    }
);

// Day 12 Customer Support: Create ticket (POST /support/tickets)
export const createSupportTicket = createAsyncThunk(
    'ride/createSupportTicket',
    async (ticketData, { rejectWithValue }) => {
        try {
            const response = await api.post('/support/tickets', ticketData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create support ticket');
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
    reviewsLoading: false,

    // Day 12 Ride Cancellation State
    cancelModalOpen: false,
    cancellingRide: false,

    // Day 12 Promo Codes State
    appliedPromo: null,
    promoLoading: false,
    promoError: null,

    // Day 12 Multi-Stop Rides State
    plannedStops: [],
    currentRideStops: [],
    stopsLoading: false,
    stopsModalOpen: false,

    // Day 12 Emergency SOS State
    emergencyModalOpen: false,
    emergencyLoading: false,
    activeEmergencyAlert: null,
    emergencyContacts: [],
    contactsLoading: false,

    // Day 12 Customer Support State
    supportModalOpen: false,
    supportTickets: [],
    supportLoading: false,
    ticketSubmitting: false
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
        },

        // Day 12 Ride Cancellation Reducers
        openCancelModal: (state) => {
            state.cancelModalOpen = true;
        },
        closeCancelModal: (state) => {
            state.cancelModalOpen = false;
        },

        // Day 12 Emergency SOS Reducers
        openEmergencyModal: (state) => {
            state.emergencyModalOpen = true;
        },
        closeEmergencyModal: (state) => {
            state.emergencyModalOpen = false;
        },

        // Day 12 Customer Support Reducers
        openSupportModal: (state) => {
            state.supportModalOpen = true;
        },
        closeSupportModal: (state) => {
            state.supportModalOpen = false;
        },

        // Day 12 Multi-Stop Rides Reducers
        openStopsModal: (state) => {
            state.stopsModalOpen = true;
        },
        closeStopsModal: (state) => {
            state.stopsModalOpen = false;
        },
        addPlannedStop: (state, action) => {
            state.plannedStops.push({
                ...action.payload,
                sequence: state.plannedStops.length + 1
            });
        },
        removePlannedStop: (state, action) => {
            state.plannedStops = state.plannedStops.filter((_, idx) => idx !== action.payload);
            state.plannedStops.forEach((stop, idx) => { stop.sequence = idx + 1; });
        },
        clearPlannedStops: (state) => {
            state.plannedStops = [];
        },

        // Day 12 Promo Codes Reducer
        clearAppliedPromo: (state) => {
            state.appliedPromo = null;
            state.promoError = null;
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
            })

            // Day 12: cancelRide
            .addCase(cancelRide.pending, (state) => {
                state.cancellingRide = true;
                state.error = null;
            })
            .addCase(cancelRide.fulfilled, (state, action) => {
                state.cancellingRide = false;
                state.cancelModalOpen = false;
                const fee = action.payload.cancellationFee || 0;
                if (state.currentRide) {
                    state.currentRide = {
                        ...state.currentRide,
                        status: 'CANCELLED',
                        cancelledBy: 'RIDER',
                        cancellationReason: action.payload.reason || 'Cancelled by rider',
                        cancellationFee: fee,
                        finalFare: fee > 0 ? fee : (state.currentRide.finalFare || state.currentRide.estimatedFare)
                    };
                }
                state.historyRides = state.historyRides.map(r =>
                    r.id === action.payload.ride?.id ? {
                        ...r,
                        status: 'CANCELLED',
                        cancellationReason: action.payload.reason,
                        cancellationFee: fee
                    } : r
                );
            })
            .addCase(cancelRide.rejected, (state, action) => {
                state.cancellingRide = false;
                state.error = action.payload;
            })

            // Day 12: addRideStops
            .addCase(addRideStops.pending, (state) => {
                state.stopsLoading = true;
            })
            .addCase(addRideStops.fulfilled, (state, action) => {
                state.stopsLoading = false;
                state.stopsModalOpen = false;
                if (action.payload.ride) {
                    state.currentRide = action.payload.ride;
                }
                state.currentRideStops = action.payload.stops || [];
                state.plannedStops = [];
            })
            .addCase(addRideStops.rejected, (state, action) => {
                state.stopsLoading = false;
                state.error = action.payload;
            })

            // Day 12: fetchRideStops
            .addCase(fetchRideStops.fulfilled, (state, action) => {
                state.currentRideStops = action.payload.stops || [];
            })

            // Day 12: validatePromoCode
            .addCase(validatePromoCode.pending, (state) => {
                state.promoLoading = true;
                state.promoError = null;
            })
            .addCase(validatePromoCode.fulfilled, (state, action) => {
                state.promoLoading = false;
                state.appliedPromo = {
                    code: action.payload.promotion?.code,
                    discountAmount: action.payload.discountAmount,
                    finalFare: action.payload.finalFare,
                    discountType: action.payload.promotion?.discountType,
                    discountValue: action.payload.promotion?.discountValue,
                    description: action.payload.promotion?.description
                };
            })
            .addCase(validatePromoCode.rejected, (state, action) => {
                state.promoLoading = false;
                state.appliedPromo = null;
                state.promoError = action.payload;
            })

            // Day 12: triggerEmergency
            .addCase(triggerEmergency.pending, (state) => {
                state.emergencyLoading = true;
            })
            .addCase(triggerEmergency.fulfilled, (state, action) => {
                state.emergencyLoading = false;
                state.activeEmergencyAlert = action.payload.alert;
            })
            .addCase(triggerEmergency.rejected, (state, action) => {
                state.emergencyLoading = false;
                state.error = action.payload;
            })

            // Day 12: fetchEmergencyContacts
            .addCase(fetchEmergencyContacts.pending, (state) => {
                state.contactsLoading = true;
            })
            .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
                state.contactsLoading = false;
                state.emergencyContacts = action.payload.contacts || [];
            })
            .addCase(fetchEmergencyContacts.rejected, (state) => {
                state.contactsLoading = false;
            })

            // Day 12: addEmergencyContact
            .addCase(addEmergencyContact.fulfilled, (state, action) => {
                if (action.payload.contact) {
                    state.emergencyContacts.push(action.payload.contact);
                }
            })

            // Day 12: deleteEmergencyContact
            .addCase(deleteEmergencyContact.fulfilled, (state, action) => {
                state.emergencyContacts = state.emergencyContacts.filter(c => c.id !== action.payload.contactId);
            })

            // Day 12: fetchSupportTickets
            .addCase(fetchSupportTickets.pending, (state) => {
                state.supportLoading = true;
            })
            .addCase(fetchSupportTickets.fulfilled, (state, action) => {
                state.supportLoading = false;
                state.supportTickets = action.payload.tickets || [];
            })
            .addCase(fetchSupportTickets.rejected, (state) => {
                state.supportLoading = false;
            })

            // Day 12: createSupportTicket
            .addCase(createSupportTicket.pending, (state) => {
                state.ticketSubmitting = true;
            })
            .addCase(createSupportTicket.fulfilled, (state, action) => {
                state.ticketSubmitting = false;
                if (action.payload.ticket) {
                    state.supportTickets.unshift(action.payload.ticket);
                }
            })
            .addCase(createSupportTicket.rejected, (state, action) => {
                state.ticketSubmitting = false;
                state.error = action.payload;
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
    closeDriverProfileModal,
    openCancelModal,
    closeCancelModal,
    openEmergencyModal,
    closeEmergencyModal,
    openSupportModal,
    closeSupportModal,
    openStopsModal,
    closeStopsModal,
    addPlannedStop,
    removePlannedStop,
    clearPlannedStops,
    clearAppliedPromo
} = rideSlice.actions;
export default rideSlice.reducer;
