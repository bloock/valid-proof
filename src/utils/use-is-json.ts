export const useIsJson = (element: any) => {
  if (element) {
    try {
      if (typeof element !== "string") {
        if (element instanceof Uint8Array) {
          return false;
        } else {
          element = JSON.stringify(element);
        }
      }
      element = JSON.parse(element);
    } catch (e) {
      return false;
    }
    return true;
  }
};
