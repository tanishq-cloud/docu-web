import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const withAuth = (WrappedComponent: React.FC) => {
  return function WithAuthComponent(props: any) {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.replace("/auth/login"); // Redirect to login if not authenticated
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Show a loading state while checking auth
    }

    if (user) {
      return <WrappedComponent {...props} />; // Render the protected component
    }

    // Return null or a redirect component (already handled by useEffect)
    return null;
  };
};

export default withAuth;
