"use client";

import { account } from '../../src/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('Error logging out');
    }
  };

  return (
    <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      <p>
        Get started by editing&nbsp;
        <code className="font-mono font-bold">app/page.js</code>
      </p>
      <button 
        onClick={handleLogout} 
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
}
