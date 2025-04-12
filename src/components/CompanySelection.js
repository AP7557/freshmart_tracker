import { useData } from '@/context/DataContext';
import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useRef } from 'react';

function CompanySelection({
  companySelected,
  setCompanySelected,
  register,
  errors,
}) {
  const { companyList } = useData();
  const autocompleteRef = useRef(null);

  // Sync the Autocomplete input with the selected value
  useEffect(() => {
    if (autocompleteRef.current && companySelected) {
      autocompleteRef.current.querySelector('input').value = companySelected;
    }
  }, [companySelected]);

  return (
    <div className='mt-4'>
      <div className='mb-1 text-gray-700'>Company:</div>
      <Autocomplete
        ref={autocompleteRef}
        options={companyList}
        value={companySelected || null}
        onChange={(_, newValue) => {
          setCompanySelected(newValue);
        }}
        isOptionEqualToValue={(option, value) => option === value}
        renderInput={(params) => (
          <TextField
            {...params}
            {...register('company', { required: true })}
            label='Select a Company'
            variant='outlined'
            className='bg-white rounded-md'
            fullWidth
          />
        )}
      />
    </div>
  );
}

export default CompanySelection;
