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
