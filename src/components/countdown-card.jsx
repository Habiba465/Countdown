'use client';

import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

const TimeBlock = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center relative">
    
    <span className="text-5xl font-bold text-sky-100 tracking-wider" style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}>
      {String(value).padStart(2, '0')}
    </span>

    <span className="text-sm text-white/70 uppercase tracking-widest mt-1">{label}</span>
  </div>
);

export default function CountdownCard({ countdown, onEdit, onDelete }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(countdown.date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
       timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.date]);


  return (
    <Tilt
      className="parallax-effect-glare-scale background-transparent"
      perspective={500}
      glareEnable={true}
      glareMaxOpacity={0.45}
      scale={1.02}
      gyroscope={true}
    >
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg shadow-sky-200/10 p-8 w-full transition-all duration-500 ease-out">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-semibold text-sky-200">{countdown.title}</h2>
          
          <div className="flex gap-4">
              <button 
                onClick={() => onEdit(countdown)} 
                className="text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                <HiOutlinePencilSquare className="h-6 w-6" />
              </button>
              <button 
                onClick={() => onDelete(countdown.id)} 
                className="text-rose-300/70 hover:text-rose-300 transition-colors duration-300 cursor-pointer"
              >
                <HiOutlineTrash className="h-6 w-6" />
              </button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Minutes" />
          <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </Tilt>
  );
}