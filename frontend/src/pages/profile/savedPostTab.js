import React from 'react';

import { API } from '../../api/base';
import RenderPostInTab from './renderPostInTab';

export default function SavedPostTab() {
  return <RenderPostInTab apiLink={API.SAVE_POST.POST} />;
}
