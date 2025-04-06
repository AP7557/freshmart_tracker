'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const { login, signup, googleLogin, currentUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.push('/overview');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.push('/overview');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>

        {error && (
          <div className='mb-4 p-2 bg-red-100 text-red-700 rounded-md'>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <TextField
            fullWidth
            label='Email'
            type='email'
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label='Password'
            type='password'
            variant='outlined'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            type='submit'
            variant='contained'
            color='primary'
            size='large'
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <div className='mt-4 text-center'>
          <Button
            fullWidth
            variant='outlined'
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            className='mt-2'
          >
            Continue with Google
          </Button>
        </div>

        <div className='mt-4 text-center'>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className='text-blue-600 hover:text-blue-800'
          >
            {isSignUp
              ? 'Already have an account? Login'
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
