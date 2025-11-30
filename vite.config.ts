import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Custom plugin to add high-priority preload hints for critical chunks
function criticalChunksPreload(): Plugin {
  return {
    name: 'critical-chunks-preload',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      // Only apply in production build
      if (!ctx.bundle) return html;
      
      // Find critical chunk filenames from the bundle
      const criticalChunks: string[] = [];
      let cssFileName = '';
      
      for (const [fileName] of Object.entries(ctx.bundle)) {
        // Prioritize vendor-react (needed for everything)
        if (fileName.includes('vendor-react')) {
          criticalChunks.unshift(fileName);
        }
        // Then vendor-motion (used in hero animations)
        else if (fileName.includes('vendor-motion')) {
          criticalChunks.push(fileName);
        }
        // Find the main CSS file
        else if (fileName.endsWith('.css') && fileName.includes('index')) {
          cssFileName = fileName;
        }
      }
      
      // Generate preload link tags with high priority
      const preloadTags = criticalChunks
        .map(chunk => `<link rel="modulepreload" href="/${chunk}" fetchpriority="high" />`)
        .join('\n    ');
      
      // Insert after the opening head tag
      let result = html.replace(
        '<head>',
        `<head>\n    <!-- Critical JS chunks preload -->\n    ${preloadTags}`
      );
      
      // Make CSS non-blocking by using media="print" trick
      if (cssFileName) {
        // Replace the blocking CSS link with async loading pattern
        result = result.replace(
          new RegExp(`<link rel="stylesheet"[^>]*href="/${cssFileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`),
          `<link rel="preload" href="/${cssFileName}" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/${cssFileName}"></noscript>`
        );
      }
      
      return result;
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
