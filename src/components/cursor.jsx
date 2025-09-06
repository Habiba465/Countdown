'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';


export default function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 200,
      y: mousePosition.y - 200,
    },
  };

  return (
    <motion.div
      className="hidden md:block fixed top-0 left-0 w-96 h-96 bg-sky-300/40 rounded-full pointer-events-none -z-10 blur-3xl"
      variants={variants}
      animate="default"
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
        mass: 0.1,
      }}
    />
  );
}