'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../context/DataContext'; // Import the context hook
import { addTransactionToStoreSelectedDB } from '@/database/addTransactionToStoreSelectedDB';
import RegisterNewStore from '../../components/registerNewStore';
import ShowTodaysList from '../../components/showTodaysList';
import ConfirmModal from '../../components/confirmModal';
import RegisterNewCompany from '../../components/registerNewCompany';
import StoreSelection from '@/components/StoreSelection';
import CompanySelection from '@/components/CompanySelection';
import { withAuth } from '../../components/withAuth';

function AddTransactions({ user }) {
  const [storeSelected, setStoreSelected] = useState('');
  const [companySelected, setCompanySelected] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  // Use the data from the DataContext
  const { addTodaysTransaction } = useData();

  const checkNumber = watch('check');

  useEffect(() => {
    if (checkNumber && checkNumber !== '') {
      setValue('type', 'Payment');
    } else {
      setValue('type', '');
    }
  }, [checkNumber]);

  const onSubmit = (data) => {
    let newTransaction = {
      ...data,
      date: new Date().toLocaleDateString(),
    };
    addTransactionToStoreSelectedDB(storeSelected, { ...newTransaction });
    addTodaysTransaction({ ...newTransaction, store: storeSelected });
    setCompanySelected('');
    reset();
  };

  const handleConfirmSubmit = () => {
    onSubmit(formData); // Submit the form data after confirmation
    setIsModalOpen(false); // Close the modal
  };

  const handleOpenModal = (data) => {
    setFormData(data); // Save form data to submit later
    setIsModalOpen(true); // Open the confirmation modal
  };

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-semibold text-gray-700'>Add Transaction</h2>

      <StoreSelection
        setStoreSelected={setStoreSelected}
        storeSelected={storeSelected}
        user={user}
      />

      {/* Show Company Selection ONLY if store is selected */}
      {storeSelected && (
        <>
          <CompanySelection
            companySelected={companySelected}
            setCompanySelected={setCompanySelected}
            register={register}
            errors={errors}
          />

          {/* Register New Company only if no company is selected */}
          {!companySelected && <RegisterNewCompany />}
        </>
      )}

      {/* If a store and company are selected, show the transaction form */}
      {storeSelected && companySelected && (
        <form
          onSubmit={handleSubmit((data) => handleOpenModal(data))}
          className='mt-6 space-y-4'
        >
          <div>
            <div>Check Number:</div>
            <input
              {...register('check', { required: false, valueAsNumber: true })}
              type='number'
              placeholder='Enter Check Number'
              className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <div>Amount:</div>
            <input
              {...register('amount', { required: true, valueAsNumber: true })}
              type='number'
              step='.01'
              placeholder='Enter Amount'
              className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            {errors.amount && (
              <p className='text-red-500 text-sm'>Amount is required.</p>
            )}
          </div>

          <div>
            <div>Type:</div>
            <select
              disabled={(checkNumber && checkNumber !== '') || false}
              {...register('type', { required: true })}
              className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Select a Type</option>
              <option value='Invoice'>Invoice</option>
              <option value='Payment'>Payment</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
          >
            Save
          </button>
        </form>
      )}

      {/* Register New Store Component */}
      {!storeSelected && <RegisterNewStore />}

      <ConfirmModal
        isModalOpen={isModalOpen}
        handleConfirmSubmit={handleConfirmSubmit}
        setIsModalOpen={setIsModalOpen}
      />

      <ShowTodaysList storeSelected={storeSelected} />
    </div>
  );
}

export default withAuth(AddTransactions);
