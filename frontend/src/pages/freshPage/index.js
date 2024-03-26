import React, { useEffect } from 'react';
import ButtonBar from '../../components/ButtonBar';

export default function FreshPage() {
  useEffect(() => {
    document.title = 'New and fresh posts';
  }, []);
  return (
    <>
      <ButtonBar />
      <div>Fresh</div>
    </>
  );
}
