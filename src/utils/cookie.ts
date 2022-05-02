import cookie from "js-cookie";

export const setCookie = (key: string, value: any) => {
  cookie.set(key, value, {
    expires: 1,
    path: "/",
  });
};

export const getCookie = (key: string) => {
  if (cookie.get(key) !== undefined) {
    return cookie.get(key);
  } else {
    return "";
  }
};
