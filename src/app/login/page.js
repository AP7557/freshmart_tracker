'use client';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { auth, db } from '@/firebase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // Login with email/password
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign up with email/password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Create user document in Firestore with default role
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: email,
          role: 'user', // Default role
          stores: [], // No stores by default
          canViewOverview: false,
        });
      }
      router.push('/addTransactions');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(getFirestore(), 'users', user.uid));

      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(doc(getFirestore(), 'users', user.uid), {
          email: user.email,
          role: 'user', // Default role
          stores: [], // No stores by default
          canViewOverview: false,
        });
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='auth-container'>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>

      {error && <div className='error-message'>{error}</div>}

      <form onSubmit={handleAuth}>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          required
        />
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          required
          minLength='6'
        />
        <button type='submit'>{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>

      <div className='auth-divider' />

      <button
        onClick={handleGoogleSignIn}
        className='google-signin-btn'
      >
        Sign {isLogin ? 'in' : 'up'} with Google
      </button>

      <div className='auth-toggle'>
        {isLogin ? (
          <p>
            Don't have an account?{' '}
            <button onClick={() => setIsLogin(false)}>Sign Up</button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button onClick={() => setIsLogin(true)}>Login</button>
          </p>
        )}
      </div>

      <style jsx>{`
        .auth-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          text-align: center;
        }
        input {
          display: block;
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin: 0.5rem 0;
        }
        .google-signin-btn {
          background-color: #db4437;
          width: 100%;
        }
        .auth-divider {
          margin: 1rem 0;
          position: relative;
        }
        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background-color: #ddd;
          z-index: -1;
        }
        .auth-divider::after {
          content: 'OR';
          background: white;
          padding: 0 1rem;
        }
        .auth-toggle button {
          background: none;
          color: #0070f3;
          text-decoration: underline;
          padding: 0;
        }
        .error-message {
          color: red;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
}
