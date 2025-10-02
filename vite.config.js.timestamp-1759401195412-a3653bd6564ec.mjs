// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/karout/Desktop/pateau/pateau/proStdios/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/karout/Desktop/pateau/pateau/proStdios/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/karout/Desktop/pateau/pateau/proStdios/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/karout/Desktop/pateau/pateau/proStdios/vite.config.js";
var vite_config_default = defineConfig(
  {
    plugins: [
      vue(),
      vueJsx()
    ],
    optimizeDeps: {
      include: ["dompurify", "truncate-html"]
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    },
    build: {
      chunkSizeWarningLimit: 2500
    }
  }
);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxrYXJvdXRcXFxcRGVza3RvcFxcXFxwYXRlYXVcXFxccGF0ZWF1XFxcXHByb1N0ZGlvc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxca2Fyb3V0XFxcXERlc2t0b3BcXFxccGF0ZWF1XFxcXHBhdGVhdVxcXFxwcm9TdGRpb3NcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2thcm91dC9EZXNrdG9wL3BhdGVhdS9wYXRlYXUvcHJvU3RkaW9zL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVKc3goKSxcbiAgICBcbiAgXSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydkb21wdXJpZnknLCAndHJ1bmNhdGUtaHRtbCddLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcblxuXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyNTAwLFxuXG5cbiAgfVxufVxuKVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VSxTQUFTLGVBQWUsV0FBVztBQUVoWCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBSmdNLElBQU0sMkNBQTJDO0FBT3BRLElBQU8sc0JBQVE7QUFBQSxFQUFhO0FBQUEsSUFDMUIsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBLElBRVQ7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxhQUFhLGVBQWU7QUFBQSxJQUN4QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUdMLHVCQUF1QjtBQUFBLElBR3pCO0FBQUEsRUFDRjtBQUNBOyIsCiAgIm5hbWVzIjogW10KfQo=
