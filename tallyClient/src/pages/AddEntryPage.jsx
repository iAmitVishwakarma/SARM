import React from 'react';
import AddEntryForm from '../components/features/AddEntryForm';

export default function AddEntryPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-3xl font-bold">Add New Entry</h1>
      <AddEntryForm />
    </div>
  );
}