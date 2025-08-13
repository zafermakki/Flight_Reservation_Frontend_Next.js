'use client';

import { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem, Typography, Stepper, Step, StepLabel, Alert } from '@mui/material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import StripePayment from '../components/StripePayment';
// animations 
const containerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        delay: 0.6,
      },
    },
    hover: {
      scale: 1.05,
      backgroundColor: '#219f90',
      transition: { type: 'spring', stiffness: 300 },
    },
  };

interface BookingModalProps {
    open: boolean;
    onClose: () => void;
    flightId: number;
    flightPrices?: {
        price_economy: number;
        price_business: number;
        price_first_class: number;
    };
  }

const genderOptions = ['male', 'female'];
const travelClassOptions = ['economy', 'business', 'first_class']; 

const BookingModal: React.FC<BookingModalProps>= ({ open, onClose, flightId, flightPrices }) => {

    const [formData, setFormData] = useState({
        gender: 'male',
        date_of_birth: '',
        nationality: '',
        email: '',
        phone_number: '',
        seats_booked: 1,
        travel_class: 'economy',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculatePrice = () => {
        // Use actual flight prices if available, otherwise fall back to default prices
        const basePrices = flightPrices ? {
            economy: flightPrices.price_economy,
            business: flightPrices.price_business,
            first_class: flightPrices.price_first_class
        } : {
            economy: 100,
            business: 200,
            first_class: 300
        };
        return basePrices[formData.travel_class as keyof typeof basePrices] * formData.seats_booked;
    };

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        // Check required fields
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!formData.phone_number.trim()) {
            errors.phone_number = 'Phone number is required';
        }
        
        if (!formData.nationality.trim()) {
            errors.nationality = 'Nationality is required';
        }
        
        if (!formData.date_of_birth) {
            errors.date_of_birth = 'Date of birth is required';
        }
        
        if (formData.seats_booked < 1) {
            errors.seats_booked = 'At least 1 seat must be booked';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (validateForm()) {
                setShowPayment(true);
                setActiveStep(1);
                setValidationErrors({}); // Clear validation errors
            }
        }
    };

    const handleBack = () => {
        setActiveStep(0);
        setShowPayment(false);
    };

    const handlePaymentSuccess = async (payment_intent_id: string) => {
        setLoading(true);
        setError('');
        setPaymentIntentId(payment_intent_id);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:8000/api/booking/create/', {
                flight_id: flightId,
                ...formData,
                seats_booked: Number(formData.seats_booked),
                payment_intent_id, // أضفناها هنا
            },
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
            }
            );
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
                setActiveStep(0);
                setShowPayment(false);
            }, 2000);
        } catch (err: any) {
          console.log(err.response?.data); 
          let msg = '';
      
          if (err?.response?.data) {
              const data = err.response.data;
      
              if (typeof data === 'string') {
                  // إذا كان الرد نص مباشر
                  msg = data;
              } else if (typeof data === 'object') {
                  // إذا كان الرد كائن، نجلب أول رسالة متاحة
                  const firstKey = Object.keys(data)[0];
                  const firstValue = data[firstKey];
      
                  if (Array.isArray(firstValue)) {
                      msg = firstValue[0]; // أول عنصر في المصفوفة
                  } else if (typeof firstValue === 'string') {
                      msg = firstValue;
                  } else {
                      msg = JSON.stringify(firstValue);
                  }
              } else {
                  msg = JSON.stringify(data);
              }
          } else {
              msg = 'حدث خطأ غير متوقع.';
          }
      
          setError(msg);
      }  finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        // Don't call handleNext directly - let the button click handle it
        // This prevents automatic progression without validation
    }

    const getFieldError = (fieldName: string) => {
        return validationErrors[fieldName] || '';
    };

    const hasFieldError = (fieldName: string) => {
        return !!validationErrors[fieldName];
    };

    return (
        <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.1, type: 'spring', stiffness: 100 }}
            sx={{
              maxWidth: 500,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              mx: 'auto',
              mt: '5%',
              borderRadius: 3,
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <Typography variant="h5" mb={2} color="#26a69a">
              Book Your Flight
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              <Step>
                <StepLabel>Booking Information</StepLabel>
              </Step>
              <Step>
                <StepLabel>Payment</StepLabel>
              </Step>
            </Stepper>

            {Object.keys(validationErrors).length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Please fill in all required fields correctly before proceeding.
              </Alert>
            )}

            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Email *"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                error={hasFieldError('email')}
                helperText={getFieldError('email')}
                />
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Phone Number *"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                margin="normal"
                required
                error={hasFieldError('phone_number')}
                helperText={getFieldError('phone_number')}
                />
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Nationality *"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                margin="normal"
                required
                error={hasFieldError('nationality')}
                helperText={getFieldError('nationality')}
                />
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Date of Birth *"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                margin="normal"
                required
                error={hasFieldError('date_of_birth')}
                helperText={getFieldError('date_of_birth')}
                InputLabelProps={{ shrink: true }}
                />
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Gender"
                name="gender"
                select
                value={formData.gender}
                onChange={handleChange}
                margin="normal"
                >
                {genderOptions.map((g) => (
                    <MenuItem key={g} value={g}>
                    {g}
                    </MenuItem>
                ))}
                </TextField>
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Class"
                name="travel_class"
                select
                value={formData.travel_class}
                onChange={handleChange}
                margin="normal"
                >
                {travelClassOptions.map((cls) => (
                    <MenuItem key={cls} value={cls}>
                    {cls.replace('_', ' ')}
                    </MenuItem>
                ))}
                </TextField>
            </motion.div>

            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Seats Booked *"
                name="seats_booked"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.seats_booked}
                onChange={handleChange}
                margin="normal"
                required
                error={hasFieldError('seats_booked')}
                helperText={getFieldError('seats_booked')}
                />
            </motion.div>

            {!showPayment && (
              <>
                <Box sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: '#f5f5f5', 
                  borderRadius: 1,
                  border: '1px solid #e0e0e0'
                }}>
                  <Typography variant="h6" color="#26a69a" gutterBottom>
                    Price Summary
                  </Typography>
                  <Typography sx={{color: '#26a69a'}}>
                    Travel Class: <strong>{formData.travel_class.replace('_', ' ')}</strong>
                  </Typography>
                  <Typography sx={{color: '#26a69a'}}>
                    Number of Seats: <strong>{formData.seats_booked}</strong>
                  </Typography>
                  <Typography variant="h6" color="#26a69a">
                    Total Price: <strong>${calculatePrice()}</strong>
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: '#26a69a',
                    '&:hover': { backgroundColor: '#219f90' },
                  }}
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Next - Payment'}
                </Button>
              </>
            )}

            {showPayment && (
              <Box>
                <StripePayment
                  amount={calculatePrice()}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleBack}
                />
              </Box>
            )}

            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}

            {success && (
              <Typography color="green" mt={1}>
                Booking successful ✅
              </Typography>
            )}
          </Box>
        </Modal>
      )}
    </AnimatePresence>
    )
}
export default BookingModal;