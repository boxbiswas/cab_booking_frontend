import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../https/axios';

// 1. Create Payment Intent
export const createPaymentIntent = createAsyncThunk(
    'payment/createIntent',
    async ({ rideId, method = 'CARD', currency = 'USD' }, { rejectWithValue }) => {
        try {
            const response = await api.post('/payments/create-intent', { rideId, method, currency });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create payment intent');
        }
    }
);

// 2. Fetch Payment details by ID or Ride ID
export const getPaymentDetails = createAsyncThunk(
    'payment/getPaymentDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/payments/${id}`);
            return response.data.payment;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment details');
        }
    }
);

// 3. Fetch Saved Payment Methods
export const fetchPaymentMethods = createAsyncThunk(
    'payment/fetchPaymentMethods',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/payment-methods');
            return response.data.paymentMethods || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment methods');
        }
    }
);

// 4. Add Saved Payment Method
export const addPaymentMethod = createAsyncThunk(
    'payment/addPaymentMethod',
    async (methodData, { rejectWithValue }) => {
        try {
            const response = await api.post('/payment-methods', methodData);
            return response.data.paymentMethod;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to save payment method');
        }
    }
);

// 5. Delete Saved Payment Method
export const deletePaymentMethod = createAsyncThunk(
    'payment/deletePaymentMethod',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/payment-methods/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete payment method');
        }
    }
);

// 6. Fetch Driver Earnings (Day 8 backend aggregation)
export const fetchDriverEarnings = createAsyncThunk(
    'payment/fetchDriverEarnings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/driver/earnings');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch driver earnings');
        }
    }
);

// 7. Simulate Verified Webhook Payment (Cryptographic signature verified by backend)
export const simulateVerifiedPayment = createAsyncThunk(
    'payment/simulateVerifiedPayment',
    async ({ rideId, amount, paymentIntentId, outcome = 'success' }, { rejectWithValue }) => {
        try {
            const response = await api.post('/payments/simulate-webhook', {
                rideId,
                amount,
                paymentIntentId,
                outcome
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Payment simulation failed');
        }
    }
);

const initialState = {
    // Current Active Payment Intent
    intent: null,
    currentPayment: null,

    // Saved payment methods
    paymentMethods: [],

    // Driver Earnings Report
    driverEarnings: null,

    // Modal UI states
    isPaymentModalOpen: false,
    isReceiptModalOpen: false,
    isEarningsModalOpen: false,
    isPaymentMethodsModalOpen: false,

    // Loading & Error states
    loading: false,
    processingPayment: false,
    error: null,
    successMessage: null
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        openPaymentModal: (state) => {
            state.isPaymentModalOpen = true;
        },
        closePaymentModal: (state) => {
            state.isPaymentModalOpen = false;
        },
        openReceiptModal: (state) => {
            state.isReceiptModalOpen = true;
        },
        closeReceiptModal: (state) => {
            state.isReceiptModalOpen = false;
        },
        openEarningsModal: (state) => {
            state.isEarningsModalOpen = true;
        },
        closeEarningsModal: (state) => {
            state.isEarningsModalOpen = false;
        },
        openPaymentMethodsModal: (state) => {
            state.isPaymentMethodsModalOpen = true;
        },
        closePaymentMethodsModal: (state) => {
            state.isPaymentMethodsModalOpen = false;
        },
        setVerifiedPayment: (state, action) => {
            state.currentPayment = action.payload;
        },
        clearPaymentState: (state) => {
            state.intent = null;
            state.currentPayment = null;
            state.processingPayment = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Intent
            .addCase(createPaymentIntent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPaymentIntent.fulfilled, (state, action) => {
                state.loading = false;
                state.intent = action.payload;
                if (action.payload.payment) {
                    state.currentPayment = action.payload.payment;
                }
            })
            .addCase(createPaymentIntent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Payment Details
            .addCase(getPaymentDetails.fulfilled, (state, action) => {
                state.currentPayment = action.payload;
            })

            // Payment Methods
            .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
                state.paymentMethods = action.payload;
            })
            .addCase(addPaymentMethod.fulfilled, (state, action) => {
                state.paymentMethods.unshift(action.payload);
            })
            .addCase(deletePaymentMethod.fulfilled, (state, action) => {
                state.paymentMethods = state.paymentMethods.filter(m => m.id !== action.payload);
            })

            // Driver Earnings
            .addCase(fetchDriverEarnings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDriverEarnings.fulfilled, (state, action) => {
                state.loading = false;
                state.driverEarnings = action.payload;
            })
            .addCase(fetchDriverEarnings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Simulate Verified Payment
            .addCase(simulateVerifiedPayment.pending, (state) => {
                state.processingPayment = true;
                state.error = null;
            })
            .addCase(simulateVerifiedPayment.fulfilled, (state, action) => {
                state.processingPayment = false;
                state.isPaymentModalOpen = false;
                state.isReceiptModalOpen = true;
            })
            .addCase(simulateVerifiedPayment.rejected, (state, action) => {
                state.processingPayment = false;
                state.error = action.payload;
            });
    }
});

export const {
    openPaymentModal,
    closePaymentModal,
    openReceiptModal,
    closeReceiptModal,
    openEarningsModal,
    closeEarningsModal,
    openPaymentMethodsModal,
    closePaymentMethodsModal,
    setVerifiedPayment,
    clearPaymentState
} = paymentSlice.actions;

export default paymentSlice.reducer;
