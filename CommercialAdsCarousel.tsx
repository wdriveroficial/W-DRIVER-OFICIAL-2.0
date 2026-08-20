import React, { useState, useEffect } from 'react';
import { CommercialAd } from '../types';
import { ExternalLink, Tag, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface CommercialAdsCarouselProps {
  ads: CommercialAd[];
  className?: string;
  onAdClick?: (adId: string) => void;
}

export const CommercialAdsCarousel: React.FC<CommercialAdsCarouselProps> = ({
  ads,
  className = '',
  onAdClick,
}) => {
  const activeAds = ads.filter((a) => a.isActive);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    if (activeAds.length <= 1) return;
    const currentAd = activeAds[currentIndex];
    const duration = (currentAd?.displayDurationSeconds || 6) * 1000;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, activeAds.length]);

  if (activeAds.length === 0) return null;

  const currentAd = activeAds[currentIndex];

  const handleCopyCoupon = (coupon: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(coupon);
    setCopiedCoupon(coupon);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeAds.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111316] via-[#161a1f] to-[#111316] border border-[#242830] shadow-xl text-white group ${className}`}
      onClick={() => onAdClick && onAdClick(currentAd.id)}
    >
      {/* Background Banner with Soft Vignette */}
      <div className="relative h-24 sm:h-28 w-full overflow-hidden flex items-center">
        <img
          src={currentAd.bannerUrl}
          alt={currentAd.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover:scale-105 transition-transform duration-700 filter saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/90" />

        {/* Ad Content */}
        <div className="relative z-10 p-3.5 flex items-center justify-between w-full gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="px-1.5 py-0.5 rounded bg-[#A8E63A]/20 border border-[#A8E63A]/40 text-[#A8E63A] text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Parceiro Oficial W-DRIVER
              </span>
              <span className="text-[10px] text-zinc-400 font-medium truncate">
                • {currentAd.segment}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-black text-white truncate group-hover:text-[#A8E63A] transition">
              {currentAd.title}
            </h4>
            <p className="text-[11px] text-zinc-300 line-clamp-1 mt-0.5 font-normal">
              {currentAd.description}
            </p>

            {/* Coupon & Action Tag */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {currentAd.discountCoupon && (
                <button
                  onClick={(e) => handleCopyCoupon(currentAd.discountCoupon!, e)}
                  className="px-2 py-0.5 rounded-lg bg-[#A8E63A] text-black text-[10px] font-black tracking-wider flex items-center gap-1 hover:bg-[#95d130] transition shadow-md"
                >
                  <Tag className="w-3 h-3" />
                  <span>{copiedCoupon ? 'CUPOM COPIADO!' : `CUPOM: ${currentAd.discountCoupon}`}</span>
                </button>
              )}
              <span className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1 hover:text-white">
                <span>{currentAd.actionText}</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#A8E63A]" />
              </span>
            </div>
          </div>

          {/* Partner Brand Emblem */}
          <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-xl bg-black/80 border border-zinc-700/80 p-1 text-center shadow-lg">
            <span className="text-[9px] font-bold text-[#A8E63A] uppercase leading-tight line-clamp-2">
              {currentAd.partnerName}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls & Indicators */}
      {activeAds.length > 1 && (
        <div className="absolute bottom-1.5 right-2 z-20 flex items-center gap-1.5 bg-black/70 px-1.5 py-0.5 rounded-full border border-zinc-800 backdrop-blur-sm">
          <button
            onClick={handlePrev}
            className="text-zinc-400 hover:text-white transition p-0.5"
            title="Anúncio anterior"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1">
            {activeAds.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-[#A8E63A]' : 'w-1.5 bg-zinc-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="text-zinc-400 hover:text-white transition p-0.5"
            title="Próximo anúncio"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
