'use client'

import React, {useState, useEffect} from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Dashboard: React.FC = () => {

  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState('');
  const [showTip, setShowTip] = useState(false);

  const [fromLocationsList, setFromLocationsList] = useState<string[]>([]);
  const [toLocationsList, setToLocationsList] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem('token');
        const [fromRes, toRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/flight_reservation/locations/from/', {
            headers: { Authorization: `Token ${token}` }
          }),
          axios.get('http://127.0.0.1:8000/api/flight_reservation/locations/to/', {
            headers: { Authorization: `Token ${token}` }
          })
        ]);
        setFromLocationsList(fromRes.data.map((item: any) => item.location));
        setToLocationsList(toRes.data.map((item: any) => item.location));
      } catch (err) {
        console.error('Error fetching locations', err);
      }
    }
    fetchLocations();
  }, []);

  useEffect(() => {
    const shouldShowTip = localStorage.getItem('showDashboardTip');
    if (shouldShowTip === '1') {
      setShowTip(true);
      localStorage.removeItem('showDashboardTip');
    }
  }, []);

  const handleCloseTip = (_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setShowTip(false);
  };

  const handleSearch = async () => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      let params: any = {};
  
      if (flightNumber) {
        params.flight_number = flightNumber;
      } else {
        if (!fromLocation || !toLocation || !startDate || !endDate) {
          setError('All Fields are required');
          return;
        }
        params = {
          from_location: fromLocation,
          to_location: toLocation,
          start_date: startDate,
          end_date: endDate,
        };
      }
  
      const response = await axios.get('http://127.0.0.1:8000/api/flight_reservation/search/', {
        params,
        headers: { Authorization: `Token ${token}` }
      });
      setFlights(response.data);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setFlights([]);
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };
  
  return (
    <Box p={4}>
      <Snackbar
        open={showTip}
        autoHideDuration={60000}
        onClose={handleCloseTip}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseTip} severity="info" variant="filled" sx={{ width: '100%',backgroundColor:"#009688" }}>
          Tip: You can search by entering only the flight number for a direct lookup.
          Or, leave the flight number field empty and fill in the other fields (From/To and Start/End Date) for an advanced search.
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          backgroundColor: 'black',
          color: 'white',
          px: 2,
        }}
      >
      <Typography variant='h4' mb={3} >Search Flights</Typography>

      {/* جعل عرض حقول البحث أكبر */}
      <Box 
        display="flex" 
        flexDirection="column" 
        gap={2} 
        mb={3} 
        maxWidth={{ xs: '100%', sm: 600, md: 700, lg: 800 }} 
        width="100%"
      >
      <TextField
        label="Flight Number"
        value={flightNumber}
        onChange={(e) => setFlightNumber(e.target.value)}
        fullWidth
        InputLabelProps={{ style: { color: 'white' } }}
        InputProps={{ style: { color: 'white' } }}
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#26a69a' },
            '&:hover fieldset': { borderColor: '#26a69a' },
            '&.Mui-focused fieldset': { borderColor: '#26a69a' },
          },
        }}
      />
        <TextField
          select
          label="From Location"
          value={fromLocation}
          onChange={(e) => setFromLocation(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { color: 'white' } }}
          SelectProps={{
            style: { color: 'white' }
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#26a69a' },
              '&:hover fieldset': { borderColor: '#26a69a' },
              '&.Mui-focused fieldset': { borderColor: '#26a69a' },
            },
          }}
        >
          {fromLocationsList.map((loc, index) => (
            <MenuItem key={index} value={loc}>{loc}</MenuItem>
          ))}
        </TextField>

        {/* ✅ To Location Dropdown */}
        <TextField
          select
          label="To Location"
          value={toLocation}
          onChange={(e) => setToLocation(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { color: 'white' } }}
          SelectProps={{
            style: { color: 'white' }
          }}
          sx={{
            width: '100%',
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#26a69a' },
              '&:hover fieldset': { borderColor: '#26a69a' },
              '&.Mui-focused fieldset': { borderColor: '#26a69a' },
            },
          }}
        >
          {toLocationsList.map((loc, index) => (
            <MenuItem key={index} value={loc}>{loc}</MenuItem>
          ))}
        </TextField>

        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true, style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{
            width: '100%',
            '& input[type="date"]::-webkit-calendar-picker-indicator': {
              filter: 'invert(1)',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#26a69a' },
              '&:hover fieldset': { borderColor: '#26a69a' },
              '&.Mui-focused fieldset': { borderColor: '#26a69a' },
            },
          }}
        />

        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true, style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{
            width: '100%',
            '& input[type="date"]::-webkit-calendar-picker-indicator': {
              filter: 'invert(1)',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#26a69a' },
              '&:hover fieldset': { borderColor: '#26a69a' },
              '&.Mui-focused fieldset': { borderColor: '#26a69a' },
            },
          }}
        />
        <Button 
          variant='contained' 
          onClick={handleSearch} 
          sx={{
            bgcolor:'#26a69a',
            width: '100%',
            fontSize: '1.1rem',
            py: 1.5
          }}
        >
          Search
        </Button>
      </Box>
      {error && (
        <Typography color="error" mb={2}>{error}</Typography>
      )}
      </Box>
      <hr />

{flights.length > 0 && (
  <Paper
    elevation={6}
    sx={{
      backgroundColor: '#1c1c1c',
      color: 'white',
      borderRadius: 2,
      mt: 4,
      overflowX: 'auto',
    }}
  >
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: '#26a69a' }}>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>✈ Airline</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>From</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>To</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Departure Date</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Departure Time</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expected Duration</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {flights.map((flight: any) => (
          <TableRow
            key={flight.id}
            hover
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#2e2e2e',
              },
            }}
          >
            <TableCell sx={{ color: 'white' }}>{flight.airline}</TableCell>
            <TableCell sx={{ color: 'white' }}>{flight.from_location}</TableCell>
            <TableCell sx={{ color: 'white' }}>{flight.to_location}</TableCell>
            <TableCell sx={{ color: 'white' }}>{flight.departure_date}</TableCell>
            <TableCell sx={{ color: 'white' }}>{flight.departure_time}</TableCell>
            <TableCell sx={{ color: 'white' }}>{flight.expected_time || 'N/A'}</TableCell>
            <TableCell>
              <Button
                variant="outlined"
                sx={{ borderColor: '#26a69a', color: '#26a69a' }}
                href={`/flight/${flight.id}`}
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
)}
    </Box>
  )
}

export default Dashboard