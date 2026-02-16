interface Window {
  global: any;
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module 'pdfjs-dist/build/pdf.worker?url' {
  const value: string
  export default value
}
