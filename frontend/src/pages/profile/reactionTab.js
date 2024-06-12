import React from 'react';

import { API } from '../../api';
import RenderPostInTab from './renderPostInTab';

export default function ReactionTab() {
  return <RenderPostInTab apiLink={API.REACTION.POST} />;
}
