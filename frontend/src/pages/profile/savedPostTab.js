import React from 'react';

import { BaseApi } from '../../constants/constant';
import RenderPostInTab from './renderPostInTab';

export default function SavedPostTab() {
  return <RenderPostInTab apiLink={`${BaseApi}/save-post/post`} />;
}
