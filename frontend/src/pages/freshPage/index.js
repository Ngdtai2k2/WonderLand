import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import { BaseApi } from '../../constants/constant';

export default function FreshPage() {
  useEffect(() => {
    document.title = 'New and fresh posts';
  }, []);

  return <RenderPost apiLink={`${BaseApi}/post/2`} type={0} />;
}
