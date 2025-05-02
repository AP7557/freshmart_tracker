'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiDollarSign, FiCheck, FiType } from 'react-icons/fi';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';
import { PiInvoiceFill } from 'react-icons/pi';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/firebase';
import ShowTodaysList from '@/components/addTransactions/showTodaysList';
import ConfirmModal from '@/components/addTransactions/confirmModal';
import CompanySelection from '@/components/addTransactions/CompanySelection';
import StoreSelection from '@/components/StoreSelection';
import { withAuth } from '@/components/withAuth';

function AddTransactions({ user }) {
  const [selectedStore, setSelectedStore] = useState('');
  const [companySelected, setCompanySelected] = useState('');
  const {
    register,
    unregister,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [todaysTransactions, setTodaysTransactions] = useState([]);
  const [typeValue, setTypeValue] = useState('');

  const checkNumber = watch('checkNumber');

  useEffect(() => {
    if (checkNumber && checkNumber !== '') {
      register('isCheckDeposited');
      setValue('isCheckDeposited', false);
    } else {
      unregister('isCheckDeposited');
    }
  }, [checkNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    try {
      let newTransaction = {
        ...data,
        type: typeValue,
        date: new Date().toLocaleDateString(),
      };
      await addDoc(collection(db, selectedStore), { ...newTransaction });

      setTodaysTransactions((prevData) => [...prevData, newTransaction]);

      setCompanySelected('');
      setTypeValue('');
      reset();
    } catch (error) {
      console.error('Error adding transactions: ', error);
    }
  };

  const handleModalConfirmSubmit = () => {
    onSubmit(formData);
    setIsModalOpen(false);
  };

  const handleOpenModal = (data) => {
    setFormData(data);
    setIsModalOpen(true);
  };

  return (
    <div className='bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-4xl mx-auto'>
      <h2 className='text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2'>
        <FiPlus className='text-green-600' />
        Add Transaction
      </h2>

      <div className='space-y-6'>
        <StoreSelection
          isFromAddTransactions
          selectedStore={selectedStore}
          setSelectedStore={(e) => setSelectedStore(e.target?.value || e)}
          user={user}
        />

        {selectedStore && (
          <CompanySelection
            companySelected={companySelected}
            setCompanySelected={setCompanySelected}
            register={register}
          />
        )}

        {selectedStore && companySelected && (
          <form
            onSubmit={handleSubmit((data) => handleOpenModal(data))}
            className='flex flex-col gap-4'
          >
            <FormControl variant='filled'>
              <InputLabel id='select-type-label'>Type</InputLabel>
              <Select
                labelId='select-type-label'
                id='select-type'
                displayEmpty
                value={typeValue}
                onChange={(e) => setTypeValue(e.target.value)}
                required
                startAdornment={
                  <InputAdornment position='start'>
                    <FiType className='text-green-600' />
                  </InputAdornment>
                }
              >
                <MenuItem disabled value=''>
                  <em>Select a Type</em>
                </MenuItem>
                <MenuItem value='Invoice'>Invoice</MenuItem>
                <MenuItem value='Cash Payment'>Cash Payment</MenuItem>
                <MenuItem value='Check Payment'>Check Payment</MenuItem>
              </Select>
            </FormControl>
            {typeValue === 'Check Payment' && (
              <FormControl>
                <TextField
                  {...register('checkNumber', {
                    required: true,
                    valueAsNumber: true,
                  })}
                  id='checkNumber'
                  type='number'
                  required
                  placeholder='Enter Check Number'
                  label='Check Number'
                  variant='filled'
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position='start'>
                          <LiaMoneyCheckAltSolid className='text-green-600' />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </FormControl>
            )}
            <FormControl>
              <TextField
                {...register('amount', { required: true, valueAsNumber: true })}
                id='amount'
                type='number'
                placeholder='Enter Amount'
                label='Amount'
                variant='filled'
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <FiDollarSign className='text-green-600' />
                      </InputAdornment>
                    ),
                  },
                  htmlInput: {
                    step: '0.01',
                  },
                }}
              />
            </FormControl>
            <FormControl>
              <TextField
                {...register('invoiceNumber')}
                id='invoiceNumber'
                placeholder='Enter Invoice Number'
                label='Invoice Number'
                variant='filled'
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <PiInvoiceFill className='text-green-600' />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </FormControl>

            <Button
              type='submit'
              variant='contained'
              startIcon={<FiCheck />}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                py: 1.5,
                backgroundColor: 'var(--color-green-600)',
                ':hover': {
                  backgroundColor: 'var(--color-green-700)',
                },
              }}
            >
              Save Transaction
            </Button>
          </form>
        )}

        <ShowTodaysList
          selectedStore={selectedStore}
          todaysTransactions={todaysTransactions}
          setTodaysTransactions={setTodaysTransactions}
        />
      </div>

      <ConfirmModal
        isModalOpen={isModalOpen}
        handleConfirmSubmit={handleModalConfirmSubmit}
        getValues={getValues}
        setIsModalOpen={setIsModalOpen}
        typeValue={typeValue}
      />
    </div>
  );
}

export default withAuth(AddTransactions);
