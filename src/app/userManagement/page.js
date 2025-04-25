'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiShield,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { withAuth } from '@/components/withAuth';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';

// Available roles and store options
const ROLES = ['admin', 'manager', 'user'];

function UserManagementPage({ user }) {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [storesList, setStoresList] = useState([]);

  // Only allow admins to access this page
  if (user?.role !== 'admin') {
    router.push('/addTransactions');
  }

  useEffect(() => {
    const fetchUsersAndStores = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);

        const storesListDocRef = doc(db, 'Lists', 'Stores');
        const storesListDoc = await getDoc(storesListDocRef);
        setStoresList(Object.values(storesListDoc.data()));

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch');
        console.error(err);
      }
    };

    fetchUsersAndStores();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updates = { role: newRole };

      // If changing to admin, give access to all stores
      if (newRole === 'admin') {
        updates.stores = storesList;
      }

      await updateDoc(doc(db, 'users', userId), updates);

      setUsers(
        users.map((u) =>
          u.id === userId
            ? {
                ...u,
                role: newRole,
                ...(newRole === 'admin' && { stores: storesList }),
              }
            : u
        )
      );
      setSuccess('Role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update role');
      setTimeout(() => setError(''), 3000);
      console.error(err);
    }
  };

  const handleStoreAccessChange = async (userId, storeId, isChecked) => {
    try {
      const user = users.find((u) => u.id === userId);
      let updatedStores = user?.stores || [];

      if (isChecked) {
        updatedStores = [...updatedStores, storeId];
      } else {
        updatedStores = updatedStores.filter((id) => id !== storeId);
      }

      await updateDoc(doc(db, 'users', userId), {
        stores: updatedStores,
      });

      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, stores: updatedStores } : u
        )
      );
      setSuccess('Store access updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update store access');
      setTimeout(() => setError(''), 3000);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-full'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-6xl mx-auto'>
      <div className='flex items-center gap-3 mb-6'>
        <FiUsers className='text-green-600 text-2xl' />
        <h1 className='text-2xl font-semibold text-gray-800'>
          User Management
        </h1>
      </div>

      <p className='text-gray-600 mb-6'>
        As a admin, you can manage user roles and store access.
      </p>

      {error && (
        <div className='mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2'>
          <FiX className='text-red-700' />
          {error}
        </div>
      )}

      {success && (
        <div className='mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-2'>
          <FiCheck className='text-green-700' />
          {success}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {users.map((user) => (
          <div
            key={user.id}
            className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
          >
            <div className='flex justify-between items-start mb-4 pb-4 border-b border-gray-100'>
              <div className='flex items-center gap-2'>
                <FiUser className='text-gray-500' />
                <h3 className='font-medium text-gray-800'>{user.name}</h3>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : user.role === 'manager'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {user.role}
              </span>
            </div>

            <FormControl
              fullWidth
              variant='filled'
              sx={{ marginBottom: 2 }}
            >
              <InputLabel id='select-role-label'>Role</InputLabel>
              <Select
                labelId='select-role-label'
                id='select-role'
                displayEmpty
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                value={user.role}
                startAdornment={
                  <InputAdornment position='start'>
                    <FiShield className='text-green-600' />
                  </InputAdornment>
                }
              >
                {ROLES.map((role) => (
                  <MenuItem
                    key={role}
                    value={role}
                  >
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {user.role !== 'admin' ? (
              <div>
                <InputLabel
                  id='select-type-label'
                  className='!flex items-center gap-2'
                >
                  <FiUserCheck className='text-green-600' /> Store Access
                </InputLabel>

                <FormControl
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  {storesList.map((storeId) => (
                    <FormControlLabel
                      key={storeId}
                      control={
                        <Checkbox
                          id={`${user.id}-${storeId}`}
                          checked={user.stores?.includes(storeId) || false}
                          onChange={(e) =>
                            handleStoreAccessChange(
                              user.id,
                              storeId,
                              e.target.checked
                            )
                          }
                        />
                      }
                      label={storeId}
                    />
                  ))}
                </FormControl>
              </div>
            ) : (
              <div className='text-center mt-3'>
                You have access to all the Stores
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(UserManagementPage, ['admin']);
