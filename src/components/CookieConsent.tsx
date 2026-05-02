"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show after 2 seconds so it doesn't compete with the intro
      const timer = setTimeout(() => setShow(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
    // Load tracking scripts
    loadTrackingScripts();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[45] bg-white rounded-2xl shadow-2xl border border-gray-lighter p-6"
        >
          <button
            onClick={handleDecline}
            className="absolute top-4 right-4 text-gray-light hover:text-dark transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <p className="text-navy font-semibold text-sm mb-2">
            Your Privacy Matters
          </p>
          <p className="text-gray text-[13px] leading-relaxed mb-4 pr-6">
            We use cookies and analytics to understand how you use our site and improve your experience.
            Your data is never sold or shared with third parties.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-navy hover:bg-navy-light text-white font-semibold py-2.5 px-5 rounded-full text-sm transition-colors cursor-pointer"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 border border-gray-lighter hover:border-navy/20 text-gray hover:text-navy font-semibold py-2.5 px-5 rounded-full text-sm transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Load tracking scripts only after consent
function loadTrackingScripts() {
  // Google Tag Manager
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (gtmId) {
    const script = document.createElement("script");
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `;
    document.head.appendChild(script);
  }

  // Microsoft Clarity
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (clarityId) {
    const script = document.createElement("script");
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window,document,"clarity","script","${clarityId}");
    `;
    document.head.appendChild(script);
  }

  // Facebook Pixel
  const fbPixel = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  if (fbPixel) {
    const script = document.createElement("script");
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${fbPixel}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }
}
