import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../userContext';

const AuthGuard = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user.token) {
      navigate('/');
    }
  }, [user.token, navigate]);

  return null;
};

export default AuthGuard;
