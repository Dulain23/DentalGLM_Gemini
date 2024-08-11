import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Unauthorized from "./Unauthorized";

export default function AuthRoute() {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.currentUser);
    const [roles, setRoles] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRoles = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch('/api/user/roles/' + user._id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setRoles(data.body);
                } else {
                    // Console log error message
                    console.log(data.body);
                    // Remove any token or user details in storage
                    dispatch(logoutSuccess());
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRoles();
    }, []);

    if (user) {
        if (roles === 'student') return <Navigate to="/user/home" />
        if (roles === 'admin') return <Navigate to="/admin/home" />  
        return <Unauthorized/>
    }
    return <Outlet />
}