'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

import { motion, AnimatePresence } from 'framer-motion';

interface Booking {
  id: number;
  flight: number;
  gender: string;
  date_of_birth: string | null;
  nationality: string | null;
  email: string;
  phone_number: string | null;
  seats_booked: number;
  travel_class: string;
  booking_date: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      type: 'spring',
      stiffness: 120,
      damping: 12,
    },
  }),
};

const ReservationsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          setError('Email not found.');
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token not found.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/booking/customer-bookings/${email}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Fetch failed: ${response.status}`);
        }

        const data = await response.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="w-16 h-16 border-4 border-t-emerald-500 border-gray-200 rounded-full animate-spin"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="bg-red-100 text-red-700 px-8 py-6 rounded-xl shadow-lg text-lg font-semibold"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Error: {error}
        </motion.div>
      </div>
    );

    const handleDeleteBooking = async (id: number) => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Token not found.');
        return;
      }
    
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/booking/cancel-booking/${id}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${token}`,
          },
        });
    
        if (response.ok) {
          setBookings((prev) => prev.filter((booking) => booking.id !== id));
        } else {
          alert('Failed to cancel booking.');
        }
      } catch (error) {
        alert('Error while deleting booking.');
      } finally {
        setOpenDialog(false);
        setSelectedBookingId(null);
      }
    };
    

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
  <h1 className="text-3xl font-bold text-teal-500 mb-8 text-center tracking-tight">Your Reservations</h1>
  {bookings.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-20">
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m-4-5v9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.25v-2.25A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75V18A2.25 2.25 0 006 20.25h12a2.25 2.25 0 002.25-2.25v-2.25" />
      </svg>
      <p className="text-gray-500 text-lg">No reservations yet.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <AnimatePresence>
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-2xl transition-shadow duration-200"
            custom={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-400">Reservation ID</span>
              <span className="text-sm font-bold text-teal-500">{booking.id}</span>
            </div>
            <div className="flex flex-col gap-2">
              <div >
                <span className="font-semibold text-gray-700">Flight:</span>
                <span className="text-gray-900">{booking.flight}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Gender:</span>
                <span className="text-gray-900">
                  {booking.gender === 'male'
                    ? 'Male'
                    : booking.gender === 'female'
                    ? 'Female'
                    : booking.gender}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Date of Birth:</span>
                <span className="text-gray-900">{booking.date_of_birth ? booking.date_of_birth : 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Nationality:</span>
                <span className="text-gray-900">{booking.nationality || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-900">{booking.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Phone Number:</span>
                <span className="text-gray-900">{booking.phone_number || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Seats Booked:</span>
                <span className="text-gray-900">{booking.seats_booked}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Travel Class:</span>
                <span className="text-gray-900">
                  {booking.travel_class === 'economy'
                    ? 'Economy'
                    : booking.travel_class === 'business'
                    ? 'Business'
                    : booking.travel_class === 'first_class'
                    ? 'First Class'
                    : booking.travel_class}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Booking Date:</span>
                <span className="text-gray-900">{new Date(booking.booking_date).toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedBookingId(booking.id);
                    setOpenDialog(true);
                  }}
                >
                  Cancel Booking
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <DialogTitle>Cancel Reservation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to cancel this reservation? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          No
        </Button>
        <Button
          onClick={() => {
            if (selectedBookingId !== null) {
              handleDeleteBooking(selectedBookingId);
            }
          }}
          color="error"
        >
          Yes, Cancel
        </Button>
      </DialogActions>
    </Dialog>
</div>
  );
};

export default ReservationsPage;
