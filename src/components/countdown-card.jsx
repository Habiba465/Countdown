'use client';

import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { motion, AnimatePresence } from 'framer-motion';

const TimeCard = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-20 h-24 bg-blue-400 rounded-xl overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={value}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-5xl font-bold text-sky-100" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.7)' }}>
              {String(value).padStart(2, '0')}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-sm text-blue-900 uppercase tracking-widest mt-3">{label}</span>
    </div>
  );
};

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
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.date]);


  return (
    <Tilt
      className="parallax-effect-glare-scale"
      perspective={800}
      glareEnable={true}
      glareMaxOpacity={0.25}
      glarePosition="all"
      scale={1.05}
      gyroscope={true}
    >
      <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-sky-500/20 p-8 w-full transition-all duration-500 ease-out overflow-hidden">        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-bold text-blue-600" style={{ textShadow: '0 0 10px rgba(224, 242, 254, 0.5)' }}>
            {countdown.title}
          </h2>
          
          <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(countdown)} 
                className="text-blue-400 hover:text-blue-700 transition-colors duration-300"
              >
                <HiOutlinePencilSquare className="h-7 w-7" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(countdown.id)} 
                className="text-rose-400 hover:text-rose-700 transition-colors duration-300"
              >

                <HiOutlineTrash className="h-7 w-7" />
              </motion.button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 text-center">
          <TimeCard value={timeLeft.days} label="Days" />
          <TimeCard value={timeLeft.hours} label="Hours" />
          <TimeCard value={timeLeft.minutes} label="Minutes" />
          <TimeCard value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </Tilt>
  );
}