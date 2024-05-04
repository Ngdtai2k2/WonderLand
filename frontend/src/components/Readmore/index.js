import React, { useState } from 'react';

export default function ReadMore({ children }) {
  const [isReadMore, setIsReadMore] = useState(children.length > 100);

  const text = children;
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <>
      {isReadMore ? text.slice(0, 100) : text}
      {text.length > 100 && (
        <span
          onClick={toggleReadMore}
          style={{ cursor: 'pointer', fontStyle: 'italic' }}
        >
          {isReadMore ? ' ...read more' : ' show less'}
        </span>
      )}
    </>
  );
}
