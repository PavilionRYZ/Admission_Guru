import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../redux/slices/profileSlice';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { data, loading, onboardingComplete, currentStage } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    if (!data && !loading) {
      dispatch(fetchProfile());
    }
  }, [dispatch, data, loading]);

  return { profile: data, loading, onboardingComplete, currentStage };
};
