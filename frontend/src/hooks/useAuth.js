import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getCurrentUser } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, loading]);

  return { user, isAuthenticated, loading };
};
