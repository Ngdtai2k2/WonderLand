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

// function support for open and close menu anchors
export const handleOpenMenu = (
  event,
  id,
  setStatesMenuAnchor,
  setStatesIsMenuOpen,
) => {
  setStatesMenuAnchor((prev) => ({
    ...prev,
    [id]: event.currentTarget,
  }));
  setStatesIsMenuOpen((prev) => ({
    ...prev,
    [id]: true,
  }));
};

export const handleCloseMenu = (
  id,
  setStatesMenuAnchor,
  setStatesIsMenuOpen,
) => {
  setStatesMenuAnchor((prev) => ({
    ...prev,
    [id]: null,
  }));
  setStatesIsMenuOpen((prev) => ({
    ...prev,
    [id]: false,
  }));
};

export function renderContentReply(content) {
  if (content && typeof content === 'string') {
    const atIndex = content.indexOf('@');
    if (atIndex !== -1) {
      const username = content.substring(atIndex + 1).split(' ')[0];
      const beforeUsername = content.substring(0, atIndex);
      const afterUsername = content.substring(atIndex + 1 + username.length);
      return (
        <>
          {beforeUsername}
          <Link href={`/u/${username}`} underline="hover" fontSize={13.5}>
            @{username}
          </Link>
          <ReadMore
            maxLength={100}
            typographyProps={{
              component: 'span',
              variant: 'caption',
              sx: { fontSize: 13.5 },
            }}
          >
            {afterUsername}
          </ReadMore>
        </>
      );
    }
  }
  return content;
}

export function getFileExtension(url) {
  const dotIndex = url.lastIndexOf('.');
  if (dotIndex === -1) return '';
  const extension = url.substring(dotIndex + 1);
  return extension;
}

export function getCurrentDate(separator = '/') {
  const newDate = new Date();
  const date = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();

  return `${date}${separator}${month}${separator}${year}`;
}
