import React from 'react';

import { BaseApi } from '../../constants/constant';
import RenderPostInTab from './renderPostInTab';

export default function PostTab() {
  return <RenderPostInTab apiLink={`${BaseApi}/user/post`} />;
}
