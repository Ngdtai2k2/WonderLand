import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import GridColumnLayout from '../../components/GridColumnLayout';

import { BaseApi } from '../../constants/constant';

export default function AskPage() {
  useEffect(() => {
    document.title = 'Ask - WonderLand';
  });
  // with 3 - query ask posts
  return (
    <GridColumnLayout>
      <RenderPost apiLink={`${BaseApi}/post/3?_order=desc&`} type={1} />
    </GridColumnLayout>
  );
}
