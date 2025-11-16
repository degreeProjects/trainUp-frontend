export const gatherCookie = (cookieName: string) => {
  const match = document.cookie.match(
    new RegExp("(^| )" + cookieName + "=([^;]+)")
  );

  if (match && match.length >= 2) {
    return match[2];
  }

  return null;
};
