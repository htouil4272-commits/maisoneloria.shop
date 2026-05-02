'use client';

import { useEffect } from 'react';

export default function SnapchatPixel() {
  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_SC_PIXEL_ID;
    if (!pixelId) return;

    const timer = setTimeout(() => {
      /* Snapchat Pixel base code - loads after 2.5s for performance */
      const script = document.createElement('script');
      script.innerHTML = `
        (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
        {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
        a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
        r.src=n;var u=t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r,u);})(window,document,
        'https://sc-static.net/scevent.min.js');
        snaptr('init', '${pixelId}', {});
        snaptr('track', 'PAGE_VIEW');
      `;
      document.head.appendChild(script);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
