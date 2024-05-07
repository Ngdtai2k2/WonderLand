import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import { BaseApi } from '../../constants/constant';

export default function HomePage() {
  useEffect(() => {
    document.title = 'WonderLand';
  }, []);
  // with 4 - query normal
  return (
    <RenderPost
      apiLink={`${BaseApi}/post/4?_order=desc&`}
      type={0}
      isHiddenButtonBar={false}
    />
  );
}
