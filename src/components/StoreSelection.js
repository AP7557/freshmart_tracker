import React from 'react';
import { useAuth } from '@/context/AuthContext';

function StoreSelection({ setStoreSelected, storeSelected }) {
  const { user } = useAuth();

  return (
    <div className='mt-4'>
      <select
        onChange={(e) => setStoreSelected(e.target.value)}
        value={storeSelected}
        className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <option value=''>Select a Store</option>
        {user.stores?.map((storeOption, index) => (
          <option
            key={index}
            value={storeOption}
          >
            {storeOption}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StoreSelection;
