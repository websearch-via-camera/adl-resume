/**
 * Lazy-loaded Lucide icons wrapper
 * 
 * These icons are loaded asynchronously to avoid blocking the critical render path.
 * The icons are used below-the-fold (contact section, footer, projects), so deferring
 * their load improves LCP and FCP metrics.
 * 
 * We import from individual icon files to ensure proper tree-shaking:
 * - Importing from 'lucide-react' barrel export would include the entire library
 * - Importing from 'lucide-react/dist/esm/icons/[icon]' only includes that specific icon
 * 
 * Usage: import { MailIcon, PhoneIcon } from "@/components/icons/LazyIcons"
 */

import { lazy, Suspense, ComponentType } from "preact/compat"
import type { LucideProps } from "lucide-react"

// Create lazy components with individual icon imports for proper tree-shaking
// Each icon is ~500 bytes instead of loading entire 500KB+ library
const MailLazy = lazy(() => import("lucide-react/dist/esm/icons/mail").then(m => ({ default: m.default })))
const PhoneLazy = lazy(() => import("lucide-react/dist/esm/icons/phone").then(m => ({ default: m.default })))
const DownloadLazy = lazy(() => import("lucide-react/dist/esm/icons/download").then(m => ({ default: m.default })))
const GithubLazy = lazy(() => import("lucide-react/dist/esm/icons/github").then(m => ({ default: m.default })))
const LinkedinLazy = lazy(() => import("lucide-react/dist/esm/icons/linkedin").then(m => ({ default: m.default })))
const ArrowUpRightLazy = lazy(() => import("lucide-react/dist/esm/icons/arrow-up-right").then(m => ({ default: m.default })))
const SendLazy = lazy(() => import("lucide-react/dist/esm/icons/send").then(m => ({ default: m.default })))
const LinkLazy = lazy(() => import("lucide-react/dist/esm/icons/link").then(m => ({ default: m.default })))
const CalendarLazy = lazy(() => import("lucide-react/dist/esm/icons/calendar").then(m => ({ default: m.default })))
const BotLazy = lazy(() => import("lucide-react/dist/esm/icons/bot").then(m => ({ default: m.default })))
const CopyLazy = lazy(() => import("lucide-react/dist/esm/icons/copy").then(m => ({ default: m.default })))
const CheckLazy = lazy(() => import("lucide-react/dist/esm/icons/check").then(m => ({ default: m.default })))
const ChevronLeftLazy = lazy(() => import("lucide-react/dist/esm/icons/chevron-left").then(m => ({ default: m.default })))
const ChevronRightLazy = lazy(() => import("lucide-react/dist/esm/icons/chevron-right").then(m => ({ default: m.default })))

// Wrapper component that adds Suspense with empty fallback
function withSuspense(LazyComponent: ComponentType<LucideProps>): ComponentType<LucideProps> {
  return function SuspenseIcon(props: LucideProps) {
    return (
      <Suspense fallback={<span className={props.className as string} style={{ display: 'inline-block' }} />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Export lazy-wrapped versions of all icons used in App.tsx
export const MailIcon = withSuspense(MailLazy)
export const PhoneIcon = withSuspense(PhoneLazy)
export const DownloadIcon = withSuspense(DownloadLazy)
export const GithubIcon = withSuspense(GithubLazy)
export const LinkedinIcon = withSuspense(LinkedinLazy)
export const ArrowUpRightIcon = withSuspense(ArrowUpRightLazy)
export const SendIcon = withSuspense(SendLazy)
export const LinkIcon = withSuspense(LinkLazy)
export const CalendarIcon = withSuspense(CalendarLazy)
export const BotIcon = withSuspense(BotLazy)
export const CopyIcon = withSuspense(CopyLazy)
export const CheckIcon = withSuspense(CheckLazy)
export const ChevronLeftIcon = withSuspense(ChevronLeftLazy)
export const ChevronRightIcon = withSuspense(ChevronRightLazy)
