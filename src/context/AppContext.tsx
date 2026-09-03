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
} from '../mockData';

export type ActiveView =
  | 'landing'
  | 'dashboard'
  | 'pdv'
  | 'shifts'
  | 'stock'
  | 'products'
  | 'partners'
  | 'financial'
  | 'reports'
  | 'audit';

interface AppContextType {
  // Navigation & Role
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
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
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  addStockMovement: (movement: {
    productId: string;
    type: StockMovement['type'];
    quantityChanged: number;
    reason: string;
  }) => void;

  createPartner: (partnerData: Omit<Partner, 'id' | 'createdAt'>) => Partner;
  updatePartner: (partnerId: string, updates: Partial<Partner>) => void;

  createFeeRule: (rule: Omit<PaymentFeeRule, 'id'>) => void;
  updateFeeRule: (ruleId: string, updates: Partial<PaymentFeeRule>) => void;

  markMonthlyFeePaid: (feeId: string) => void;
  markSettlementPaid: (settlementId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Helpers
  getApplicableFeeRule: (method: PaymentMethod, cardBrand?: string, installments?: number) => PaymentFeeRule | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & session state
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [userRole, setUserRoleState] = useState<UserRole>('ADMIN');
  const [currentPartnerId, setCurrentPartnerId] = useState<string>('partner-tutabel');

  // Persistence keys
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('pb_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
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

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('pb_partners', JSON.stringify(partners));
  }, [partners]);

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
    const newPartner: Partner = {
      ...partnerData,
      id: `partner-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPartners((prev) => [...prev, newPartner]);
    logAudit('CRIAR_PARCEIRO', 'Partner', newPartner.id, `Parceiro/Marca "${newPartner.brandName}" cadastrado.`);
    return newPartner;
  };

  const updatePartner = (partnerId: string, updates: Partial<Partner>) => {
    setPartners((prev) => prev.map((p) => (p.id === partnerId ? { ...p, ...updates } : p)));
    logAudit('ATUALIZAR_PARCEIRO', 'Partner', partnerId, `Dados cadastrais/contratuais do parceiro atualizados.`);
  };

  const createFeeRule = (rule: Omit<PaymentFeeRule, 'id'>) => {
    const newRule: PaymentFeeRule = {
      ...rule,
      id: `fee-${Date.now()}`,
    };
    setFeeRules((prev) => [...prev, newRule]);
    logAudit('CRIAR_REGRA_TAXA', 'PaymentFeeRule', newRule.id, `Nova taxa de maquininha configurada: ${newRule.feePercentage}% (${newRule.modality}).`);
  };

  const updateFeeRule = (ruleId: string, updates: Partial<PaymentFeeRule>) => {
    setFeeRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)));
    logAudit('ATUALIZAR_REGRA_TAXA', 'PaymentFeeRule', ruleId, `Taxa de maquininha atualizada.`);
  };

  const markMonthlyFeePaid = (feeId: string) => {
    setMonthlyFees((prev) =>
      prev.map((f) => (f.id === feeId ? { ...f, status: 'PAGO', paidAt: new Date().toISOString() } : f))
    );
    logAudit('PAGAMENTO_MENSALIDADE', 'MonthlyFee', feeId, `Mensalidade marcada como paga.`);
  };

  const markSettlementPaid = (settlementId: string) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === settlementId ? { ...s, status: 'PAGO', paidAt: new Date().toISOString() } : s))
    );
    logAudit('PAGAMENTO_REPASSE', 'Settlement', settlementId, `Repasse para artesão marcado como pago.`);
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
        updateProduct,
        deleteProduct,
        addStockMovement,
        createPartner,
        updatePartner,
        createFeeRule,
        updateFeeRule,
        markMonthlyFeePaid,
        markSettlementPaid,
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
