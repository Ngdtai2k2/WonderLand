import React from 'react';

import { BaseApi } from '../../constants/constant';
import RenderPostInTab from './renderPostInTab';

export default function ReactionTab() {
  return <RenderPostInTab apiLink={`${BaseApi}/reaction/post`} />;
}
