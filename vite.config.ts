import tailwindcss from "@tailwindcss/vite";
import preact from "@preact/preset-vite";
import { defineConfig, type Plugin } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Custom plugin to update LCP image path, optimize CSS loading, and add modulepreload hints
// This reduces critical path latency by preloading essential chunks early in <head>
function criticalChunksPreload(): Plugin {
  return {
    name: 'critical-chunks-preload',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      // Only apply in production build
      if (!ctx.bundle) return html;
      
      // Find LCP image, main CSS, and critical JS chunks from the bundle
      let profileImagePath = '';
      let mainCssPath = '';
      let vendorPreactPath = '';
      let vendorIconsPath = '';
      let vendorRadixPath = '';
      let mainJsPath = '';
      
      for (const [fileName] of Object.entries(ctx.bundle)) {
        // Find the profile image (LCP element)
        if (fileName.includes('profile-384w') && fileName.endsWith('.webp')) {
          profileImagePath = fileName;
        }
        // Find the main CSS file
        else if (fileName.startsWith('assets/index-') && fileName.endsWith('.css')) {
          mainCssPath = fileName;
        }
        // Find vendor-preact chunk (critical for Preact hydration)
        else if (fileName.includes('vendor-preact') && fileName.endsWith('.js')) {
          vendorPreactPath = fileName;
        }
        // Find vendor-icons chunk (lucide icons - used in hero)
        else if (fileName.includes('vendor-icons') && fileName.endsWith('.js')) {
          vendorIconsPath = fileName;
        }
        // Find vendor-radix chunk (UI components)
        else if (fileName.includes('vendor-radix') && fileName.endsWith('.js')) {
          vendorRadixPath = fileName;
        }
        // Find the main entry JS file
        else if (fileName.startsWith('assets/index-') && fileName.endsWith('.js')) {
          mainJsPath = fileName;
        }
      }
      
      // Replace the placeholder preload with the actual hashed image path
      if (profileImagePath) {
        html = html.replace(
          /(<link rel="preload" as="image" type="image\/webp" href=")\/src\/assets\/images\/profile-384w\.webp(" fetchpriority="high">)/,
          `$1/${profileImagePath}$2`
        );
      }
      
      // Add early modulepreload hints in <head> for critical JS chunks
      // These are placed early in <head> so the browser starts fetching them sooner
      // Load ALL critical chunks in parallel to reduce chain latency
      const earlyPreloads: string[] = [];
      
      if (vendorPreactPath) {
        // Preact vendor chunk is highest priority - needed for any Preact rendering
        earlyPreloads.push(`<link rel="modulepreload" href="/${vendorPreactPath}" crossorigin fetchpriority="high">`);
      }
      
      if (mainJsPath) {
        // Main entry chunk - preload early
        earlyPreloads.push(`<link rel="modulepreload" href="/${mainJsPath}" crossorigin fetchpriority="high">`);
      }
      
      if (vendorIconsPath) {
        // Icons chunk - needed for hero section icons
        earlyPreloads.push(`<link rel="modulepreload" href="/${vendorIconsPath}" crossorigin>`);
      }
      
      if (vendorRadixPath) {
        // Radix UI chunk - needed for UI components
        earlyPreloads.push(`<link rel="modulepreload" href="/${vendorRadixPath}" crossorigin>`);
      }
      
      // Insert early modulepreload hints in the placeholder location
      if (earlyPreloads.length > 0) {
        const preloadBlock = `    <!-- Early JS modulepreload - reduces critical path latency -->\n    ${earlyPreloads.join('\n    ')}\n`;
        html = html.replace(
          /<!-- Critical JS chunk preloads[^>]*-->\n\s*<!-- modulepreload hints[^>]*-->\n\s*<!-- These will be replaced[^>]*-->\n/,
          preloadBlock
        );
      }
      
      // Remove Vite's auto-generated modulepreload links for chunks we already preloaded
      // This avoids duplicate modulepreload hints in the final HTML
      const chunksToRemove = [vendorPreactPath, mainJsPath, vendorIconsPath, vendorRadixPath].filter(Boolean);
      for (const chunkPath of chunksToRemove) {
        html = html.replace(
          new RegExp(`\\s*<link rel="modulepreload" crossorigin href="/${chunkPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`),
          ''
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
    preact(),
    tailwindcss(),
    criticalChunksPreload(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src'),
      // Preact compat aliases for React compatibility
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react/jsx-runtime': 'preact/jsx-runtime',
    }
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['preact', 'preact/compat', 'preact/hooks'],
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
          // Core Preact - smallest possible chunk loaded first (~4KB vs React's ~40KB)
          if (id.includes('preact')) {
            return 'vendor-preact';
          }
          // Motion library (motion-one is ~3KB vs framer-motion's ~60KB)
          if (id.includes('motion') || id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          // Radix UI components - used throughout
          if (id.includes('@radix-ui')) {
            return 'vendor-radix';
          }
          // Lucide icons - tree-shakeable, only used icons bundled
          if (id.includes('lucide-react')) {
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
