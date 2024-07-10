import { toast } from 'react-toastify';
import moment from 'moment';

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
          <Link
            href={`/u/${username}`}
            underline="hover"
            fontSize={13.5}
            marginRight={0.5}
            aria-label={`Link to ${username}'s profile`}
          >
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

export async function copyText(text, toastTheme, t) {
  await navigator.clipboard.writeText(text);
  toast.success(t('post:share.copy_success'), toastTheme);
}

export async function setMomentLocale(locale) {
  if (!moment.locales().includes(locale)) {
    await import(`moment/locale/${locale}`);
  }
  moment.locale(locale);
}

export function getQueryString(query) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(query);
}

export function getStatusMessage(status, type) {
  if (status === 1) return 'Success';
  if (status === 2) return type === 1 ? 'Cancel' : 'Failed';
  return 'Pending';
}

export function handleChangeTypeTransactions(event, setType, navigate) {
  setType(Number(event.target.value));
  navigate(`?type=${event.target.value}`, {
    replace: true,
  });
}
