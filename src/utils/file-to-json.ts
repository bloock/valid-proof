export function fileToJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = function () {
      try {
        resolve(JSON.parse(reader.result as string));
      } catch {
        reject();
      }
    };
    reader.onerror = function () {
      reject();
    };
    reader.readAsText(file);
  });
}
