import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import GridColumnLayout from '../../components/GridColumnLayout';

import { API } from '../../api';

export default function FreshPage() {
  useEffect(() => {
    document.title = 'New and fresh posts';
  }, []);
  // with 2 - query fresh posts
  return (
    <GridColumnLayout>
      <RenderPost apiLink={API.POST.GET(2, 'desc')} type={0} />
    </GridColumnLayout>
  );
}
