import { db } from '@/firebase';
import { Autocomplete, InputAdornment, TextField } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FiBriefcase } from 'react-icons/fi';
import RegisterNewStoreOrCompany from './registerNewStoreOrCompany';

function CompanySelection({ companySelected, setCompanySelected, register }) {
  const [companyList, setCompanyList] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companyListDocRef = doc(db, 'Lists', 'Companies');
        const companyListDoc = await getDoc(companyListDocRef);
        setCompanyList(Object.values(companyListDoc.data()));
      } catch (err) {
        setError('Failed to fetch companies');
        console.error(err);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <>
      <Autocomplete
        disablePortal
        options={companyList}
        value={companySelected || null}
        onChange={(_, newValue) => {
          setCompanySelected(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            {...register('company', { required: true })}
            label='Company'
            variant='filled'
            placeholder='Select a Company'
            sx={{ '& .MuiInputBase-root': { paddingLeft: '12px' } }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment
                    position='start'
                    sx={{ marginTop: '0px !important' }}
                  >
                    <FiBriefcase className='text-green-600 mr-2' />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      />

      {!companySelected && <RegisterNewStoreOrCompany shouldRegisterCompany />}
    </>
  );
}

export default CompanySelection;
