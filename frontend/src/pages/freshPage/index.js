import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import GridColumnLayout from '../../components/GridColumnLayout';

import { BaseApi } from '../../constants/constant';

export default function FreshPage() {
  useEffect(() => {
    document.title = 'New and fresh posts';
  }, []);
  // with 2 - query fresh posts
  return (
    <GridColumnLayout>
      <RenderPost
        apiLink={`${BaseApi}/post/2?_order=desc&`}
        type={0}
        isHiddenButtonBar={false}
      />
    </GridColumnLayout>
  );
}
