import { useState } from 'react';
import { FiPlus, FiCheck, FiX, FiBriefcase } from 'react-icons/fi';
import { LiaStoreAltSolid } from 'react-icons/lia';

import { db } from '@/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import { FormControl, InputAdornment, TextField } from '@mui/material';

export default function RegisterNewStoreOrCompany({
  user,
  shouldRegisterCompany,
}) {
  const name = shouldRegisterCompany ? 'Company' : 'Store';
  const [register, setRegister] = useState({
    nameToRegister: '',
    successMessage: '',
    errorMessage: '',
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Update the Store List
      await setDoc(
        doc(db, 'Lists', shouldRegisterCompany ? 'Companies' : 'Stores'),
        { [register.nameToRegister]: register.nameToRegister },
        { merge: true }
      );
      
      if (!shouldRegisterCompany) {
        // Update current user's store access
        if (user?.uid) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          const currentStores = userDoc.data().stores || [];
          await updateDoc(userRef, {
            stores: [...currentStores, register.nameToRegister],
          });
        }

        // Update all admin users' store access
        const usersCollectionRef = collection(db, 'users');
        const adminQuery = query(
          usersCollectionRef,
          where('role', '==', 'admin')
        );
        const adminQuerySnapshot = await getDocs(adminQuery);

        const updatePromises = [];
        adminQuerySnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          const currentAdminStores = userData.stores || [];
          if (!currentAdminStores.includes(register.nameToRegister)) {
            updatePromises.push(
              updateDoc(doc(db, 'users', userDoc.id), {
                stores: [...currentAdminStores, register.nameToRegister],
              })
            );
          }
        });

        await Promise.all(updatePromises);
      }

      setRegister((prev) => ({
        ...prev,
        nameToRegister: '',
        successMessage: `${name} added successfully ${
          shouldRegisterCompany ? '' : 'and access updated!'
        }`,
      }));
      setTimeout(
        () =>
          setRegister((prev) => ({
            ...prev,
            successMessage: '',
          })),
        3000
      );
    } catch (err) {
      console.error(`Error adding ${name}:`, err);
      setRegister((prev) => ({
        ...prev,
        errorMessage: '',
      }));
      setTimeout(
        () =>
          setRegister((prev) => ({
            ...prev,
            errorMessage: '',
          })),
        3000
      );
    }
  };

  return (
    <div>
      {register.errorMessage && (
        <div className='p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2'>
          <FiX className='text-red-700' />
          {register.errorMessage}
        </div>
      )}
      {register.successMessage && (
        <div className='p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2'>
          <FiCheck className='text-green-700' />
          {register.successMessage}
        </div>
      )}
      <FormControl
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <TextField
          id='name'
          variant='filled'
          label={`Register New ${name}`}
          value={register.nameToRegister}
          onChange={(e) =>
            setRegister((prev) => ({
              ...prev,
              nameToRegister: e.target.value,
            }))
          }
          placeholder={`${name} Name`}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  {shouldRegisterCompany ? (
                    <FiBriefcase className='text-green-600' />
                  ) : (
                    <LiaStoreAltSolid className='text-green-600' />
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
      </FormControl>
      <button
        type='submit'
        onClick={handleRegister}
        disabled={!register.nameToRegister}
        className='w-full py-3 px-4 disabled:cursor-not-allowed disabled:bg-gray-400 cursor-pointer  bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2'
      >
        <FiPlus />
        Register {name}
      </button>
    </div>
  );
}
