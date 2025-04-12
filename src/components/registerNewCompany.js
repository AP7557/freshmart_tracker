import { setStoreOrComapinesToDB } from '@/database/addTransactionToStoreSelectedDB';
import { useState } from 'react';

export default function RegisterNewCompany() {
  const [newCompany, setNewCompany] = useState(''); // State for new Company input

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (newCompany) {
      setStoreOrComapinesToDB('Companies', newCompany);
      setNewCompany(''); // Reset the input field
    }
  };

  return (
    <div className='mt-8'>
      <h3 className='text-xl font-semibold text-gray-700'>
        Register New Company
      </h3>
      <form
        onSubmit={handleAddCompany}
        className='mt-4'
      >
        <input
          type='text'
          value={newCompany}
          onChange={(e) => setNewCompany(e.target.value)}
          placeholder='Enter Company Name'
          className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          type='submit'
          className='w-full mt-4 p-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200'
        >
          Register Company
        </button>
      </form>
    </div>
  );
}
