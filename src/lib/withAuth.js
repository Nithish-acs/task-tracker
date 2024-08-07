import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from './appwrite';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          await account.getSession('current');
          setAuthenticated(true);
        } catch {
          setAuthenticated(false);
          router.push('/login');
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return authenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
