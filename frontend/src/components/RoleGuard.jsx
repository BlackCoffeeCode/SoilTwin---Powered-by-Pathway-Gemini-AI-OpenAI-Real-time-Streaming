import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * RoleGuard Component
 * Conditionally renders children based on user role
 * 
 * Usage:
 * <RoleGuard allowedRoles={['admin']}>
 *   <AdminPanel />
 * </RoleGuard>
 */
const RoleGuard = ({ allowedRoles, children, fallback = null }) => {
    const { user } = useAuth();

    // If no user is logged in, don't render
    if (!user) {
        return fallback;
    }

    // If user role is not in allowed roles, don't render
    if (!allowedRoles.includes(user.role)) {
        return fallback;
    }

    // User has permission, render children
    return <>{children}</>;
};

export default RoleGuard;
