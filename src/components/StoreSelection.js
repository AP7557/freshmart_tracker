import React, { useEffect } from 'react';
import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { LiaStoreAltSolid } from 'react-icons/lia';
import RegisterNewStoreOrCompany from './addTransactions/registerNewStoreOrCompany';

function StoreSelection({
  isFromAddTransactions,
  selectedStore,
  setSelectedStore,
  user,
}) {
  return (
    <>
      <FormControl fullWidth variant='filled' sx={{ marginBottom: 2 }}>
        <InputLabel id='select-store-label'>Store</InputLabel>
        <Select
          labelId='select-store-label'
          id='select-store'
          displayEmpty
          disabled={user?.stores?.length === 0}
          value={selectedStore}
          startAdornment={
            <InputAdornment position='start'>
              <LiaStoreAltSolid className='text-green-600 mr-2' />
            </InputAdornment>
          }
          onChange={setSelectedStore}
        >
          <MenuItem disabled value=''>
            {user?.stores?.length === 0 ? (
              <em>
                Uh-Oh Looks like you don't have access to any stores, please
                contact an owner for access
              </em>
            ) : (
              <em>Select a Store</em>
            )}
          </MenuItem>
          {user?.stores?.map((storeOption, index) => (
            <MenuItem key={index} value={storeOption}>
              {storeOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isFromAddTransactions && !selectedStore && user?.role !== 'user' && (
        <RegisterNewStoreOrCompany shouldRegisterCompany={false} />
      )}
    </>
  );
}

export default StoreSelection;
