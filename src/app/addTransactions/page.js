'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '../../context/DataContext';
import { addTransactionToStoreSelectedDB } from '@/database/addTransactionToStoreSelectedDB';
import RegisterNewStore from '@/components/registerNewStore';
import ShowTodaysList from '@/components/showTodaysList';
import ConfirmModal from '@/components/confirmModal';
import RegisterNewCompany from '@/components/registerNewCompany';
import StoreSelection from '@/components/StoreSelection';
import CompanySelection from '@/components/CompanySelection';
import { withAuth } from '@/components/withAuth';
import { FiPlus, FiDollarSign, FiCheck, FiType } from 'react-icons/fi';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';

function AddTransactions({ user }) {
  const [storeSelected, setStoreSelected] = useState('');
  const [companySelected, setCompanySelected] = useState('');
  const {
    register,
    unregister,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const { addTodaysTransaction } = useData();
  const checkNumber = watch('check');

  useEffect(() => {
    if (checkNumber && checkNumber !== '') {
      setValue('type', 'Payment');
      register('isCheckDeposited');
      setValue('isCheckDeposited', false);
    } else {
      setValue('type', '');
      unregister('isCheckDeposited');
    }
  }, [checkNumber]); // eslint-disable-line react-hooks/exhaustive-deps

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
          setStoreSelected={setStoreSelected}
          storeSelected={storeSelected}
          user={user}
        />

        {storeSelected && (
          <>
            <CompanySelection
              companySelected={companySelected}
              setCompanySelected={setCompanySelected}
              register={register}
              errors={errors}
            />

            {!companySelected && user?.role !== 'user' && (
              <RegisterNewCompany />
            )}
          </>
        )}

        {storeSelected && companySelected && (
          <form
            onSubmit={handleSubmit((data) => handleOpenModal(data))}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <label className=' text-sm font-medium text-gray-700 flex items-center gap-2'>
                <LiaMoneyCheckAltSolid className='text-green-600' />
                Check Number
              </label>
              <input
                {...register('check', { required: false, valueAsNumber: true })}
                type='number'
                placeholder='Enter Check Number'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                <FiDollarSign className='text-green-600' />
                Amount
                <span className='text-red-500'>*</span>
              </label>
              <input
                {...register('amount', { required: true, valueAsNumber: true })}
                type='number'
                step='.01'
                placeholder='Enter Amount'
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              />
              {errors.amount && (
                <p className='text-red-500 text-sm'>Amount is required.</p>
              )}
            </div>

            <div className='space-y-2'>
              <label className=' text-sm font-medium text-gray-700 flex items-center gap-2'>
                <FiType className='text-green-600' />
                Type
              </label>
              <select
                disabled={(checkNumber && checkNumber !== '') || false}
                {...register('type', { required: true })}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
              >
                <option value=''>Select a Type</option>
                <option value='Invoice'>Invoice</option>
                <option value='Payment'>Payment</option>
              </select>
            </div>

            <button
              type='submit'
              className='w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center gap-2'
            >
              <FiCheck />
              Save Transaction
            </button>
          </form>
        )}

        {!storeSelected && user?.role !== 'user' && (
          <RegisterNewStore user={user} />
        )}

        <ShowTodaysList storeSelected={storeSelected} />
      </div>

      <ConfirmModal
        isModalOpen={isModalOpen}
        handleConfirmSubmit={handleConfirmSubmit}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}

export default withAuth(AddTransactions);
