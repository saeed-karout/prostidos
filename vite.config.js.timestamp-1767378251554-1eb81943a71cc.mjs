// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/karout/Desktop/pateau/pateau/prostidos/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/karout/Desktop/pateau/pateau/prostidos/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///C:/Users/karout/Desktop/pateau/pateau/prostidos/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/Users/karout/Desktop/pateau/pateau/prostidos/vite.config.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxrYXJvdXRcXFxcRGVza3RvcFxcXFxwYXRlYXVcXFxccGF0ZWF1XFxcXHByb3N0aWRvc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxca2Fyb3V0XFxcXERlc2t0b3BcXFxccGF0ZWF1XFxcXHBhdGVhdVxcXFxwcm9zdGlkb3NcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2thcm91dC9EZXNrdG9wL3BhdGVhdS9wYXRlYXUvcHJvc3RpZG9zL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHZ1ZUpzeCgpLFxyXG4gICAgXHJcbiAgXSxcclxuICBvcHRpbWl6ZURlcHM6IHtcclxuICAgIGluY2x1ZGU6IFsnZG9tcHVyaWZ5JywgJ3RydW5jYXRlLWh0bWwnXSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuXHJcblxyXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyNTAwLFxyXG5cclxuXHJcbiAgfVxyXG59XHJcbilcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VSxTQUFTLGVBQWUsV0FBVztBQUVoWCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBSmdNLElBQU0sMkNBQTJDO0FBT3BRLElBQU8sc0JBQVE7QUFBQSxFQUFhO0FBQUEsSUFDMUIsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBLElBRVQ7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFNBQVMsQ0FBQyxhQUFhLGVBQWU7QUFBQSxJQUN4QztBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUdMLHVCQUF1QjtBQUFBLElBR3pCO0FBQUEsRUFDRjtBQUNBOyIsCiAgIm5hbWVzIjogW10KfQo=
