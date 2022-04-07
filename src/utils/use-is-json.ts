export const useIsJson = (element: string) => {
  if (element) {
    try {
      element = JSON.parse(element);
    } catch (e) {
      return false;
    }
    return true;
  }
};
