import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
