import { useEffect } from 'react';
import { account } from  '../src/lib/appwrite';
import { useRouter } from 'next/navigation';
 
export default function Logout() {
  const router = useRouter();
 
  useEffect(() => {
    const handleLogout = async () => {
      try {
        await account.deleteSession('current');
        router.push('/login');
      } catch (error) {
        console.error(error);
        alert('Error logging out');
      }
    };
 
    handleLogout();
  }, [router]);
 
  return <p>Logging out...</p>;
}