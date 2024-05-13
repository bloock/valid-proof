import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "node-fetch": "isomorphic-fetch",
    },
  },
  optimizeDeps: {
    include: ["@bloock/sdk > protobufjs/minimal"],
    exclude: ["@bloock/sdk"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
});

// import colors from "picocolors";
// import debug from "debug";

// const log = debug("vite:wasm-pack");

// export function wasmPackPlugin(packages: string[]): Plugin {
//   return {
//     name: "vite-plugin-wasm-pack",
//     enforce: "pre",

//     async resolveId(id, importer, options) {
//       log(`wasm-pack resolve pre ${colors.cyan(id)}`);
//       if (id.includes(".wasm")) {
//         log(`wasm-pack resolve wasm file ${colors.cyan(id)}`);
//       }
//       if (packages.filter((p) => id.includes(p)).length == 0) {
//         return null;
//       }

//       log(`wasm-pack resolve package ${colors.cyan(id)}`);
//     },

//     async load(id, options) {
//       if (id.includes("wasm")) {
//         log(`wasm-pack load ${colors.cyan(id)}`);
//       }
//     },
//   };
// }
