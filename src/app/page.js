'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CountdownCard from '@/components/countdown-card';
import SkyBackground from '@/components/background'; 

export default function Home() {

  const [countdowns, setCountdowns] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCountdown, setCurrentCountdown] = useState({ title: '', date: '' });
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    try {
      const storedCountdowns = localStorage.getItem('skyTimeCountdowns');
      if (storedCountdowns) {
        setCountdowns(JSON.parse(storedCountdowns));
      }
    } catch (error) {
      console.error("Failed to parse countdowns from local storage:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('skyTimeCountdowns', JSON.stringify(countdowns));
    } catch (error) {
      console.error("Failed to save countdowns to local storage:", error);
    }
  }, [countdowns]);


  const handleOpenModal = (countdown = null) => {
    if (countdown) {
      setEditingId(countdown.id);
      const date = new Date(countdown.date);
      const formattedDate = date.toISOString().slice(0, 16);
      setCurrentCountdown({ title: countdown.title, date: formattedDate });
    } else {
      setEditingId(null);
      setCurrentCountdown({ title: '', date: '' });
    }
    setIsModalOpen(true);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCountdown({ title: '', date: '' });
    setEditingId(null);
  };


  const handleSaveCountdown = (e) => {
    e.preventDefault();
    const targetDate = new Date(currentCountdown.date).toISOString();

    if (editingId) {
      setCountdowns(
        countdowns.map((c) =>
          c.id === editingId ? { ...c, title: currentCountdown.title, date: targetDate } : c
        )
      );
    } else {
      setCountdowns([
        ...countdowns,
        { id: Date.now(), title: currentCountdown.title, date: targetDate },
      ]);
    }
    handleCloseModal();
  };
  

  const handleDeleteCountdown = (id) => {
    if (window.confirm("Are you sure ?")) {
      setCountdowns(countdowns.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between  text-gray-800 ">
      <SkyBackground />

      <div className="relative z-10 w-full flex flex-col flex-grow items-center">
        <Header onAddNew={() => handleOpenModal()} />

        <main className="w-full max-w-5xl mx-auto px-4 flex-grow">
          {countdowns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center">
              {countdowns.map((countdown) => (
                <CountdownCard
                  key={countdown.id}
                  countdown={countdown}
                  onEdit={handleOpenModal}
                  onDelete={handleDeleteCountdown}
                />
              ))}
            </div>
          ) : (
            <div className="text-center mt-20">
              <p className="text-white text-xl drop-shadow-md">
                No countdowns yet. Let's create one!
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-sky-700">
              {editingId ? 'Edit Countdown' : 'New Countdown'}
            </h2>
            <form onSubmit={handleSaveCountdown}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sky-400 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  value={currentCountdown.title}
                  onChange={(e) => setCurrentCountdown({ ...currentCountdown, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/20 text-black border border-white/30 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none placeholder-sky-200/50"
                  required
                  placeholder="Trip to the Alps"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="date" className="block text-sky-400 mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  id="date"
                  value={currentCountdown.date}
                  onChange={(e) => setCurrentCountdown({ ...currentCountdown, date: e.target.value })}
                  className="w-full px-4 py-2 bg-white/20 text-black border border-white/30 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCloseModal} className="text-red-300 font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-full transition-transform transform hover:scale-105">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}