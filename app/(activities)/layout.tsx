'use client'

import React, { useState, FC } from 'react'
import Link from 'next/link'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Swal from 'sweetalert2';

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const router = useRouter();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'are you sure?',
      text: 'Exit from the account will be logged.',
      icon: 'warning',
      showCancelButton: true,
      color:"#fff",
      confirmButtonColor: '#26a69a',
      cancelButtonColor: '#b0bec5',
      background: '#004d40',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');

        await axios.post(
          'http://127.0.0.1:8000/api/auth/client/logout/',
          {},
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        localStorage.removeItem('token');

        await Swal.fire({
          title: 'The exit has been logged!',
          text: 'the exit was successfully released.',
          icon: 'success',
          confirmButtonColor: '#26a69a',
          background: '#004d40',
          color:"#fff",
          confirmButtonText: 'OK',
        });

        router.push('/login');
      } catch (err: any) {
        Swal.fire({
          title: 'error ',
          text: err.response?.data?.error || 'something happend please try again',
          icon: 'error',
          confirmButtonColor: '#26a69a',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <nav className="bg-teal-500 px-6 py-4 flex justify-between items-center shadow-md relative">
      <div className="flex items-center space-x-4">
        <AirplanemodeActiveIcon className="text-white" />
        <Button variant="contained" sx={{ backgroundColor: "#26a69a" }} onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Desktop links */}
      <ul className="hidden md:flex space-x-6 text-white font-medium">
        <li>
          <Link href="/dashboard" className="hover:underline transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/profile" className="hover:underline transition">
            Profile
          </Link>
        </li>
      </ul>

      {/* Mobile menu toggle button */}
      <button
        onClick={toggleMenu}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden text-white text-2xl focus:outline-none"
      >
        {isMenuOpen ? (
          <CloseIcon fontSize="large" />
        ) : (
          <MenuIcon fontSize="large" />
        )}
      </button>

      {/* Mobile menu */}
      {isMenuOpen && (
        <ul className="absolute top-full right-0 mt-2 bg-teal-500 text-white font-medium py-2 px-4 rounded shadow-md md:hidden z-50">
          <li className="py-1">
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
          <li className="py-1">
            <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          </li>
        </ul>
      )}
    </nav>
  )
}

// Layout Props
interface DashboardLayoutProps {
  children: React.ReactNode
}

// Dashboard layout
const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  )
}

export default DashboardLayout
