export function ShortenContent(content, maxLength) {
  if (content.length <= maxLength) {
    return content;
  } else {
    const shortContent = '...' + content.slice(-(maxLength - 3));
    return shortContent;
  }
}
