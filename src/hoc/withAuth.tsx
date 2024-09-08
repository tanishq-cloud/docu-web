import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { CircularProgress } from "@nextui-org/progress";

const withAuth = (WrappedComponent: React.FC) => {
  return function WithAuthComponent(props: any) {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    // Redirect if user is not authenticated once loading is done
    useEffect(() => {
      if (!loading && !user) {
        router.replace("/services/login"); // Redirect to login if not authenticated
      }
    }, [user, loading, router]);

    // Loading state (shows a spinner while checking the auth state)
    if (loading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="flex flex-col items-center justify-center">
            <CircularProgress color="primary" label="Loading, please wait..." />
          </div>
        </div>
      );
    }

    // Error state handling
    if (error) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <p className="text-red-600">An error occurred: {error.message}</p>
        </div>
      );
    }

    // Render the wrapped component if the user is authenticated
    if (user) {
      return <WrappedComponent {...props} />;
    }

    // Return null since the user is being redirected by useEffect
    return null;
  };
};

export default withAuth;
