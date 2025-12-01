import { useEffect, useRef, useState } from "react";

interface UseScrollTransitionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to trigger CSS transition classes when element enters viewport
 * Use with CSS classes: section-transition, slide-in-left, slide-in-right, 
 * scale-in, blur-in, flip-in, mask-reveal-horizontal, mask-reveal-vertical
 */
export function useScrollTransition<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  triggerOnce = true,
}: UseScrollTransitionOptions = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setInView(true);
      element.classList.add("in-view");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            entry.target.classList.add("in-view");
            
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setInView(false);
            entry.target.classList.remove("in-view");
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView };
}

/**
 * Utility function to apply scroll transitions to multiple elements
 * Call this once on mount to observe all elements with transition classes
 */
export function initScrollTransitions(
  selector = ".section-transition, .slide-in-left, .slide-in-right, .scale-in, .blur-in, .flip-in, .mask-reveal-horizontal, .mask-reveal-vertical"
) {
  if (typeof window === "undefined") return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("in-view");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document.querySelectorAll(selector).forEach((el) => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}
