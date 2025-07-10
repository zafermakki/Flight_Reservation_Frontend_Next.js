'use client';

import { useState } from 'react';
import { Modal, Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
  }

const genderOptions = ['male', 'female'];
const travelClassOptions = ['economy', 'business', 'first_class']; 

const BookingModal: React.FC<BookingModalProps>= ({ open, onClose, flightId }) => {

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');

            await axios.post('http://127.0.0.1:8000/api/booking/create/', {
                flight_id: flightId,
                ...formData,
                seats_booked: Number(formData.seats_booked),
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
              }, 2000);
        } catch (err: any) {
            const msg =
                err?.response?.data?.non_field_errors?.[0] ||
                err?.response?.data?.detail ||
                'Something went wrong.';
            setError(msg);

        } finally {
            setLoading(false);
        }
    }

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

            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                />
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                margin="normal"
                required
                />
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                margin="normal"
                />
            </motion.div>
            <motion.div variants={fieldVariants}>
                <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                margin="normal"
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
                label="Seats Booked"
                name="seats_booked"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.seats_booked}
                onChange={handleChange}
                margin="normal"
                />
            </motion.div>

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

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: '#26a69a',
                '&:hover': { backgroundColor: '#219f90' },
              }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book Now'}
            </Button>
          </Box>
        </Modal>
      )}
    </AnimatePresence>
    )
}
export default BookingModal;