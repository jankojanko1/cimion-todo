"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function RouteTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setShouldAnimate(false);
    };

    window.addEventListener("routeChangeStart", handleRouteChangeStart);

    return () => {
      window.removeEventListener("routeChangeStart", handleRouteChangeStart);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      setShouldAnimate(true);
    }, 750);

    return () => clearTimeout(timeout);
  }, [pathname, children]);

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldAnimate ? 1 : 0 }}
        transition={{
          duration: 0.5,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        {displayChildren}
      </motion.main>
    </AnimatePresence>
  );
}
