'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Box, Typography, CircularProgress, Paper,Chip,Divider,Button } from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import FlightIcon from '@mui/icons-material/Flight';
import AvTimerIcon from '@mui/icons-material/AvTimer';

import { motion } from 'framer-motion';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    }),
  };

const FlightDetailsPage = () => {
  const params = useParams();
  const { id } = params;
  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://127.0.0.1:8000/api/flight_reservation/flights/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setFlight(response.data);
        console.log(response.data);
      } catch (err: any) {
        setError('Failure to download trip details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFlight();
    }
  }, [id]);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <CircularProgress sx={{ color: '#26a69a' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!flight) {
    return (
      <Box p={4} textAlign="center">
        <Typography>there are no details for this trip</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      custom={0}
    >
      <Typography variant="h4" mb={4} sx={{ color: '#26a69a', fontWeight: 'bold' }}>
        ✈ Trip Details
      </Typography>
    </motion.div>

    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      custom={0.2}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#121212',
          color: 'white',
        }}
      >
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              <FlightIcon sx={{ mr: 1, color: '#26a69a' }} />
              Airline: <strong>{flight.airline}</strong>
            </Typography>
            <Typography>
              <FlightTakeoffIcon sx={{ mr: 1, color: '#26a69a' }} />
              From: <strong>{flight.from_location}</strong>
            </Typography>
            <Typography>
              <FlightLandIcon sx={{ mr: 1, color: '#26a69a' }} />
              To: <strong>{flight.to_location}</strong>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>
              <AccessTimeIcon sx={{ mr: 1, color: '#26a69a' }} />
              Departure: <strong>{flight.departure_date}</strong> at <strong>{flight.departure_time}</strong>
            </Typography>
            <Typography>
              <AvTimerIcon sx={{ mr: 1, color: '#26a69a' }} />
              Duration: <strong>{flight.expected_time || 'N/A'}</strong>
            </Typography>
            <Typography>
              <FlightIcon sx={{ mr: 1, color: '#26a69a' }} />
              Flight Number: <strong>{flight.flight_number || 'N/A'}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2, bgcolor: '#26a69a' }} />

        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} sm={6}>
            <Typography>
              🛫 Departure Airport: <strong>{flight.departure_airport || 'N/A'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography>
              🛬 Arrival Airport: <strong>{flight.arrival_airport || 'N/A'}</strong>
            </Typography>
          </Grid>
        </Grid>

        {flight.has_transit && (
          <Box my={2}>
            <Chip
              icon={<ConnectingAirportsIcon sx={{ color: 'white' }} />}
              label={`Transit via ${flight.transit_airport || 'N/A'}, ${flight.transit_country || 'N/A'}`}
              sx={{ bgcolor: '#26a69a', color: 'white', fontWeight: 'bold' }}
            />
          </Box>
        )}

        <Divider sx={{ my: 2, bgcolor: '#26a69a' }} />

        <Grid container spacing={3} mb={2}>
          <Grid item xs={12} sm={4}>
            <Typography>
              <AirlineSeatReclineNormalIcon sx={{ mr: 1, color: '#26a69a' }} />
              Economy Seats: <strong>{flight.available_economy_seats || '0'}</strong>
            </Typography>
            <Typography>
              <AttachMoneyIcon sx={{ mr: 1, color: '#26a69a' }} />
              Price: <strong>{flight.price_economy || 'N/A'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography>
              <AirlineSeatReclineNormalIcon sx={{ mr: 1, color: '#26a69a' }} />
              Business Seats: <strong>{flight.available_business_seats || '0'}</strong>
            </Typography>
            <Typography>
              <AttachMoneyIcon sx={{ mr: 1, color: '#26a69a' }} />
              Price: <strong>{flight.price_business || 'N/A'}</strong>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography>
              <AirlineSeatReclineNormalIcon sx={{ mr: 1, color: '#26a69a' }} />
              First Class: <strong>{flight.available_first_class_seats || '0'}</strong>
            </Typography>
            <Typography>
              <AttachMoneyIcon sx={{ mr: 1, color: '#26a69a' }} />
              Price: <strong>{flight.price_first_class || 'N/A'}</strong>
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: '#26a69a' }} />

        <Box textAlign="center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#26a69a',
                color: 'white',
                px: 6,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: 3,
                '&:hover': { bgcolor: '#2bbbad' },
              }}
            >
              Book Now
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  </Box>
  );
};

export default FlightDetailsPage;
