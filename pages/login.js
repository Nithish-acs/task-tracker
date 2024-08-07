"use client"
import { useState } from 'react';
import { account } from '../src/lib/appwrite';
import { useRouter } from 'next/router';
import '../app/globals.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await account.createEmailPasswordSession(email, password);
      router.push('/board');
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  const signUpNavigate = ()=>{
    router.push('/register');
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="text-center mb-6">
          {/* <img
            src="/logo.png" // Replace with the path to your logo
            alt="Logo"
            className="mx-auto mb-4 w-24 h-24"
          /> */}
        </div>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded-md text-gray-800"
            />
          </div>
          <span onClick={signUpNavigate}  className="cursor-pointer text-blue-600 hover:text-blue-800 underline">New User</span>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md px-4 py-2 font-medium w-full hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
