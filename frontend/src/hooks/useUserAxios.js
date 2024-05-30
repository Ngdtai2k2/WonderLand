import { useDispatch, useSelector } from 'react-redux';

import { createAxios } from '../createInstance';

const useUserAxios = (lng) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;

  const axiosJWT = user ? createAxios(lng, user, dispatch) : undefined;

  return { user, accessToken, axiosJWT };
};

export default useUserAxios;
