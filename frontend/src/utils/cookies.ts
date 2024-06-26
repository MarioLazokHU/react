export const getCookie = (name: string) => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";").map((cookie) => cookie.trim());
  const foundCookie = cookies.find((cookie) => cookie.startsWith(name + "="));

  if (foundCookie && foundCookie !== "undefined") {
    const value = foundCookie.split("=")[1];
    const decodedValue = decodeURIComponent(value);
    return JSON.parse(decodedValue);
  }

  return null;
};

export const setCookie = (name: string, value: any = "", days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const cookieValue =
    encodeURIComponent(JSON.stringify(value)) +
    "; path=/; expires=" +
    expires.toUTCString();
  if (cookieValue) {
    document.cookie = name + "=" + cookieValue;
  }
};
