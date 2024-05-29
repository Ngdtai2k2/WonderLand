import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import RenderPost from '../../components/RenderPost';
import GridColumnLayout from '../../components/GridColumnLayout';

import { BaseApi } from '../../constants/constant';

export default function HomePage() {
  const { t } = useTranslation('home');

  useEffect(() => {
    document.title = t('site_name');
  }, [t]);

  // with 4 - query normal

  return (
    <GridColumnLayout>
      <RenderPost apiLink={`${BaseApi}/post/4?_order=desc&`} type={0} />
    </GridColumnLayout>
  );
}
