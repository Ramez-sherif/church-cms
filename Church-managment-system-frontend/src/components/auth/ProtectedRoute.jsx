import { Navigate, Outlet } from 'react-router-dom';

import useAuthStore from '../../store/useAuthStore';

const ProtectedRoute = ({
  allowedRoles = [],
  allowedServiceRoles = []
}) => {

  const {
    isAuthenticated,
    user
  } = useAuthStore();

  // =========================
  // Not Logged In
  // =========================
  if (!isAuthenticated) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =========================
  // User Role Check
  // =========================
  const hasRoleAccess =

    allowedRoles.length === 0

    ||

    allowedRoles.includes(
      user?.role
    );

  // =========================
  // Service Role Check
  // =========================
  const hasServiceRoleAccess =

    allowedServiceRoles.length === 0

    ||

    allowedServiceRoles.includes(
      user?.serviceRole
    );

  // =========================
  // Access Denied
  // =========================
  if (
    !hasRoleAccess
    ||
    !hasServiceRoleAccess
  ) {

    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // =========================
  // Allowed
  // =========================
  return <Outlet />;
};

export default ProtectedRoute;