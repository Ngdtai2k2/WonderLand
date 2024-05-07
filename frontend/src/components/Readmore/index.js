import { Typography } from '@mui/material';
import React, { useState } from 'react';

export default function ReadMore({ children, maxLength, typographyProps }) {
  const [isReadMore, setIsReadMore] = useState(children.length > maxLength);

  const text = children;
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <>
      {isReadMore ? (
        <Typography {...typographyProps}>{text.slice(0, maxLength)}</Typography>
      ) : (
        <Typography {...typographyProps}>{text}</Typography>
      )}
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
