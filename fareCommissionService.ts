import { CommissionBreakdown, RideModality } from '../types';

/**
 * W-DRIVER OFICIAL 3.0 - Motor de Tarifação, Comissão e Repasse
 * 
 * Regras Oficiais:
 * 1. Tarifa mínima obrigatória: R$ 10,00 (cobre até 1 km de deslocamento).
 * 2. Tabela de Comissão da Central:
 *    - R$ 10,00 a R$ 100,00 -> Comissão Central = R$ 3,00
 *    - R$ 100,01 a R$ 200,00 -> Comissão Central = R$ 7,00
 *    - R$ 200,01 a R$ 300,00 -> Comissão Central = R$ 30,00
 *    - R$ 300,01 a R$ 399,99 -> Comissão Central = R$ 40,00
 *    - R$ 400,00 ou mais -> Comissão Central = R$ 70,00 (Teto Fixo Inviolável)
 * 3. Módulo Cashback/Fidelidade: Reserva de R$ 0,50 para cashback de R$ 5,00 a cada 10 viagens.
 * 4. Módulo Horário de Pico: Janelas (05h-09h, 11h-15h e 16h-20h) -> Reserva de R$ 0,50 para acúmulo diário do motorista.
 */

export function checkIsPeakHour(date: Date = new Date()): boolean {
  const hour = date.getHours();
  // Janelas: 05h-09h (5..8), 11h-15h (11..14), 16h-20h (16..19)
  const isMorningPeak = hour >= 5 && hour < 9;
  const isLunchPeak = hour >= 11 && hour < 15;
  const isEveningPeak = hour >= 16 && hour < 20;

  return isMorningPeak || isLunchPeak || isEveningPeak;
}

export function getPeakWindowName(date: Date = new Date()): string | null {
  const hour = date.getHours();
  if (hour >= 5 && hour < 9) return 'Pico Matutino (05h - 09h)';
  if (hour >= 11 && hour < 15) return 'Pico Almoço (11h - 15h)';
  if (hour >= 16 && hour < 20) return 'Pico Noturno (16h - 20h)';
  return null;
}

export function calculateCommissionBreakdown(
  fare: number,
  modality: RideModality = 'comum',
  date: Date = new Date()
): CommissionBreakdown {
  const safeFare = Math.max(10.0, Math.round(fare * 100) / 100);

  let centralCommission = 3.0;
  let appliedTierDescription = 'Faixa R$ 10 - R$ 100 (Taxa Central R$ 3,00)';

  if (safeFare <= 100.0) {
    centralCommission = 3.0;
    appliedTierDescription = 'Faixa 1: R$ 10,00 a R$ 100,00 (Central R$ 3,00)';
  } else if (safeFare <= 200.0) {
    centralCommission = 7.0;
    appliedTierDescription = 'Faixa 2: R$ 100,01 a R$ 200,00 (Central R$ 7,00)';
  } else if (safeFare <= 300.0) {
    centralCommission = 30.0;
    appliedTierDescription = 'Faixa 3: R$ 200,01 a R$ 300,00 (Central R$ 30,00)';
  } else if (safeFare < 400.0) {
    centralCommission = 40.0;
    appliedTierDescription = 'Faixa 4: R$ 300,01 a R$ 399,99 (Central R$ 40,00)';
  } else {
    centralCommission = 70.0;
    appliedTierDescription = 'Faixa 5: R$ 400,00+ (Teto Fixo Inviolável Central R$ 70,00)';
  }

  const driverEarnings = Math.max(0, Math.round((safeFare - centralCommission) * 100) / 100);
  const isPeakHour = checkIsPeakHour(date);
  const peakBonusReserve = isPeakHour ? 0.5 : 0.0;
  const cashbackReserve = 0.5; // R$ 0,50 para completar R$ 5,00 a cada 10 corridas

  return {
    totalFare: safeFare,
    centralCommission,
    driverEarnings,
    cashbackReserve,
    isPeakHour,
    peakBonusReserve,
    appliedTierDescription,
  };
}

export function applyModalityMultiplier(baseFare: number, modality: RideModality): number {
  if (modality === 'prime') {
    // Prime: +20% por ar-condicionado garantido e frota superior
    return Math.round(baseFare * 1.2 * 100) / 100;
  }
  if (modality === 'contrato') {
    // Contratos corporativos: Tarifa acordada padrão com nota fiscal e faturamento mensal
    return Math.round(baseFare * 1.05 * 100) / 100;
  }
  return baseFare;
}
