import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Fix import
import { account } from './appwrite';

const withAuth = (WrappedComponent) => {
    const AuthWrapper = (props) => {
        const [loading, setLoading] = useState(true);
        const [authenticated, setAuthenticated] = useState(false);
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    await account.getSession('current');
                    setAuthenticated(true);
                } catch (error) {
                    setAuthenticated(false);
                    router.push('/login');
                } finally {
                    setLoading(false);
                }
            };

            checkAuth();
        }, [router]);

        if (loading) {
            return <p>Loading...</p>; // Render loading state
        }

        if (!authenticated) {
            return null; // Render nothing if not authenticated
        }

        return <WrappedComponent {...props} />;
    };

    AuthWrapper.displayName = `withAuth(${getDisplayName(WrappedComponent)})`;

    return AuthWrapper;

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}};

export default withAuth;
