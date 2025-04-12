'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useData } from '@/context/DataContext';
import { auth, db } from '@/firebase';
import { withAuth } from '../../components/withAuth';
import { useRouter } from 'next/navigation';

// Available roles and store options
const ROLES = ['master', 'manager', 'user'];

function UserManagementPage({ user }) {
  const router = useRouter();

  const { storesList } = useData();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Only allow master admins to access this page
  if (user.role !== 'master') {
    router.push('/addTransactions'); // or your fallback route
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersList);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
      });
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setSuccess('Role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update role');
      console.error(err);
    }
  };

  const handleStoreAccessChange = async (userId, storeId, isChecked) => {
    try {
      const user = users.find((u) => u.id === userId);
      let updatedStores = user.stores || [];

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
      console.error(err);
    }
  };

  const handleOverviewAccessChange = async (userId, canView) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        canViewOverview: canView,
      });
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, canViewOverview: canView } : u
        )
      );
      setSuccess('Overview access updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update overview access');
      console.error(err);
    }
  };

  if (loading) return <div className='container'>Loading users...</div>;

  return (
    <div className='container'>
      <h1>User Management</h1>
      <p className='description'>
        As a master admin, you can manage user roles and store access.
      </p>

      {error && <div className='alert error'>{error}</div>}
      {success && <div className='alert success'>{success}</div>}

      <div className='user-list'>
        {users.map((user) => (
          <div
            key={user.id}
            className='user-card'
          >
            <div className='user-header'>
              <h3>{user.email}</h3>
              <span className={`role-badge ${user.role}`}>{user.role}</span>
            </div>

            <div className='user-controls'>
              <div className='control-group'>
                <label>Role:</label>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  disabled={user.id === auth.currentUser?.uid} // Can't change own role
                >
                  {ROLES.map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className='control-group'>
                <label>Store Access:</label>
                <div className='store-checkboxes'>
                  {storesList.map((storeId) => (
                    <div
                      key={storeId}
                      className='checkbox-item'
                    >
                      <input
                        type='checkbox'
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
                      <label htmlFor={`${user.id}-${storeId}`}>{storeId}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className='control-group'>
                <label>
                  <input
                    type='checkbox'
                    checked={user.canViewOverview || false}
                    onChange={(e) =>
                      handleOverviewAccessChange(user.id, e.target.checked)
                    }
                  />
                  Can View Overview
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        .description {
          color: #666;
          margin-bottom: 2rem;
        }
        .alert {
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }
        .error {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #ef9a9a;
        }
        .success {
          background-color: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #a5d6a7;
        }
        .user-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .user-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          background: white;
        }
        .user-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }
        .role-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        .role-badge.master {
          background-color: #f3e5f5;
          color: #9c27b0;
        }
        .role-badge.admin {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        .role-badge.manager {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        .role-badge.user {
          background-color: #fff3e0;
          color: #ef6c00;
        }
        .user-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .control-group label {
          font-weight: 500;
          color: #333;
        }
        .store-checkboxes {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        select,
        input[type='checkbox'] {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        select {
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export default withAuth(UserManagementPage);
