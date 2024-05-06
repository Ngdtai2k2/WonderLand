import { Link } from '@mui/material';

import ReadMore from '../components/Readmore';

export function ShortenContent(content, maxLength) {
  if (content.length <= maxLength) {
    return content;
  } else {
    const shortContent = '...' + content.slice(-(maxLength - 3));
    return shortContent;
  }
}

export function convertNumber(number) {
  if (number < 1000) {
    return number.toString();
  } else if (number < 1000000) {
    if (Number.isInteger(number / 1000)) {
      return (number / 1000).toFixed(0) + 'k';
    } else {
      return (number / 1000).toFixed(1) + 'k';
    }
  } else {
    return (number / 1000000).toFixed(1) + 'M';
  }
}

export function changeState(setState) {
  setState((prev) => !prev);
}

export function renderContentReply(content) {
  const atIndex = content.indexOf('@');
  if (atIndex !== -1) {
    const username = content.substring(atIndex + 1).split(' ')[0];
    const beforeUsername = content.substring(0, atIndex);
    const afterUsername = content.substring(atIndex + 1 + username.length);
    return (
      <>
        {beforeUsername}
        <Link href={`/u/${username}`} underline="hover">
          @{username}
        </Link>
        <ReadMore>{afterUsername}</ReadMore>
      </>
    );
  }
  return content;
}
