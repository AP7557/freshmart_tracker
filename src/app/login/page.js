// app/login/page.js
"use client";

import { useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push("/addTransactions");
    }
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          role: "user",
          stores: [],
        });
      }
    } catch (err) {
      setError("Error " + err.message.split("/")[1].split(")")[0]);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDoc = await getDoc(doc(getFirestore(), "users", user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(getFirestore(), "users", user.uid), {
          email: user.email,
          role: "user",
          stores: [],
        });
      }
    } catch (err) {
      setError("Error " + err.message.split("/")[1].split(")")[0]);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-[#22c55e] hover:bg-[#15803d] text-white font-bold rounded-lg transition-colors shadow-md"
            >
              {isLogin ? "Login to Dashboard" : "Create Account"}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                OR CONTINUE WITH
              </span>
            </div>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors mb-4"
          >
            <FcGoogle className="mr-2 text-lg" />
            <span>Google</span>
          </button>
          <div className="text-center text-sm text-gray-600">
            {isLogin ? (
              <p>
                New to Freshmart?
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-primary-600 hover:text-primary-700 font-medium underline"
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
