export const useIsJson = (element: string) => {
  try {
    debugger;
    element = JSON.parse(element);
  } catch (e) {
    return false;
  }
  return true;
};
