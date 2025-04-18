// app/login/page.js
'use client';

import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/context/AuthContext';
import { FormControl, TextField } from '@mui/material';

export default function AuthPage() {
  const [loginCredentials, setLoginCredentials] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role !== 'user') {
      router.push('/overview');
    } else if (user) {
      router.push('/addTransactions');
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEmailAndPasswordSignIn = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          loginCredentials.email,
          loginCredentials.password
        );
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          loginCredentials.email,
          loginCredentials.password
        );
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: loginCredentials.name,
          email: loginCredentials.email,
          role: 'user',
          stores: [],
        });
      }
    } catch (err) {
      setError('Error ' + err.message.split('/')[1].split(')')[0]);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(getFirestore(), 'users', user.uid), {
          email: user.email,
          role: 'user',
          stores: [],
        });
      }
    } catch (err) {
      setError('Error ' + err.message.split('/')[1].split(')')[0]);
    }
  };

  return (
    <div className='flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'>
        <div className='p-6'>
          <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          {error && (
            <div className='mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm'>
              {error}
            </div>
          )}

          <form
            onSubmit={handleEmailAndPasswordSignIn}
            className='flex flex-col gap-4'
          >
            {!isLogin && (
              <FormControl>
                <TextField
                  id='name'
                  variant='filled'
                  label='Name'
                  value={loginCredentials.name}
                  onChange={(e) =>
                    setLoginCredentials((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                />
              </FormControl>
            )}
            <FormControl>
              <TextField
                id='email'
                type='email'
                label='Email'
                variant='filled'
                value={loginCredentials.email}
                onChange={(e) =>
                  setLoginCredentials((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder='your@email.com'
                required
              />
            </FormControl>

            <FormControl>
              <TextField
                id='password'
                label='Password'
                variant='filled'
                type='password'
                value={loginCredentials.password}
                onChange={(e) =>
                  setLoginCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                placeholder='••••••••'
                required
                minLength='6'
              />
            </FormControl>

            <button
              type='submit'
              className='w-full py-3 px-6 bg-[#22c55e] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors shadow-md'
            >
              {isLogin ? 'Login to Dashboard' : 'Create Account'}
            </button>
          </form>

          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className='w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition-colors mb-4'
          >
            <FcGoogle className='mr-2 text-lg' />
            <span>Google</span>
          </button>

          <div className='text-center text-sm text-gray-600'>
            {isLogin ? (
              <p>
                New to Freshmart?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className='text-primary-600 hover:text-[#15803d] font-medium underline'
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className='text-primary-600 hover:text-[#15803d] font-medium underline'
                >
                  Sign in instead
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
