import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const BlockedRoute = ({ children, blocked = false }) => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  if ((blocked && user) || (!blocked && !user)) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

export default BlockedRoute;
