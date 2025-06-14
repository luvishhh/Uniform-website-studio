
"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Logo from '@/components/shared/Logo';
import React, { useState, useEffect, useCallback } from 'react';

const DONATION_FEATURE_LS_KEY = "unishop_donation_feature_enabled";

const baseFooterLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/faq', label: 'FAQ' },
];

const socialLinks = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
];

export default function Footer() {
  const [isDonationFeatureEnabled, setIsDonationFeatureEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const checkDonationFeatureState = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(DONATION_FEATURE_LS_KEY);
      setIsDonationFeatureEnabled(storedValue === null ? true : storedValue === "true");
    }
  }, []);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      checkDonationFeatureState();
      window.addEventListener('storage', (event) => {
        if (event.key === DONATION_FEATURE_LS_KEY) {
          checkDonationFeatureState();
        }
      });
    }
    return () => {
      if (isClient && typeof window !== "undefined") {
         window.removeEventListener('storage', checkDonationFeatureState);
      }
    };
  }, [isClient, checkDonationFeatureState]);

  const getFooterLinks = () => {
    let links = [...baseFooterLinks];
    // Note: FAQ link is already in baseFooterLinks, so no need to add conditionally for donation here specifically
    // But other donation-specific links could be added if needed.
    return links;
  };
  
  const getShopLinks = () => {
    let links = [
      { href: "/products", label: "School & College Uniforms" },
    ];
    if (isDonationFeatureEnabled) {
      links.push({ href: "/donate", label: "Donate Uniforms" });
    }
    return links;
  };

  if (!isClient) {
    // Optional: Render a basic footer or null during SSR / pre-hydration
    return (
      <footer className="bg-muted text-muted-foreground border-t">
        <div className="container mx-auto px-4 md:px-6 py-12 text-center">
          <p>&copy; {new Date().getFullYear()} UniShop. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-muted text-muted-foreground border-t">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div className="md:col-span-3 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm">
              Your one-stop shop for quality uniforms. Committed to providing a seamless and secure shopping experience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-headline text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {getFooterLinks().map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold font-headline text-foreground mb-4">Shop</h3>
            <ul className="space-y-2">
              {getShopLinks().map(link => (
                 <li key={link.href}><Link href={link.href} className="text-sm hover:text-primary transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold font-headline text-foreground mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="hover:text-primary transition-colors">
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm">
              Stay updated with our latest collections and offers.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} UniShop. All rights reserved.</p>
          <p className="mt-1">Designed with care for the UniShop community.</p>
        </div>
      </div>
    </footer>
  );
}
