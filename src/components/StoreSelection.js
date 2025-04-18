import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import React from 'react';
import { LiaStoreAltSolid } from 'react-icons/lia';
import RegisterNewStoreOrCompany from './addTransactions/registerNewStoreOrCompany';

function StoreSelection({
  isFromAddTransactions,
  storeSelected,
  setStoreSelected,
  user,
}) {
  return (
    <>
      <FormControl
        fullWidth
        variant='filled'
        sx={{ marginBottom: 2 }}
      >
        <InputLabel id='select-store-label'>Store</InputLabel>
        <Select
          labelId='select-store-label'
          id='select-store'
          displayEmpty
          value={storeSelected}
          startAdornment={
            <InputAdornment position='start'>
              <LiaStoreAltSolid className='text-green-600 mr-2' />
            </InputAdornment>
          }
          onChange={setStoreSelected}
        >
          <MenuItem
            disabled
            value=''
          >
            <em>Select a Store</em>
          </MenuItem>
          {user?.stores?.map((storeOption, index) => (
            <MenuItem
              key={index}
              value={storeOption}
            >
              {storeOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isFromAddTransactions && !storeSelected && user?.role !== 'user' && (
        <RegisterNewStoreOrCompany user={user} />
      )}
    </>
  );
}

export default StoreSelection;
