/**
 * Retrieves the value of a specific cookie by name from the browser's cookie store.
 * Returns the cookie value if found, or null if the cookie does not exist.
 */
export const gatherCookie = (cookieName: string) => {
  const match = document.cookie.match(
    new RegExp("(^| )" + cookieName + "=([^;]+)")
  );

  if (match && match.length >= 2) {
    return match[2];
  }

  return null;
};
