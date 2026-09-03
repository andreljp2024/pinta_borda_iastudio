/**
 * Pinta e Borda - Types & Data Models
 * Baseado no PRD v2.0 para Coworking e Loja Colaborativa de Artesanato
 */

export type UserRole = 'ADMIN' | 'PARTNER';

export type ShiftStatus = 'AGENDADO' | 'ATIVO' | 'ENCERRADO' | 'CANCELADO';

export type PaymentMethod = 'DINHEIRO' | 'PIX_DIRETO' | 'PIX_CENTRALIZADO' | 'DEBITO' | 'CREDITO';

export type SaleStatus = 'PAGO' | 'PENDENTE' | 'CANCELADO' | 'ESTORNADO' | 'CANCELADA' | 'CONCLUIDA';

export type StockMovementType = 'ENTRADA' | 'VENDA' | 'DEVOLUCAO' | 'AJUSTE' | 'PERDA' | 'AVARIA' | 'INVENTARIO';

export type MonthlyFeeStatus = 'ABERTO' | 'PAGO' | 'VENCIDO' | 'CANCELADO' | 'ATRASADO';

export interface PartnerContract {
  id: string;
  startDate: string;
  endDate?: string;
  monthlyFee: number;            // Mensalidade fixa (R$)
  salesCommissionRate: number;    // % sobre vendas Pinta e Borda (ex: 10 = 10%)
  commissionBase: 'BRUTO' | 'LIQUIDO';
  shiftRequirement: 'REGULAR' | 'ISENTO_COM_TAXA' | 'ISENTO_TOTAL';
  shiftFeePerDay: number;         // Taxa de diária/diarista caso não faça plantão (R$)
  pixMode: 'DIRETO' | 'CENTRALIZADO';
  status: 'ATIVO' | 'SUSPENSO' | 'ENCERRADO';
}

export interface Partner {
  id: string;
  name: string;
  tradeName?: string;              // Razão social / Nome Fantasia
  ownerName: string;              // Responsável
  document: string;               // CPF / CNPJ
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  brandName: string;
  brandDescription: string;
  brandLogo: string;
  category: string;
  pixKey: string;
  pixKeyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE' | 'ALEATORIA' | 'PHONE' | 'RANDOM';
  pixHolderName?: string;
  bankInfo?: {
    bank: string;
    agency: string;
    account: string;
  };
  contract: PartnerContract;
  createdAt: string;
  monthlyFee?: number;
  commissionPercentage?: number;
  worksShifts?: boolean;
  spaceType?: string;
  status?: 'ATIVO' | 'INATIVO' | 'PENDENTE';
  admissionDate?: string;
  dueDay?: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  partnerId: string;
  categoryId: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock: number;
  imageUrl: string;
  isFeatured?: boolean;
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  partnerId: string;
  partnerName: string;
  type: StockMovementType;
  quantityBefore: number;
  quantityChanged: number; // positive for entry, negative for exit
  quantityAfter: number;
  operatorId: string;
  operatorName: string;
  reason: string;
  referenceId?: string; // saleId or adjustment reference
  timestamp: string;
}

export interface Shift {
  id: string;
  partnerId: string;
  partnerName: string;
  operatorUserId: string;
  operatorName: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  status: ShiftStatus;
  notes?: string;
  salesCount: number;
  totalSalesAmount: number;
}

export interface PaymentFeeRule {
  id: string;
  terminalName: string;           // ex: 'Stone Maquininha Balcão', 'PagBank Pro'
  cardBrand: 'VISA' | 'MASTERCARD' | 'ELO' | 'AMEX' | 'HIPERCARD' | 'TODAS' | string;
  modality: 'DEBITO' | 'CREDITO_VISTA' | 'CREDITO_PARCELADO' | 'PIX';
  paymentMethod?: PaymentMethod | string;
  installmentsMin: number;
  installmentsMax: number;
  minInstallments?: number;
  maxInstallments?: number;
  feePercentage: number;          // ex: 1.99 (%)
  active: boolean;
  notes?: string;
}

export type FeeRule = PaymentFeeRule;

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  partnerId: string;
  partnerName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  feePercentageApplied: number;
  feeAmount: number;
  pintaBordaCommissionRate: number;
  pintaBordaCommissionAmount: number;
  netAmountToPartner: number;     // Subtotal - feeAmount - commissionAmount
}

export interface Sale {
  id: string;
  saleNumber: string;             // ex: #PB-2026-0842
  timestamp: string;
  shiftId: string;
  operatorId: string;
  operatorName: string;
  customerName?: string;
  customerPhone?: string;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    terminalName?: string;
    cardBrand?: string;
    installments: number;
    feePercentageApplied: number;
    feeAmountTotal: number;
    cashReceived?: number;
    changeGiven?: number;
    pixTxId?: string;
    pixConfirmedAt?: string;
  };
  items: SaleItem[];
  totalGross: number;
  totalFees: number;
  totalPintaBordaCommission: number;
  totalNetToPartners: number;
  status: SaleStatus;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface MonthlyFee {
  id: string;
  partnerId: string;
  partnerName: string;
  competency: string;             // ex: "08/2026", "09/2026"
  monthReference?: string;        // alias for competency
  amount: number;
  dueDate: string;
  status: MonthlyFeeStatus;
  paidAt?: string;
  discount: number;
  notes?: string;
  paymentProofUrl?: string;
  receiptNumber?: string;
}

export interface PartnerSettlement {
  id: string;
  partnerId: string;
  partnerName: string;
  period: string;                 // ex: "01/09/2026 a 15/09/2026"
  createdAt?: string;
  totalSalesGross: number;
  totalCardFeesDeducted: number;
  totalCommissionDeducted: number;
  shiftFeeDeducted: number;       // taxa de diarista caso não tenha cumprido escala
  monthlyFeeDeducted: number;     // dedução de mensalidade se acordado no repasse
  adjustments: number;
  netPayoutAmount: number;
  status: 'PENDENTE' | 'PAGO' | 'AGENDADO';
  paidAt?: string;
  paymentProofUrl?: string;
  paymentReference?: string;
  pixUsed?: string;
  notes?: string;
  // Aliases for compatibility
  grossSales?: number;
  paymentFeesDeducted?: number;
  pintaBordaCommissionDeducted?: number;
  netAmount?: number;
  salesCount?: number;
  saleIds?: string[];
}

export interface AppNotification {
  id: string;
  recipientPartnerId?: string;    // null means all/admin
  type: 'SALE_NOTIFICATION' | 'LOW_STOCK' | 'SHIFT_CHANGE' | 'PAYMENT_RECEIVED' | 'SYSTEM_ALERT';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}
