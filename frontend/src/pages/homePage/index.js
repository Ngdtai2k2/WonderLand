import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import { BaseApi } from '../../constants/constant';

export default function HomePage() {
  useEffect(() => {
    document.title = 'WonderLand';
  }, []);
  return <RenderPost apiLink={`${BaseApi}/post`} />;
}
