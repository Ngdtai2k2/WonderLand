import React, { useState } from 'react';

export default function ReadMore({ children }) {
  const [isReadMore, setIsReadMore] = useState(true);
  const text = children;
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <>
      {isReadMore ? text.slice(0, 50) : text}
      <span
        onClick={toggleReadMore}
        style={{ cursor: 'pointer', fontStyle: 'italic' }}
      >
        {isReadMore ? ' ...read more' : ' show less'}
      </span>
    </>
  );
}
