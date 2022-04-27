export const useIsUrl = (url: any) => {
  if (url) {
    try {
      url = new URL(url);
      return true;
    } catch {
      return false;
    }
  }
};
