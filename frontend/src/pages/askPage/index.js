import React, { useEffect } from 'react';

import RenderPost from '../../components/RenderPost';
import GridColumnLayout from '../../components/GridColumnLayout';

import { API } from '../../api';

export default function AskPage() {
  useEffect(() => {
    document.title = 'Ask - WonderLand';
  });
  // with 3 - query ask posts
  return (
    <GridColumnLayout>
      <RenderPost apiLink={API.POST.GET(3, 'desc')} type={1} />
    </GridColumnLayout>
  );
}
