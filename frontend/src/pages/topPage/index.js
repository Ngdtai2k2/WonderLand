import React, { useEffect } from 'react';

import ButtonBar from '../../components/ButtonBar';

export default function TopPage() {
  useEffect(() => {
    document.title = 'Best posts of week';
  }, []);
  return (
    <>
      <ButtonBar />
      <div>top</div>
    </>
  );
}
