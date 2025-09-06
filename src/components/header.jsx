import React from 'react';

export default function Header({ onAddNew }) {
  return (
    <header className="w-full max-w-4xl mx-auto py-8 px-4 flex justify-between items-center z-10">
      <h1 className="text-4xl text-blue-900 font-bold  drop-shadow-md">
        SkyTime
      </h1>
      <button
        onClick={onAddNew}
        className="bg-white/50 hover:bg-white/80 backdrop-blur-md text-sky-800 font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
      >
        + Add New
      </button>
    </header>
  );
}