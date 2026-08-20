import React, { useState, useMemo } from 'react';
import { CommercialAd } from '../types';
import {
  X,
  Sparkles,
  Tag,
  MapPin,
  MessageCircle,
  Car,
  Search,
  Check,
  Phone,
  Store,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface OfficialPartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  ads: CommercialAd[];
  onSelectPartnerDestination?: (address: string, coordinates?: { lat: number; lng: number }) => void;
  onOpenPartnerSignup?: () => void;
}

type PartnerFilter = 'all' | 'espetinho' | 'sorveteria' | 'farmacia' | 'hamburgueria' | 'pizzaria' | 'geral';

export const OfficialPartnersModal: React.FC<OfficialPartnersModalProps> = ({
  isOpen,
  onClose,
  ads = [],
  onSelectPartnerDestination,
  onOpenPartnerSignup,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<PartnerFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);

  const activePartners = useMemo(() => {
    return ads.filter((ad) => ad.isActive);
  }, [ads]);

  const filteredPartners = useMemo(() => {
    return activePartners.filter((ad) => {
      // Category match
      const matchesCategory =
        selectedFilter === 'all' ||
        ad.categoryTag === selectedFilter ||
        ad.segment.toLowerCase().includes(selectedFilter.toLowerCase());

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ad.partnerName.toLowerCase().includes(q) ||
        ad.title.toLowerCase().includes(q) ||
        ad.description.toLowerCase().includes(q) ||
        (ad.address && ad.address.toLowerCase().includes(q)) ||
        ad.segment.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [activePartners, selectedFilter, searchQuery]);

  if (!isOpen) return null;

  const handleCopyCoupon = (coupon: string, adId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(coupon);
    setCopiedCouponId(adId);
    setTimeout(() => setCopiedCouponId(null), 2500);
  };

  const handleGoWithWDrive = (ad: CommercialAd) => {
    if (ad.address && onSelectPartnerDestination) {
      onSelectPartnerDestination(ad.address, ad.coordinates);
      onClose();
    }
  };

  const handleOpenWhatsApp = (ad: CommercialAd, e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = ad.phoneWhatsApp?.replace(/\D/g, '') || '5583999999999';
    const message = encodeURIComponent(
      `Olá ${ad.partnerName}! Vi o anúncio oficial no app W Drive e gostaria de fazer um pedido utilizando o cupom de desconto ${ad.discountCoupon || 'W-DRIVER'}.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const categoriesList: Array<{ id: PartnerFilter; label: string; icon: string }> = [
    { id: 'all', label: 'Todos', icon: '🌟' },
    { id: 'espetinho', label: 'Espetinho & Carnes', icon: '🍢' },
    { id: 'sorveteria', label: 'Sorvetes & Açaí', icon: '🍦' },
    { id: 'farmacia', label: 'Farmácias 24h', icon: '💊' },
    { id: 'hamburgueria', label: 'Burgers & Lanches', icon: '🍔' },
    { id: 'pizzaria', label: 'Pizzarias', icon: '🍕' },
    { id: 'geral', label: 'Serviços & Peças', icon: '🔧' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e1116] border border-zinc-800 rounded-3xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/80 bg-gradient-to-r from-[#12161d] to-[#0e1116] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#A8E63A]/20 border border-[#A8E63A]/50 flex items-center justify-center text-[#A8E63A]">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black uppercase text-white tracking-wide">
                  Parceiros Oficiais
                </h2>
                <span className="px-1.5 py-0.2 rounded-full bg-[#A8E63A] text-black text-[9px] font-black">
                  VIP
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Descontos exclusivos e corridas rápidas até os locais
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-zinc-800/50 bg-[#0a0c10]">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar espetinho, sorvete, farmácia, lanche..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#A8E63A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 no-scrollbar text-xs">
            {categoriesList.map((cat) => {
              const isSelected = selectedFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-[11px] font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#A8E63A] text-black border-[#A8E63A] shadow-[0_0_15px_rgba(168,230,58,0.3)]'
                      : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Partners List Container */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
          {filteredPartners.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Store className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-zinc-300">Nenhum parceiro encontrado</p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Tente buscar com outros termos ou selecione outra categoria acima.
              </p>
            </div>
          ) : (
            filteredPartners.map((ad) => (
              <div
                key={ad.id}
                className="rounded-2xl bg-[#13171e] border border-zinc-800 overflow-hidden shadow-lg hover:border-[#A8E63A]/50 transition-all duration-300 group flex flex-col"
              >
                {/* Banner Image with Header Overlay */}
                <div className="relative h-28 w-full overflow-hidden">
                  <img
                    src={ad.bannerUrl}
                    alt={ad.partnerName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter saturate-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13171e] via-[#13171e]/40 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-[#A8E63A]/40 text-[#A8E63A] text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Parceiro Credenciado
                    </span>

                    {ad.rating && (
                      <span className="px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-md border border-yellow-500/40 text-yellow-400 text-[10px] font-black flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {ad.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Partner Details Body */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-black text-white group-hover:text-[#A8E63A] transition">
                        {ad.partnerName}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-semibold truncate">
                        {ad.segment}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                      {ad.description}
                    </p>

                    {ad.address && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-[#A8E63A] shrink-0" />
                        <span className="truncate">{ad.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Coupon & Action Strip */}
                  <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                    {ad.discountCoupon && (
                      <div className="flex items-center justify-between p-2 rounded-xl bg-black/50 border border-dashed border-[#A8E63A]/40">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#A8E63A]" />
                          <span className="text-[11px] font-mono font-black text-[#A8E63A]">
                            {ad.discountCoupon}
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleCopyCoupon(ad.discountCoupon!, ad.id, e)}
                          className="px-2.5 py-1 rounded-lg bg-[#A8E63A] text-black text-[10px] font-black hover:bg-[#95d130] transition active:scale-95 flex items-center gap-1"
                        >
                          {copiedCouponId === ad.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>COPIADO!</span>
                            </>
                          ) : (
                            <span>COPIAR CUPOM</span>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Dual Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleGoWithWDrive(ad)}
                        className="py-2.5 px-2 rounded-xl bg-[#A8E63A] text-black text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#95d130] transition active:scale-95 shadow-md"
                        title="Ir com motorista oficial W Drive"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span className="truncate">Ir com W Drive</span>
                      </button>

                      <button
                        onClick={(e) => handleOpenWhatsApp(ad, e)}
                        className="py-2.5 px-2 rounded-xl bg-[#1e2a1b] border border-emerald-500/40 text-emerald-400 text-xs font-black flex items-center justify-center gap-1.5 hover:bg-[#253621] transition active:scale-95"
                        title="Pedir direto no WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="truncate">Pedir no Whats</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Become a Partner Callout Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-xs font-black text-white flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-[#A8E63A]" />
                Tem um comércio local?
              </p>
              <p className="text-[11px] text-zinc-400">
                Divulgue seu negócio para milhares de passageiros W Drive
              </p>
            </div>

            {onOpenPartnerSignup && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPartnerSignup();
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-xs font-bold text-white hover:border-[#A8E63A] hover:text-[#A8E63A] transition whitespace-nowrap"
              >
                Cadastrar
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/90 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8E63A]" />
            <span>Todos os estabelecimentos são parceiros oficiais verificados W Drive</span>
          </p>
        </div>
      </div>
    </div>
  );
};
