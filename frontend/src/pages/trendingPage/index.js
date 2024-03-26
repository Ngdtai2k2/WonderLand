import React, { useEffect } from 'react';

import ButtonBar from '../../components/ButtonBar';

export default function TrendingPage() {
  useEffect(() => {
    document.title = 'Popular posts right now';
  }, []);
  return (
    <>
      <ButtonBar />
      <div>Trend</div>
    </>
  );
}
