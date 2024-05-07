import React, { useState } from 'react';

export default function ReadMore({ children, maxLength }) {
  const [isReadMore, setIsReadMore] = useState(children.length > maxLength);

  const text = children;
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <>
      {isReadMore ? text.slice(0, maxLength) : text}
      {text.length > maxLength && (
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
