import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../src/store/auth";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ requiredRole }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give a moment for the store to hydrate from localStorage
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Check localStorage as fallback
  const localToken = localStorage.getItem('token');
  const localUserStr = localStorage.getItem('user');
  let localUser = null;
  
  try {
    localUser = localUserStr ? JSON.parse(localUserStr) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localUser = null;
  }

  const currentToken = token || localToken;
  const currentUser = user || localUser;

  console.log('ProtectedRoute debug:', {
    isLoading,
    zustandToken: !!token,
    zustandUser: user,
    localToken: !!localToken,
    localUser,
    currentToken: !!currentToken,
    currentUser,
    requiredRole
  });

  // Show loading while hydrating
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If no token, redirect to login
  if (!currentToken) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/admin/login" replace />;
  }

  // If role is required and user doesn't have it, redirect to login
  if (requiredRole && (!currentUser || currentUser.role !== requiredRole)) {
    console.log('Role check failed:', {
      requiredRole,
      userRole: currentUser?.role,
      redirecting: true
    });
    return <Navigate to="/admin/login" replace />;
  }

  console.log('Access granted to protected route');
  return <Outlet />;
};

export default ProtectedRoute;
