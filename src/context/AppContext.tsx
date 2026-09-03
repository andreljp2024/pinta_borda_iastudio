import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Partner,
  Product,
  ProductCategory,
  Shift,
  Sale,
  StockMovement,
  PaymentFeeRule,
  MonthlyFee,
  PartnerSettlement,
  AppNotification,
  AuditLog,
  SaleItem,
  PaymentMethod,
  CommunityAnnouncement,
} from '../types';
import {
  INITIAL_PARTNERS,
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_SHIFTS,
  INITIAL_SALES,
  INITIAL_FEE_RULES,
  INITIAL_MONTHLY_FEES,
  INITIAL_SETTLEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ANNOUNCEMENTS,
} from '../mockData';

export type ActiveView =
  | 'landing'
  | 'store'
  | 'dashboard'
  | 'pdv'
  | 'shifts'
  | 'stock'
  | 'products'
  | 'partners'
  | 'financial'
  | 'settlements'
  | 'fees'
  | 'sales'
  | 'reports'
  | 'audit'
  | 'artisan-portal';

interface AppContextType {
  // Navigation & Role
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  storePartnerFilter: string;
  setStorePartnerFilter: (partnerId: string) => void;
  navigateToStoreWithPartner: (partnerId: string) => void;
  userRole: UserRole;
  currentPartnerId: string;
  currentPartner: Partner | null;
  setUserRole: (role: UserRole, partnerId?: string) => void;

  // Data collections
  partners: Partner[];
  products: Product[];
  categories: ProductCategory[];
  shifts: Shift[];
  activeShift: Shift | null;
  sales: Sale[];
  stockMovements: StockMovement[];
  feeRules: PaymentFeeRule[];
  monthlyFees: MonthlyFee[];
  settlements: PartnerSettlement[];
  notifications: AppNotification[];
  auditLogs: AuditLog[];
  announcements: CommunityAnnouncement[];

  // Actions
  startShift: (partnerId: string, operatorName: string, notes?: string) => Shift;
  endShift: (shiftId: string, notes?: string) => void;
  requestShiftHandover: (newPartnerId: string, newOperatorName: string) => void;

  createSale: (saleInput: {
    items: { product: Product; quantity: number }[];
    paymentMethod: PaymentMethod;
    terminalName?: string;
    cardBrand?: string;
    installments: number;
    cashReceived?: number;
    customerName?: string;
    customerPhone?: string;
  }) => Sale;
  cancelSale: (saleId: string, reason: string) => boolean;

  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  addStockMovement: (movement: {
    productId: string;
    type: StockMovement['type'];
    quantityChanged: number;
    reason: string;
  }) => void;

  createPartner: (partnerData: Omit<Partner, 'id' | 'createdAt'>) => Partner;
  addPartner: (partnerData: Omit<Partner, 'id' | 'createdAt'>) => Partner;
  updatePartner: (partnerId: string, updates: Partial<Partner>) => void;
  deletePartner: (partnerId: string) => void;
  togglePartnerStatus: (partnerId: string) => void;

  createAnnouncement: (data: Omit<CommunityAnnouncement, 'id' | 'date'>) => CommunityAnnouncement;
  deleteAnnouncement: (id: string) => void;

  createFeeRule: (rule: Omit<PaymentFeeRule, 'id'>) => void;
  updateFeeRule: (ruleId: string, updates: Partial<PaymentFeeRule> | number) => void;

  markMonthlyFeePaid: (feeId: string) => void;
  markMonthlyFeeAsPaid: (feeId: string) => void;
  createMonthlyFee: (feeData: Omit<MonthlyFee, 'id'>) => MonthlyFee;
  updateMonthlyFee: (feeId: string, updates: Partial<MonthlyFee>) => void;
  deleteMonthlyFee: (feeId: string) => void;
  generateMonthlyFeesForCompetency: (competency: string, dueDate: string) => MonthlyFee[];

  markSettlementPaid: (settlementId: string, paymentReference?: string) => void;
  markSettlementAsPaid: (settlementId: string, paymentReference?: string) => void;
  createSettlement: (settlementData: Omit<PartnerSettlement, 'id'>) => PartnerSettlement;
  updateSettlement: (settlementId: string, updates: Partial<PartnerSettlement>) => void;
  deleteSettlement: (settlementId: string) => void;
  generatePeriodicSettlements: (params: {
    period: string;
    startDate?: string;
    endDate?: string;
    partnerIds?: string[];
    deductMonthlyFees?: boolean;
    notes?: string;
  }) => PartnerSettlement[];

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Helpers
  getApplicableFeeRule: (method: PaymentMethod, cardBrand?: string, installments?: number) => PaymentFeeRule | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & session state
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [storePartnerFilter, setStorePartnerFilter] = useState<string>('ALL');
  const [userRole, setUserRoleState] = useState<UserRole>('ADMIN');
  const [currentPartnerId, setCurrentPartnerId] = useState<string>('partner-tutabel');

  const navigateToStoreWithPartner = (partnerId: string) => {
    setStorePartnerFilter(partnerId);
    setActiveView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Persistence keys
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('pb_partners');
    const base: Partner[] = saved ? JSON.parse(saved) : INITIAL_PARTNERS;
    // Normalize partner fields so that monthlyFee, commissionPercentage, spaceType, worksShifts, and status are always safely defined
    return base.map((p) => ({
      ...p,
      monthlyFee: p.monthlyFee ?? p.contract?.monthlyFee ?? 350,
      commissionPercentage: p.commissionPercentage ?? p.contract?.salesCommissionRate ?? 10,
      worksShifts: p.worksShifts ?? (p.contract?.shiftRequirement === 'REGULAR'),
      spaceType: p.spaceType || 'Nicho Central',
      status: p.status || p.contract?.status || 'ATIVO',
      dueDay: p.dueDay ?? 10,
      admissionDate: p.admissionDate || p.contract?.startDate || '2026-01-01',
    }));
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pb_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories] = useState<ProductCategory[]>(INITIAL_CATEGORIES);

  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('pb_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('pb_sales');
    return saved ? JSON.parse(saved) : INITIAL_SALES;
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('pb_stock_movements');
    return saved ? JSON.parse(saved) : [];
  });

  const [feeRules, setFeeRules] = useState<PaymentFeeRule[]>(() => {
    const saved = localStorage.getItem('pb_fee_rules');
    return saved ? JSON.parse(saved) : INITIAL_FEE_RULES;
  });

  const [monthlyFees, setMonthlyFees] = useState<MonthlyFee[]>(() => {
    const saved = localStorage.getItem('pb_monthly_fees');
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_FEES;
  });

  const [settlements, setSettlements] = useState<PartnerSettlement[]>(() => {
    const saved = localStorage.getItem('pb_settlements');
    return saved ? JSON.parse(saved) : INITIAL_SETTLEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('pb_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('pb_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [announcements, setAnnouncements] = useState<CommunityAnnouncement[]>(() => {
    const saved = localStorage.getItem('pb_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('pb_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('pb_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('pb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pb_shifts', JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem('pb_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('pb_stock_movements', JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem('pb_fee_rules', JSON.stringify(feeRules));
  }, [feeRules]);

  useEffect(() => {
    localStorage.setItem('pb_monthly_fees', JSON.stringify(monthlyFees));
  }, [monthlyFees]);

  useEffect(() => {
    localStorage.setItem('pb_settlements', JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem('pb_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('pb_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Derived current active shift
  const activeShift = shifts.find((s) => s.status === 'ATIVO') || null;

  // Derived current partner
  const currentPartner = partners.find((p) => p.id === currentPartnerId) || null;

  const logAudit = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: userRole === 'ADMIN' ? 'user-admin' : currentPartner?.ownerName || 'user-partner',
      userName: userRole === 'ADMIN' ? 'Administrador Geral' : currentPartner?.ownerName || 'Operador',
      role: userRole,
      action,
      entity,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setUserRole = (role: UserRole, partnerId?: string) => {
    setUserRoleState(role);
    if (partnerId) {
      setCurrentPartnerId(partnerId);
    } else if (role === 'PARTNER' && !currentPartnerId) {
      setCurrentPartnerId(partners[0]?.id || '');
    }
    logAudit(
      'ALTERAR_ACESSO',
      'Session',
      role,
      `Sessão alterada para perfil ${role}${partnerId ? ` (Parceiro: ${partnerId})` : ''}`
    );
  };

  const startShift = (partnerId: string, operatorName: string, notes?: string): Shift => {
    const partner = partners.find((p) => p.id === partnerId);
    const partnerName = partner ? partner.brandName : 'Parceiro';

    // End any previously active shift first
    const updatedShifts = shifts.map((s) => {
      if (s.status === 'ATIVO') {
        return {
          ...s,
          status: 'ENCERRADO' as const,
          endTime: new Date().toISOString(),
          notes: s.notes ? `${s.notes} (Encerrado por troca de turno)` : 'Encerrado por novo turno',
        };
      }
      return s;
    });

    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      partnerId,
      partnerName,
      operatorUserId: `user-${partnerId}`,
      operatorName,
      startTime: new Date().toISOString(),
      status: 'ATIVO',
      notes: notes || 'Turno presencial no Rio Anil Shopping',
      salesCount: 0,
      totalSalesAmount: 0,
    };

    setShifts([newShift, ...updatedShifts]);

    logAudit(
      'INICIO_EXPEDIENTE',
      'Shift',
      newShift.id,
      `Expediente iniciado por ${operatorName} (${partnerName}) no ponto físico.`
    );

    // Broadcast notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: 'SHIFT_CHANGE',
      title: 'Novo Expediente no Balcão',
      message: `${operatorName} assumiu o atendimento da loja colaborativa no Rio Anil Shopping.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newShift;
  };

  const endShift = (shiftId: string, notes?: string) => {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id === shiftId) {
          const now = new Date();
          const start = new Date(s.startTime);
          const diffMinutes = Math.max(1, Math.round((now.getTime() - start.getTime()) / 60000));
          return {
            ...s,
            status: 'ENCERRADO',
            endTime: now.toISOString(),
            durationMinutes: diffMinutes,
            notes: notes || s.notes,
          };
        }
        return s;
      })
    );

    logAudit('ENCERRAMENTO_EXPEDIENTE', 'Shift', shiftId, `Expediente encerrado. ${notes || ''}`);
  };

  const requestShiftHandover = (newPartnerId: string, newOperatorName: string) => {
    const newPartner = partners.find((p) => p.id === newPartnerId);
    if (!newPartner) return;
    startShift(newPartnerId, newOperatorName, `Troca de expediente aprovada para ${newPartner.brandName}`);
  };

  const getApplicableFeeRule = (
    method: PaymentMethod,
    cardBrand?: string,
    installments: number = 1
  ): PaymentFeeRule | undefined => {
    if (method === 'DINHEIRO') {
      return undefined;
    }
    if (method === 'PIX_DIRETO') {
      return feeRules.find((r) => r.id === 'fee-pix-direto');
    }
    if (method === 'PIX_CENTRALIZADO') {
      return feeRules.find((r) => r.id === 'fee-pix-centralizado');
    }
    if (method === 'DEBITO') {
      return (
        feeRules.find(
          (r) =>
            r.modality === 'DEBITO' &&
            r.active &&
            (cardBrand ? r.cardBrand === cardBrand : true)
        ) || feeRules.find((r) => r.modality === 'DEBITO' && r.active)
      );
    }
    if (method === 'CREDITO') {
      if (installments === 1) {
        return (
          feeRules.find(
            (r) =>
              r.modality === 'CREDITO_VISTA' &&
              r.active &&
              (cardBrand ? r.cardBrand === cardBrand : true)
          ) || feeRules.find((r) => r.modality === 'CREDITO_VISTA' && r.active)
        );
      } else {
        return feeRules.find(
          (r) =>
            r.modality === 'CREDITO_PARCELADO' &&
            r.active &&
            installments >= r.installmentsMin &&
            installments <= r.installmentsMax
        );
      }
    }
    return undefined;
  };

  const createSale = (saleInput: {
    items: { product: Product; quantity: number }[];
    paymentMethod: PaymentMethod;
    terminalName?: string;
    cardBrand?: string;
    installments: number;
    cashReceived?: number;
    customerName?: string;
    customerPhone?: string;
  }): Sale => {
    // Current operator details
    const operatorId = activeShift ? activeShift.partnerId : 'admin-operator';
    const operatorName = activeShift
      ? activeShift.operatorName
      : userRole === 'ADMIN'
      ? 'Administrador Geral'
      : currentPartner?.ownerName || 'Balcão Pinta e Borda';

    const rule = getApplicableFeeRule(
      saleInput.paymentMethod,
      saleInput.cardBrand,
      saleInput.installments
    );

    const feePct = rule ? rule.feePercentage : 0;
    const saleId = `sale-${Date.now()}`;
    const saleNumber = `#PB-${new Date().getFullYear()}-${String(sales.length + 185).padStart(4, '0')}`;

    // Process items, calculate per-item rate, frozen fee, commission and net payout
    let totalGross = 0;
    let totalFees = 0;
    let totalCommission = 0;
    let totalNetToPartners = 0;

    const saleItems: SaleItem[] = saleInput.items.map((item, idx) => {
      const partner = partners.find((p) => p.id === item.product.partnerId);
      const partnerName = partner ? partner.brandName : 'Marca Artesanal';
      const subtotal = Math.round(item.product.price * item.quantity * 100) / 100;
      const itemFeeAmount = Math.round((subtotal * (feePct / 100)) * 100) / 100;

      // Commission: default 10% or from partner contract
      const commRate = partner?.contract?.salesCommissionRate ?? 10;
      // Based on PRD: contract commission base can be gross or net of card fees
      const commBase = partner?.contract?.commissionBase === 'LIQUIDO' ? subtotal - itemFeeAmount : subtotal;
      const itemCommAmount = Math.round((commBase * (commRate / 100)) * 100) / 100;
      const netToPartner = Math.round((subtotal - itemFeeAmount - itemCommAmount) * 100) / 100;

      totalGross += subtotal;
      totalFees += itemFeeAmount;
      totalCommission += itemCommAmount;
      totalNetToPartners += netToPartner;

      return {
        id: `item-${saleId}-${idx + 1}`,
        productId: item.product.id,
        productName: item.product.name,
        productSku: item.product.sku,
        partnerId: item.product.partnerId,
        partnerName,
        unitPrice: item.product.price,
        quantity: item.quantity,
        subtotal,
        feePercentageApplied: feePct,
        feeAmount: itemFeeAmount,
        pintaBordaCommissionRate: commRate,
        pintaBordaCommissionAmount: itemCommAmount,
        netAmountToPartner: netToPartner,
      };
    });

    const newSale: Sale = {
      id: saleId,
      saleNumber,
      timestamp: new Date().toISOString(),
      shiftId: activeShift?.id || 'no-shift',
      operatorId,
      operatorName,
      customerName: saleInput.customerName,
      customerPhone: saleInput.customerPhone,
      paymentMethod: saleInput.paymentMethod,
      paymentDetails: {
        terminalName: rule?.terminalName || (saleInput.paymentMethod === 'DINHEIRO' ? 'Dinheiro Balcão' : 'Maquininha P&B'),
        cardBrand: saleInput.cardBrand,
        installments: saleInput.installments,
        feePercentageApplied: feePct,
        feeAmountTotal: totalFees,
        cashReceived: saleInput.cashReceived,
        changeGiven:
          saleInput.cashReceived && saleInput.cashReceived > totalGross
            ? Math.round((saleInput.cashReceived - totalGross) * 100) / 100
            : 0,
        pixTxId:
          saleInput.paymentMethod === 'PIX_DIRETO' || saleInput.paymentMethod === 'PIX_CENTRALIZADO'
            ? `PIX-${Date.now().toString(36).toUpperCase()}`
            : undefined,
        pixConfirmedAt:
          saleInput.paymentMethod === 'PIX_DIRETO' || saleInput.paymentMethod === 'PIX_CENTRALIZADO'
            ? new Date().toISOString()
            : undefined,
      },
      items: saleItems,
      totalGross: Math.round(totalGross * 100) / 100,
      totalFees: Math.round(totalFees * 100) / 100,
      totalPintaBordaCommission: Math.round(totalCommission * 100) / 100,
      totalNetToPartners: Math.round(totalNetToPartners * 100) / 100,
      status: 'PAGO',
    };

    // 1. Decrement physical stock balances & log stock movements
    setProducts((prev) =>
      prev.map((prod) => {
        const boughtItem = saleInput.items.find((i) => i.product.id === prod.id);
        if (boughtItem) {
          const newStock = Math.max(0, prod.stock - boughtItem.quantity);
          // Add stock movement record
          const movement: StockMovement = {
            id: `mov-${Date.now()}-${prod.id}`,
            productId: prod.id,
            productName: prod.name,
            productSku: prod.sku,
            partnerId: prod.partnerId,
            partnerName: prod.name,
            type: 'VENDA',
            quantityBefore: prod.stock,
            quantityChanged: -boughtItem.quantity,
            quantityAfter: newStock,
            operatorId,
            operatorName,
            reason: `Venda ${saleNumber} no PDV`,
            referenceId: saleId,
            timestamp: new Date().toISOString(),
          };
          setStockMovements((sm) => [movement, ...sm]);
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    // 2. Update active shift metrics
    if (activeShift) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === activeShift.id
            ? {
                ...s,
                salesCount: s.salesCount + 1,
                totalSalesAmount: Math.round((s.totalSalesAmount + totalGross) * 100) / 100,
              }
            : s
        )
      );
    }

    // 3. Dispatch Push notifications to each partner owner (Princípio P4 e P5: notificar proprietário quando operador != proprietário)
    const newNotificationsList: AppNotification[] = [];
    const notifiedPartners = new Set<string>();

    saleItems.forEach((it) => {
      if (!notifiedPartners.has(it.partnerId)) {
        notifiedPartners.add(it.partnerId);
        const isSelfSold = operatorId === it.partnerId;
        newNotificationsList.push({
          id: `notif-sale-${Date.now()}-${it.partnerId}`,
          recipientPartnerId: it.partnerId,
          type: 'SALE_NOTIFICATION',
          title: isSelfSold ? 'Venda registrada com sucesso!' : 'Seu produto foi vendido no balcão!',
          message: isSelfSold
            ? `Você vendeu "${it.productName}". Líquido do item: R$ ${it.netAmountToPartner.toFixed(2)}.`
            : `"${it.productName}" foi vendido por ${operatorName}. Líquido a receber: R$ ${it.netAmountToPartner.toFixed(2)}.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          metadata: { saleId, saleNumber, amount: it.subtotal },
        });
      }
    });

    if (newNotificationsList.length > 0) {
      setNotifications((prev) => [...newNotificationsList, ...prev]);
    }

    // 4. Save sale & log audit
    setSales((prev) => [newSale, ...prev]);

    logAudit(
      'CRIAR_VENDA',
      'Sale',
      newSale.id,
      `Venda ${saleNumber} de R$ ${totalGross.toFixed(2)} registrada por ${operatorName} via ${saleInput.paymentMethod}.`
    );

    return newSale;
  };

  const cancelSale = (saleId: string, reason: string): boolean => {
    const sale = sales.find((s) => s.id === saleId);
    if (!sale || sale.status === 'CANCELADO' || sale.status === 'ESTORNADO') {
      return false;
    }

    // Restore stock
    sale.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === item.productId) {
            const restoredStock = p.stock + item.quantity;
            const mov: StockMovement = {
              id: `mov-cancel-${Date.now()}-${p.id}`,
              productId: p.id,
              productName: p.name,
              productSku: p.sku,
              partnerId: p.partnerId,
              partnerName: item.partnerName,
              type: 'DEVOLUCAO',
              quantityBefore: p.stock,
              quantityChanged: item.quantity,
              quantityAfter: restoredStock,
              operatorId: userRole === 'ADMIN' ? 'admin' : currentPartnerId,
              operatorName: userRole === 'ADMIN' ? 'Administrador' : currentPartner?.ownerName || 'Operador',
              reason: `Estorno de venda ${sale.saleNumber}: ${reason}`,
              referenceId: saleId,
              timestamp: new Date().toISOString(),
            };
            setStockMovements((sm) => [mov, ...sm]);
            return { ...p, stock: restoredStock };
          }
          return p;
        })
      );
    });

    // Update sale state to ESTORNADO
    setSales((prev) =>
      prev.map((s) =>
        s.id === saleId
          ? {
              ...s,
              status: 'ESTORNADO',
              cancellationReason: reason,
              cancelledAt: new Date().toISOString(),
              cancelledBy: userRole === 'ADMIN' ? 'Administrador' : currentPartner?.ownerName || 'Operador',
            }
          : s
      )
    );

    logAudit(
      'ESTORNAR_VENDA',
      'Sale',
      saleId,
      `Venda ${sale.saleNumber} estornada. Motivo: ${reason}. Estoque restaurado.`
    );

    return true;
  };

  const createProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);

    // Initial stock movement if stock > 0
    if (newProd.stock > 0) {
      const mov: StockMovement = {
        id: `mov-init-${Date.now()}`,
        productId: newProd.id,
        productName: newProd.name,
        productSku: newProd.sku,
        partnerId: newProd.partnerId,
        partnerName: partners.find((p) => p.id === newProd.partnerId)?.brandName || '',
        type: 'ENTRADA',
        quantityBefore: 0,
        quantityChanged: newProd.stock,
        quantityAfter: newProd.stock,
        operatorId: userRole === 'ADMIN' ? 'admin' : currentPartnerId,
        operatorName: userRole === 'ADMIN' ? 'Administrador' : currentPartner?.ownerName || 'Parceiro',
        reason: 'Cadastro inicial de produto e estoque',
        timestamp: new Date().toISOString(),
      };
      setStockMovements((sm) => [mov, ...sm]);
    }

    logAudit('CRIAR_PRODUTO', 'Product', newProd.id, `Produto "${newProd.name}" (${newProd.sku}) cadastrado.`);
    return newProd;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updated = { ...p, ...updates, updatedAt: new Date().toISOString() };
          return updated;
        }
        return p;
      })
    );
    logAudit('ATUALIZAR_PRODUTO', 'Product', productId, `Produto atualizado com novas propriedades.`);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    logAudit('REMOVER_PRODUTO', 'Product', productId, `Produto removido do catálogo.`);
  };

  const addStockMovement = (movement: {
    productId: string;
    type: StockMovement['type'];
    quantityChanged: number;
    reason: string;
  }) => {
    const prod = products.find((p) => p.id === movement.productId);
    if (!prod) return;

    const newStock = Math.max(0, prod.stock + movement.quantityChanged);
    const partner = partners.find((p) => p.id === prod.partnerId);

    const movRecord: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      productSku: prod.sku,
      partnerId: prod.partnerId,
      partnerName: partner ? partner.brandName : 'Marca',
      type: movement.type,
      quantityBefore: prod.stock,
      quantityChanged: movement.quantityChanged,
      quantityAfter: newStock,
      operatorId: userRole === 'ADMIN' ? 'admin' : currentPartnerId,
      operatorName: userRole === 'ADMIN' ? 'Administrador' : currentPartner?.ownerName || 'Operador',
      reason: movement.reason,
      timestamp: new Date().toISOString(),
    };

    setStockMovements((prev) => [movRecord, ...prev]);
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? { ...p, stock: newStock } : p)));

    logAudit(
      'MOVIMENTACAO_ESTOQUE',
      'Stock',
      prod.id,
      `Movimentação (${movement.type}): ${movement.quantityChanged > 0 ? '+' : ''}${movement.quantityChanged} un. no item ${prod.name}. Motivo: ${movement.reason}`
    );
  };

  const createPartner = (partnerData: Omit<Partner, 'id' | 'createdAt'>): Partner => {
    const monthlyFee = partnerData.monthlyFee ?? partnerData.contract?.monthlyFee ?? 350;
    const commissionPercentage = partnerData.commissionPercentage ?? partnerData.contract?.salesCommissionRate ?? 10;
    const worksShifts = partnerData.worksShifts ?? true;
    const status = partnerData.status ?? 'ATIVO';

    const newPartner: Partner = {
      ...partnerData,
      id: `partner-${Date.now()}`,
      monthlyFee,
      commissionPercentage,
      worksShifts,
      status,
      contract: partnerData.contract || {
        id: `cont-${Date.now()}`,
        startDate: partnerData.admissionDate || new Date().toISOString().split('T')[0],
        monthlyFee,
        salesCommissionRate: commissionPercentage,
        commissionBase: 'BRUTO',
        shiftRequirement: worksShifts ? 'REGULAR' : 'ISENTO_COM_TAXA',
        shiftFeePerDay: worksShifts ? 0 : 50,
        pixMode: 'DIRETO',
        status,
      },
      createdAt: new Date().toISOString(),
    };
    setPartners((prev) => [...prev, newPartner]);
    logAudit('CRIAR_PARCEIRO', 'Partner', newPartner.id, `Parceiro/Marca "${newPartner.brandName}" cadastrado.`);
    return newPartner;
  };

  const updatePartner = (partnerId: string, updates: Partial<Partner>) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id !== partnerId) return p;
        const updated = { ...p, ...updates };
        if (updated.contract) {
          updated.contract = {
            ...updated.contract,
            monthlyFee: updated.monthlyFee ?? updated.contract.monthlyFee,
            salesCommissionRate: updated.commissionPercentage ?? updated.contract.salesCommissionRate,
            shiftRequirement: updated.worksShifts ? 'REGULAR' : 'ISENTO_COM_TAXA',
            status: (updated.status as any) || updated.contract.status,
          };
        }
        return updated;
      })
    );
    logAudit('ATUALIZAR_PARCEIRO', 'Partner', partnerId, `Dados cadastrais/contratuais do parceiro atualizados.`);
  };

  const deletePartner = (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    setPartners((prev) => prev.filter((p) => p.id !== partnerId));
    logAudit('EXCLUIR_PARCEIRO', 'Partner', partnerId, `Parceiro "${partner?.brandName || partnerId}" removido.`);
  };

  const togglePartnerStatus = (partnerId: string) => {
    setPartners((prev) =>
      prev.map((p) => {
        if (p.id !== partnerId) return p;
        const nextStatus = p.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        return {
          ...p,
          status: nextStatus,
          contract: p.contract ? { ...p.contract, status: nextStatus as any } : p.contract,
        };
      })
    );
    logAudit('ALTERAR_STATUS_PARCEIRO', 'Partner', partnerId, `Status do parceiro alterado.`);
  };

  const createAnnouncement = (data: Omit<CommunityAnnouncement, 'id' | 'date'>) => {
    const newAnn: CommunityAnnouncement = {
      ...data,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    logAudit('CRIAR_COMUNICADO', 'CommunityAnnouncement', newAnn.id, `Novo comunicado publicado: "${newAnn.title}"`);
    return newAnn;
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    logAudit('EXCLUIR_COMUNICADO', 'CommunityAnnouncement', id, `Comunicado removido do mural.`);
  };

  const createFeeRule = (rule: Omit<PaymentFeeRule, 'id'>) => {
    const newRule: PaymentFeeRule = {
      ...rule,
      id: `fee-${Date.now()}`,
    };
    setFeeRules((prev) => [...prev, newRule]);
    logAudit('CRIAR_REGRA_TAXA', 'PaymentFeeRule', newRule.id, `Nova taxa de maquininha configurada: ${newRule.feePercentage}% (${newRule.modality}).`);
  };

  const updateFeeRule = (ruleId: string, updates: Partial<PaymentFeeRule> | number) => {
    const updateObj = typeof updates === 'number' ? { feePercentage: updates } : updates;
    setFeeRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...updateObj } : r)));
    logAudit('ATUALIZAR_REGRA_TAXA', 'PaymentFeeRule', ruleId, `Taxa de maquininha atualizada.`);
  };

  const markMonthlyFeePaid = (feeId: string) => {
    setMonthlyFees((prev) =>
      prev.map((f) => (f.id === feeId ? { ...f, status: 'PAGO', paidAt: new Date().toISOString() } : f))
    );
    logAudit('PAGAMENTO_MENSALIDADE', 'MonthlyFee', feeId, `Mensalidade marcada como paga.`);
  };

  const createMonthlyFee = (feeData: Omit<MonthlyFee, 'id'>): MonthlyFee => {
    const newFee: MonthlyFee = {
      ...feeData,
      id: `fee-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setMonthlyFees((prev) => [newFee, ...prev]);
    logAudit('CRIAR_MENSALIDADE', 'MonthlyFee', newFee.id, `Mensalidade ${newFee.competency} de R$ ${newFee.amount.toFixed(2)} criada para ${newFee.partnerName}.`);
    return newFee;
  };

  const updateMonthlyFee = (feeId: string, updates: Partial<MonthlyFee>) => {
    setMonthlyFees((prev) => prev.map((f) => (f.id === feeId ? { ...f, ...updates } : f)));
    logAudit('ATUALIZAR_MENSALIDADE', 'MonthlyFee', feeId, `Mensalidade atualizada.`);
  };

  const deleteMonthlyFee = (feeId: string) => {
    setMonthlyFees((prev) => prev.filter((f) => f.id !== feeId));
    logAudit('EXCLUIR_MENSALIDADE', 'MonthlyFee', feeId, `Mensalidade removida.`);
  };

  const generateMonthlyFeesForCompetency = (competency: string, dueDate: string): MonthlyFee[] => {
    const created: MonthlyFee[] = [];
    const activePartners = partners.filter((p) => (p.status || p.contract?.status) !== 'ENCERRADO' && (p.status || p.contract?.status) !== 'INATIVO');

    activePartners.forEach((partner) => {
      const existing = monthlyFees.find((f) => f.partnerId === partner.id && (f.competency === competency || f.monthReference === competency));
      if (!existing) {
        const amount = partner.contract?.monthlyFee ?? partner.monthlyFee ?? 350;
        const fee: MonthlyFee = {
          id: `fee-${partner.id}-${competency.replace('/', '-')}`,
          partnerId: partner.id,
          partnerName: partner.brandName,
          competency,
          monthReference: competency,
          amount,
          dueDate,
          status: 'ABERTO',
          discount: 0,
        };
        created.push(fee);
      }
    });

    if (created.length > 0) {
      setMonthlyFees((prev) => [...created, ...prev]);
      logAudit('GERAR_LOTE_MENSALIDADES', 'MonthlyFee', competency, `${created.length} mensalidades geradas para a competência ${competency}.`);
    }

    return created;
  };

  const markSettlementPaid = (settlementId: string, paymentReference?: string) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === settlementId
          ? {
              ...s,
              status: 'PAGO',
              paidAt: new Date().toISOString(),
              paymentReference: paymentReference || s.paymentReference || `PIX-${Date.now()}`,
            }
          : s
      )
    );
    logAudit('PAGAMENTO_REPASSE', 'Settlement', settlementId, `Repasse para artesão marcado como pago (${paymentReference || 'Pix'}).`);
  };

  const createSettlement = (settlementData: Omit<PartnerSettlement, 'id'>): PartnerSettlement => {
    const newSettlement: PartnerSettlement = {
      ...settlementData,
      id: `settle-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: settlementData.createdAt || new Date().toISOString(),
      grossSales: settlementData.grossSales ?? settlementData.totalSalesGross,
      netAmount: settlementData.netAmount ?? settlementData.netPayoutAmount,
      paymentFeesDeducted: settlementData.paymentFeesDeducted ?? settlementData.totalCardFeesDeducted,
      pintaBordaCommissionDeducted: settlementData.pintaBordaCommissionDeducted ?? settlementData.totalCommissionDeducted,
    };
    setSettlements((prev) => [newSettlement, ...prev]);
    logAudit('CRIAR_REPASSE', 'Settlement', newSettlement.id, `Fechamento de repasse criado para ${newSettlement.partnerName} (${newSettlement.period}): R$ ${newSettlement.netPayoutAmount.toFixed(2)}.`);
    return newSettlement;
  };

  const updateSettlement = (settlementId: string, updates: Partial<PartnerSettlement>) => {
    setSettlements((prev) => prev.map((s) => (s.id === settlementId ? { ...s, ...updates } : s)));
    logAudit('ATUALIZAR_REPASSE', 'Settlement', settlementId, `Repasse atualizado.`);
  };

  const deleteSettlement = (settlementId: string) => {
    setSettlements((prev) => prev.filter((s) => s.id !== settlementId));
    logAudit('EXCLUIR_REPASSE', 'Settlement', settlementId, `Fechamento de repasse excluído.`);
  };

  const generatePeriodicSettlements = (params: {
    period: string;
    startDate?: string;
    endDate?: string;
    partnerIds?: string[];
    deductMonthlyFees?: boolean;
    notes?: string;
  }): PartnerSettlement[] => {
    const { period, startDate, endDate, partnerIds, deductMonthlyFees, notes } = params;
    const targetPartners = partnerIds && partnerIds.length > 0
      ? partners.filter((p) => partnerIds.includes(p.id))
      : partners;

    const generated: PartnerSettlement[] = [];

    // Filter sales in date range and valid status
    const validSales = sales.filter((s) => {
      if (s.status === 'CANCELADA' || s.status === 'CANCELADO' || s.status === 'ESTORNADO') return false;
      if (startDate && new Date(s.timestamp) < new Date(startDate)) return false;
      if (endDate && new Date(s.timestamp) > new Date(endDate)) return false;
      return true;
    });

    targetPartners.forEach((partner) => {
      // Find all items sold for this partner in valid sales
      const partnerItems: { saleId: string; subtotal: number; fee: number; comm: number; net: number }[] = [];
      validSales.forEach((s) => {
        s.items.forEach((it) => {
          if (it.partnerId === partner.id) {
            partnerItems.push({
              saleId: s.id,
              subtotal: it.subtotal,
              fee: it.feeAmount,
              comm: it.pintaBordaCommissionAmount,
              net: it.netAmountToPartner,
            });
          }
        });
      });

      if (partnerItems.length === 0) return;

      const gross = Math.round(partnerItems.reduce((acc, it) => acc + it.subtotal, 0) * 100) / 100;
      const cardFees = Math.round(partnerItems.reduce((acc, it) => acc + it.fee, 0) * 100) / 100;
      const commission = Math.round(partnerItems.reduce((acc, it) => acc + it.comm, 0) * 100) / 100;
      let net = Math.round((gross - cardFees - commission) * 100) / 100;

      let monthlyFeeDeducted = 0;
      if (deductMonthlyFees) {
        const openFee = monthlyFees.find(
          (f) => f.partnerId === partner.id && (f.status === 'ABERTO' || f.status === 'PENDENTE' || f.status === 'VENCIDO' || f.status === 'ATRASADO')
        );
        if (openFee && net >= openFee.amount) {
          monthlyFeeDeducted = openFee.amount;
          net = Math.round((net - monthlyFeeDeducted) * 100) / 100;
          // Mark fee as paid via deduction
          setMonthlyFees((prev) =>
            prev.map((f) =>
              f.id === openFee.id
                ? { ...f, status: 'PAGO', paidAt: new Date().toISOString(), notes: `Abatido no repasse (${period})` }
                : f
            )
          );
        }
      }

      const settlement: PartnerSettlement = {
        id: `settle-${partner.id}-${Date.now()}`,
        partnerId: partner.id,
        partnerName: partner.brandName,
        period,
        createdAt: new Date().toISOString(),
        totalSalesGross: gross,
        totalCardFeesDeducted: cardFees,
        totalCommissionDeducted: commission,
        shiftFeeDeducted: 0,
        monthlyFeeDeducted,
        adjustments: 0,
        netPayoutAmount: net,
        status: 'PENDENTE',
        pixUsed: partner.pixKey,
        notes: notes || `Fechamento quinzenal calculado com base em ${partnerItems.length} itens vendidos.`,
        grossSales: gross,
        paymentFeesDeducted: cardFees,
        pintaBordaCommissionDeducted: commission,
        netAmount: net,
        salesCount: partnerItems.length,
        saleIds: Array.from(new Set(partnerItems.map((it) => it.saleId))),
      };

      generated.push(settlement);
    });

    if (generated.length > 0) {
      setSettlements((prev) => [...generated, ...prev]);
      logAudit('FECHAMENTO_PERIODO', 'Settlement', period, `Fechamento gerado para ${generated.length} parceiras. Total líquido: R$ ${generated.reduce((acc, g) => acc + g.netPayoutAmount, 0).toFixed(2)}.`);
    }

    return generated;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        storePartnerFilter,
        setStorePartnerFilter,
        navigateToStoreWithPartner,
        userRole,
        currentPartnerId,
        currentPartner,
        setUserRole,
        partners,
        products,
        categories,
        shifts,
        activeShift,
        sales,
        stockMovements,
        feeRules,
        monthlyFees,
        settlements,
        notifications,
        auditLogs,
        startShift,
        endShift,
        requestShiftHandover,
        createSale,
        cancelSale,
        createProduct,
        addProduct: createProduct,
        updateProduct,
        deleteProduct,
        addStockMovement,
        createPartner,
        addPartner: createPartner,
        updatePartner,
        deletePartner,
        togglePartnerStatus,
        announcements,
        createAnnouncement,
        deleteAnnouncement,
        createFeeRule,
        updateFeeRule,
        markMonthlyFeePaid,
        markMonthlyFeeAsPaid: markMonthlyFeePaid,
        createMonthlyFee,
        updateMonthlyFee,
        deleteMonthlyFee,
        generateMonthlyFeesForCompetency,
        markSettlementPaid,
        markSettlementAsPaid: markSettlementPaid,
        createSettlement,
        updateSettlement,
        deleteSettlement,
        generatePeriodicSettlements,
        markNotificationRead,
        markAllNotificationsRead,
        getApplicableFeeRule,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
