import React from 'react';

import { API } from '../../api/base';
import RenderPostInTab from './renderPostInTab';

export default function PostTab() {
  return <RenderPostInTab apiLink={API.USER.POST} />;
}
