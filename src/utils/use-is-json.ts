export const useIsJson = (element: string) => {
  if (element) {
    try {
      debugger;
      element = JSON.parse(element);
    } catch (e) {
      return false;
    }
    return true;
  }
};
