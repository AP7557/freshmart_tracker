'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { fetchLists } from '@/database/getList';
import { addTransactionToStoreDoc } from '@/database/addToDB';
import RegisterNewStore from './home/registerNewStore';
import ShowTodaysList from './home/showTodaysList';
import ConfirmModal from './home/confirmModal';

export default function Home() {
  const [storeSelected, setStoreSelected] = useState('');
  const [transactionData, setTransactionData] = useState([]);
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [companyList, setCompanyList] = useState([]);
  const [storesList, setStoresList] = useState([]);

  // New state to control the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const onSubmit = (data) => {
    const newTransaction = {
      ...data,
      date: new Date().toLocaleDateString(),
      store: storeSelected,
    };
    setTransactionData([...transactionData, newTransaction]);
    addTransactionToStoreDoc({ newTransaction });
    reset();
  };

  // Handle form submission after confirmation
  const handleConfirmSubmit = () => {
    onSubmit(formData); // Submit the form data after confirmation
    setIsModalOpen(false); // Close the modal
  };

  const handleOpenModal = (data) => {
    setFormData(data); // Save form data to submit later
    setIsModalOpen(true); // Open the confirmation modal
  };

  useEffect(() => {
    const loadData = async () => {
      const [companyList, storeList] = await fetchLists();
      setStoresList(Object.values(storeList)); // Store the stores in state
      setCompanyList(Object.values(companyList)); // Store the companies in state
    };

    loadData(); // Fetch lists on component mount
  }, []);

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-semibold text-gray-700'>Add Transaction</h2>

      {/* Store Selection */}
      <div className='mt-4'>
        <select
          onChange={(e) => setStoreSelected(e.target.value)}
          value={storeSelected}
          className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value=''>Select a Store</option>
          {storesList.map((storeOption, index) => (
            <option
              key={index}
              value={storeOption}
            >
              {storeOption}
            </option>
          ))}
        </select>
      </div>

      {/* Form Inputs for Transaction */}
      {storeSelected && (
        <form
          onSubmit={handleSubmit((data) => handleOpenModal(data))} // Open modal with form data
          className='mt-6 space-y-4'
        >
          <div>
            <div>Company:</div>
            <select
              {...register('company', { required: true })}
              className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Select a Company</option>
              {companyList.map((company, index) => (
                <option
                  key={index}
                  value={company}
                >
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div>Amount:</div>
            <input
              {...register('amount', { required: true })}
              type='number'
              step='.01'
              placeholder='Enter Amount'
              className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <div>Type:</div>
            <select
              {...register('type', { required: true })}
              className='w-full p-3 border rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>Select a Type</option>
              <option value='Invoice'>Invoice</option>
              <option value='Payment'>Payment</option>
            </select>
          </div>
          <button
            type='submit'
            className='w-full p-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200'
          >
            Save
          </button>
        </form>
      )}

      <ConfirmModal
        isModalOpen={isModalOpen}
        handleConfirmSubmit={handleConfirmSubmit}
        setIsModalOpen={setIsModalOpen}
      />

      <RegisterNewStore
        storeSelected={storeSelected}
        setStoresList={setStoresList}
        storesList={storesList}
      />

      <ShowTodaysList
        transactionData={transactionData}
        storeSelected={storeSelected}
      />
    </div>
  );
}
