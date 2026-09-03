import type React from 'react';

// Utility providing robust fallback images and handlers for all craft products, partners and avatars

// Clean SVG Fallback for Product Images with botanical/craft motif
export const FALLBACK_PRODUCT_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none"><rect width="400" height="400" fill="%23f3eee4"/><circle cx="200" cy="180" r="70" fill="%23e4dac9"/><path d="M160 210c15-30 65-30 80 0M200 130v50M180 155l40 0" stroke="%23bd5b3e" stroke-width="6" stroke-linecap="round"/><text x="200" y="290" text-anchor="middle" fill="%231e352e" font-family="sans-serif" font-size="16" font-weight="600">Pinta e Borda</text><text x="200" y="315" text-anchor="middle" fill="%237a9186" font-family="sans-serif" font-size="12">Peça Autoral Maranhense</text></svg>';

// Clean SVG Fallback for Brand / Maker Avatar
export const FALLBACK_AVATAR_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150" fill="none"><rect width="150" height="150" fill="%231c3830"/><circle cx="75" cy="65" r="30" fill="%23e0be75"/><circle cx="75" cy="130" r="45" fill="%23e0be75"/><text x="75" y="70" text-anchor="middle" fill="%231c3830" font-family="serif" font-size="20" font-weight="bold">pb</text></svg>';

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = FALLBACK_PRODUCT_IMAGE
) => {
  const target = e.currentTarget;
  if (target.src !== fallback) {
    target.onerror = null; // Prevent infinite error loop if fallback fails
    target.src = fallback;
  }
};
