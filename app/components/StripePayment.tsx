'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { STRIPE_CONFIG, calculateStripeAmount } from '../config/stripe';

// Stripe configuration for testing
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface StripePaymentProps {
  amount: number;
  onSuccess: (payment_intent_id: string) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<StripePaymentProps> = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Payment success
      const simulatedPaymentIntentId = `pi_test_${Date.now()}`;
      onSuccess(simulatedPaymentIntentId);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" mb={2} color="#26a69a">
        Payment Information
      </Typography>
      
      <Typography variant="body2" mb={2} color="text.secondary">
        Amount: ${amount}
      </Typography>

      <Box sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: 1, 
        p: 2, 
        mb: 2,
        backgroundColor: '#fafafa'
      }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading}
          sx={{
            bgcolor: '#26a69a',
            '&:hover': { bgcolor: '#2bbbad' },
            flex: 1
          }}
        >
          {loading ? <CircularProgress size={20} /> : 'Complete Payment'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
          sx={{ flex: 1 }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

const StripePayment: React.FC<StripePaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default StripePayment;
