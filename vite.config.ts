import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Custom plugin to update LCP image path and optimize CSS loading
// Note: Modulepreload is handled automatically by Vite - do not add manual preloads
function criticalChunksPreload(): Plugin {
  return {
    name: 'critical-chunks-preload',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      // Only apply in production build
      if (!ctx.bundle) return html;
      
      // Find LCP image and main CSS from the bundle
      let profileImagePath = '';
      let mainCssPath = '';
      
      for (const [fileName] of Object.entries(ctx.bundle)) {
        // Find the profile image (LCP element)
        if (fileName.includes('profile-384w') && fileName.endsWith('.webp')) {
          profileImagePath = fileName;
        }
        // Find the main CSS file
        else if (fileName.startsWith('assets/index-') && fileName.endsWith('.css')) {
          mainCssPath = fileName;
        }
      }
      
      // Replace the placeholder preload with the actual hashed image path
      if (profileImagePath) {
        html = html.replace(
          /(<link rel="preload" as="image" type="image\/webp" href=")\/src\/assets\/images\/profile-384w\.webp(" fetchpriority="high">)/,
          `$1/${profileImagePath}$2`
        );
      }
      
      // Make CSS non-render-blocking by using media="print" with onload swap
      // This allows the page to render with critical inline CSS first
      if (mainCssPath) {
        html = html.replace(
          new RegExp(`<link rel="stylesheet"[^>]*href="/${mainCssPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`),
          `<link rel="stylesheet" href="/${mainCssPath}" media="print" onload="this.media='all'"><noscript><link rel="stylesheet" href="/${mainCssPath}"></noscript>`
        );
      }
      
      return html;
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    criticalChunksPreload(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    exclude: ['@radix-ui/colors'], // Exclude unused package
  },
  build: {
    // Production optimizations
    minify: 'esbuild',
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Optimize chunk naming for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // Core React - smallest possible chunk loaded first
          if (id.includes('react-dom') || id.includes('react/')) {
            return 'vendor-react';
          }
          // Animation library
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          // Radix UI components - used throughout
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          // Phosphor icons - split to separate chunk
          if (id.includes('@phosphor-icons')) {
            return 'vendor-icons';
          }
        }
      }
    },
    // Generate source maps for debugging in production (optional)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'esnext',
    // Enable module preload polyfill for older browsers
    modulePreload: {
      polyfill: true,
    },
  },
});
