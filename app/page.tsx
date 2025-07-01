'use client';

import Image from "next/image";
import Link from 'next/link';
import Button from '@mui/material/Button';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Home() {
  return (
    <div>
      <div className="relative w-full h-screen">
        <Image
          src="/plane.jpg"
          alt="Hero image"
          fill
          className="object-cover"
        />
          <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-black/50 z-50">
            <Link href="/login" passHref>
                <Button 
                  variant="contained" 
                  size="small" 
                  sx={{ backgroundColor: "#26a69a" }}
                >
                  Login
                </Button>
              </Link>
              <span className="text-teal-500 text-xl font-bold">Fly Now !😊</span>
              <div className=" relative">
                  <FlightTakeoffIcon fontSize="large" sx={{color:"#26a69a"}}/>
              </div>
          </nav>
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <h1 className="text-teal-500 text-7xl font-extrabold tracking-wide font-serif mb-6">
            FlyAway
          </h1>
          <p className="text-teal-500 text-xl font-bold">
            Now you can book all your trips through this site and at the best pricse.
          </p>
        </div>
        <footer className="absolute bottom-0 left-0 w-full bg-black/50 text-white py-4 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
          <div className="flex space-x-4 mb-4 md:mb-0">
            FlyAway.com
          </div>

          <div className="text-sm">
            © {new Date().getFullYear()} FlyAway. All rights reserved.
          </div>

          <div className="flex space-x-3 mt-4 md:mt-0">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-teal-400">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-teal-400">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-teal-400">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
