
"use client";

import Image from 'next/image';
import React from 'react';

const placeholderLogos = Array.from({ length: 10 }, (_, i) => ({
  id: `logo-${i + 1}`,
  src: `https://placehold.co/120x50/E5E7EB/A0AEC0.png?text=Brand+${i + 1}`,
  alt: `Brand ${i + 1} Logo`,
  aiHint: 'brand logo abstract'
}));

export default function LogoMarquee() {
  // Duplicate logos for seamless scrolling effect
  const logosToRender = [...placeholderLogos, ...placeholderLogos];

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {logosToRender.map((logo, index) => (
          <div key={`${logo.id}-${index}`} className="marquee-item py-2">
            <Image
              src={`https://placehold.co/120x50.png`} // Simpler placeholder for consistent look
              alt={logo.alt}
              width={120}
              height={50}
              className="object-contain"
              data-ai-hint={logo.aiHint}
              unoptimized // Recommended for frequently changing or numerous decorative images
            />
          </div>
        ))}
      </div>
    </div>
  );
}
