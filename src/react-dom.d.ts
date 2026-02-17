/// <reference types="react-dom" />
/// <reference types="react" />

declare module 'react-dom/client' {
  import { Root } from 'react-dom';
  
  export function createRoot(
    container: Element | Document,
    options?: any
  ): Root;
  
  export function hydrateRoot(
    container: Element | Document,
    element: React.ReactElement,
    options?: any
  ): Root;
}