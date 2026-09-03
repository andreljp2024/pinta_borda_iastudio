import React, { useState, useMemo } from 'react';
import {
  Boxes,
  PlusCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Clock,
  History,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, StockMovement, StockMovementType } from '../../types';
import { handleImageError, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageFallbacks';

export const StockView: React.FC = () => {
  const {
    products,
    partners,
    categories,
    stockMovements,
    addStockMovement,
    userRole,
    currentPartner,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    userRole === 'PARTNER' && currentPartner ? currentPartner.id : 'all'
  );
  const [activeTab, setActiveTab] = useState<'BALANCES' | 'MOVEMENTS'>('BALANCES');

  // New Movement Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProductId, setModalProductId] = useState('');
  const [modalType, setModalType] = useState<StockMovementType>('ENTRADA');
  const [modalQuantity, setModalQuantity] = useState<number>(5);
  const [modalReason, setModalReason] = useState('');

  // Scoped products if partner
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      // RBAC isolation for Partner (PRD P8)
      if (userRole === 'PARTNER' && currentPartner && p.partnerId !== currentPartner.id) {
        return false;
      }
      if (selectedPartnerId !== 'all' && p.partnerId !== selectedPartnerId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const brand = partners.find((pt) => pt.id === p.partnerId)?.brandName.toLowerCase() || '';
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || brand.includes(q);
      }
      return true;
    });
  }, [products, partners, searchQuery, selectedPartnerId, userRole, currentPartner]);

  // Critical stock items
  const lowStockProducts = useMemo(() => {
    return visibleProducts.filter((p) => p.stock <= p.minStock);
  }, [visibleProducts]);

  // Visible stock movements
  const visibleMovements = useMemo(() => {
    return stockMovements.filter((m) => {
      if (userRole === 'PARTNER' && currentPartner && m.partnerId !== currentPartner.id) {
        return false;
      }
      if (selectedPartnerId !== 'all' && m.partnerId !== selectedPartnerId) {
        return false;
      }
      return true;
    });
  }, [stockMovements, userRole, currentPartner, selectedPartnerId]);

  const handleCreateMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalProductId) {
      alert('Selecione um produto.');
      return;
    }
    if (modalQuantity === 0) {
      alert('Informe uma quantidade válida.');
      return;
    }

    const isExit = modalType === 'PERDA' || modalType === 'AVARIA';
    const delta = isExit ? -Math.abs(modalQuantity) : modalQuantity;

    addStockMovement({
      productId: modalProductId,
      type: modalType,
      quantityChanged: delta,
      reason: modalReason || `Movimentação ${modalType}`,
    });

    setIsModalOpen(false);
    setModalReason('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#c85a78] font-mono-craft">
            Armazenamento Físico Coletivo
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#2e1420]">
            Estoque Compartilhado
          </h2>
          <p className="text-xs sm:text-sm text-[#8e727e] mt-1 font-light">
            Gestão unificada do estoque físico da loja no Rio Anil Shopping com propriedade lógica por marca.
          </p>
        </div>

        <button
          onClick={() => {
            if (visibleProducts.length > 0) {
              setModalProductId(visibleProducts[0].id);
            }
            setIsModalOpen(true);
          }}
          className="solid-button text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#dc9b86]" />
          <span>Nova Movimentação de Estoque</span>
        </button>
      </div>

      {/* Low Stock Banner Alert if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-[#f6ebef]/70 border border-[#edd5dc] rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#c85a78] shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-[#2e1420] text-sm font-mono-craft">
              Alerta de Reposição: {lowStockProducts.length} itens com estoque mínimo atingido
            </h4>
            <p className="text-[#644855] mt-0.5 font-light">
              Itens que precisam de reposição pelos artesãos no ponto físico do shopping:{' '}
              {lowStockProducts.map((p) => `${p.name} (${p.stock} un.)`).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tabs: Balances vs Movements History */}
      <div className="flex items-center gap-2 border-b border-[#edd5dc] font-mono-craft">
        <button
          onClick={() => setActiveTab('BALANCES')}
          className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'BALANCES'
              ? 'border-[#2e1420] text-[#2e1420]'
              : 'border-transparent text-[#8e727e] hover:text-[#2e1420]'
          }`}
        >
          Saldo Físico Atual ({visibleProducts.length} itens)
        </button>
        <button
          onClick={() => setActiveTab('MOVEMENTS')}
          className={`pb-3 px-3 text-xs font-semibold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'MOVEMENTS'
              ? 'border-[#2e1420] text-[#2e1420]'
              : 'border-transparent text-[#8e727e] hover:text-[#2e1420]'
          }`}
        >
          Histórico de Movimentações ({visibleMovements.length})
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#edd5dc] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80 font-mono-craft">
          <Search className="w-4 h-4 text-[#8e727e] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por produto, SKU ou marca..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#edd5dc] focus:outline-none bg-white text-[#2e1420]"
          />
        </div>

        {userRole === 'ADMIN' && (
          <div className="w-full sm:w-64 font-mono-craft">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full p-2 text-xs bg-white text-[#2e1420] rounded-xl border border-[#edd5dc] focus:outline-none"
            >
              <option value="all">Todas as Marcas Autorais</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brandName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'BALANCES' ? (
        <div className="bg-[#ffffff] rounded-2xl border border-[#edd5dc] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f6ebef]/70 border-b border-[#edd5dc] text-[#8e727e] uppercase tracking-wider text-[10px] font-mono-craft">
                <tr>
                  <th className="py-3 px-4 font-semibold">Produto</th>
                  <th className="py-3 px-4 font-semibold">SKU</th>
                  <th className="py-3 px-4 font-semibold">Marca Proprietária</th>
                  <th className="py-3 px-4 font-semibold text-right">Preço de Venda</th>
                  <th className="py-3 px-4 font-semibold text-center">Saldo Físico</th>
                  <th className="py-3 px-4 font-semibold text-center">Estoque Mínimo</th>
                  <th className="py-3 px-4 font-semibold">Situação</th>
                  <th className="py-3 px-4 font-semibold text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f6ebef] text-[#2e1420]">
                {visibleProducts.map((prod) => {
                  const partner = partners.find((p) => p.id === prod.partnerId);
                  const isLow = prod.stock <= prod.minStock;
                  const isOut = prod.stock <= 0;

                  return (
                    <tr key={prod.id} className="hover:bg-[#f6ebef]/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-[#2e1420] flex items-center gap-2.5">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                          className="w-8 h-8 rounded-lg object-cover border border-[#edd5dc]"
                        />
                        <span className="max-w-xs truncate font-display text-sm">{prod.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono-craft text-[#8e727e]">{prod.sku}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-[#2e1420]">{partner?.brandName}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold font-mono-craft text-[#2e1420]">
                        R$ {prod.price.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4 text-center font-bold font-mono-craft text-sm text-[#2e1420]">
                        {prod.stock} un.
                      </td>
                      <td className="py-3 px-4 text-center font-mono-craft text-[#8e727e]">
                        {prod.minStock} un.
                      </td>
                      <td className="py-3 px-4 font-mono-craft">
                        {isOut ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#fae8e8] text-[#9b2c2c] text-[10px] font-bold border border-[#f5c6c6]">
                            Esgotado
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#fbebf0] text-[#c85a78] border border-[#fadbe5] text-[10px] font-bold">
                            Estoque Baixo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7] text-[10px] font-bold">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setModalProductId(prod.id);
                            setModalType('ENTRADA');
                            setModalQuantity(5);
                            setModalReason('Reposição pelo artesão no shopping');
                            setIsModalOpen(true);
                          }}
                          className="outline-button !py-1 !px-2.5 text-xs font-mono-craft"
                        >
                          + Repor
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Stock Movements Log (PRD Section 12) */
        <div className="bg-[#ffffff] rounded-2xl border border-[#edd5dc] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f6ebef]/70 border-b border-[#edd5dc] text-[#8e727e] uppercase tracking-wider text-[10px] font-mono-craft">
                <tr>
                  <th className="py-3 px-4 font-semibold">Data / Hora</th>
                  <th className="py-3 px-4 font-semibold">Produto / SKU</th>
                  <th className="py-3 px-4 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold text-center">Anterior</th>
                  <th className="py-3 px-4 font-semibold text-center">Variação</th>
                  <th className="py-3 px-4 font-semibold text-center">Final</th>
                  <th className="py-3 px-4 font-semibold">Motivo / Referência</th>
                  <th className="py-3 px-4 font-semibold">Operador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f6ebef] text-[#2e1420]">
                {visibleMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#8e727e] font-mono-craft">
                      Nenhuma movimentação registrada no período.
                    </td>
                  </tr>
                ) : (
                  visibleMovements.map((mov) => {
                    const isPositive = mov.quantityChanged > 0;
                    return (
                      <tr key={mov.id} className="hover:bg-[#f6ebef]/40 transition-colors">
                        <td className="py-3 px-4 text-[#8e727e] font-mono-craft whitespace-nowrap">
                          {new Date(mov.timestamp).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#2e1420] font-display">{mov.productName}</div>
                          <div className="text-[10px] text-[#8e727e] font-mono-craft">{mov.productSku}</div>
                        </td>
                        <td className="py-3 px-4 font-mono-craft">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              mov.type === 'ENTRADA'
                                ? 'bg-[#dff0e6] text-[#1f4e38] border border-[#bcdbc7]'
                                : mov.type === 'VENDA'
                                ? 'bg-[#e5effa] text-[#1e4a7a] border border-[#c1d9f2]'
                                : mov.type === 'DEVOLUCAO'
                                ? 'bg-[#f4ecf8] text-[#553066] border border-[#ddcbe4]'
                                : 'bg-[#f6ebef] text-[#2e1420] border border-[#edd5dc]'
                            }`}
                          >
                            {mov.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono-craft text-[#8e727e]">{mov.quantityBefore}</td>
                        <td className="py-3 px-4 text-center font-bold font-mono-craft">
                          <span className={isPositive ? 'text-[#3c6b54]' : 'text-[#c85a78]'}>
                            {isPositive ? `+${mov.quantityChanged}` : mov.quantityChanged}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono-craft text-[#2e1420]">
                          {mov.quantityAfter}
                        </td>
                        <td className="py-3 px-4 text-[#644855] max-w-xs truncate font-light">
                          {mov.reason}
                        </td>
                        <td className="py-3 px-4 text-[#8e727e] font-mono-craft">{mov.operatorName}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Movement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2e1420]/60 backdrop-blur-xs p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-md w-full shadow-2xl border border-[#edd5dc] p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-display font-medium text-xl text-[#2e1420]">
              Registrar Movimentação de Estoque
            </h3>
            <p className="text-xs text-[#8e727e] font-light">
              Todas as entradas e saídas físicas do Rio Anil Shopping são auditáveis.
            </p>

            <form onSubmit={handleCreateMovementSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2e1420] mb-1 font-mono-craft">Produto</label>
                <select
                  value={modalProductId}
                  onChange={(e) => setModalProductId(e.target.value)}
                  className="w-full p-2.5 bg-white rounded-xl border border-[#edd5dc] text-xs text-[#2e1420] focus:outline-none"
                >
                  {visibleProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) - Atual: {p.stock} un.
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#2e1420] mb-1 font-mono-craft">Tipo de Movimento</label>
                  <select
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value as any)}
                    className="w-full p-2.5 bg-white rounded-xl border border-[#edd5dc] text-xs text-[#2e1420] focus:outline-none"
                  >
                    <option value="ENTRADA">Entrada / Reposição</option>
                    <option value="DEVOLUCAO">Devolução</option>
                    <option value="AJUSTE">Ajuste de Inventário</option>
                    <option value="PERDA">Perda</option>
                    <option value="AVARIA">Avaria / Defeito</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2e1420] mb-1 font-mono-craft">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={modalQuantity}
                    onChange={(e) => setModalQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 border border-[#edd5dc] rounded-xl text-xs bg-white text-[#2e1420] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2e1420] mb-1 font-mono-craft">Motivo do Lançamento</label>
                <input
                  type="text"
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  required
                  placeholder="Ex: Chegada de novo lote feito no ateliê..."
                  className="w-full p-2.5 border border-[#edd5dc] rounded-xl text-xs bg-white text-[#2e1420] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#edd5dc] font-mono-craft">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="outline-button !py-2 !px-3 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button text-xs font-bold"
                >
                  Salvar Movimentação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
