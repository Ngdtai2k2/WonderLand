import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import { BaseApi } from '../../constants/constant';

export default function FreshPage() {
  useEffect(() => {
    document.title = 'New and fresh posts';
  }, []);
  // with 2 - query fresh posts
  return (
    <RenderPost
      apiLink={`${BaseApi}/post/2?_order=desc&`}
      type={0}
      isHiddenButtonBar={false}
    />
  );
}
