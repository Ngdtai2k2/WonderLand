import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import { BaseApi } from '../../constants/constant';

export default function AskPage() {
  useEffect(() => {
    document.title = 'Ask - WonderLand';
  })
  return <RenderPost apiLink={`${BaseApi}/post`} type={1} />;
}
