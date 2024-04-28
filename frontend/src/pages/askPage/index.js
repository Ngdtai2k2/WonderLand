import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import { BaseApi } from '../../constants/constant';

export default function AskPage() {
  useEffect(() => {
    document.title = 'Ask - WonderLand';
  });
  // with 3 - query ask posts
  return <RenderPost apiLink={`${BaseApi}/post/3`} type={1} />;
}
