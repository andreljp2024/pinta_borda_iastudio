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
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Armazenamento Físico Coletivo
          </span>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
            Estoque Compartilhado
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
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
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          Nova Movimentação de Estoque
        </button>
      </div>

      {/* Low Stock Banner Alert if any */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-900 text-sm">
              Alerta de Reposição: {lowStockProducts.length} itens com estoque mínimo atingido
            </h4>
            <p className="text-amber-800 mt-0.5">
              Itens que precisam de reposição pelos artesãos no ponto físico do shopping:{' '}
              {lowStockProducts.map((p) => `${p.name} (${p.stock} un.)`).join(', ')}.
            </p>
          </div>
        </div>
      )}

      {/* Sub-tabs: Balances vs Movements History */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('BALANCES')}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'BALANCES'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Saldo Físico Atual ({visibleProducts.length} itens)
        </button>
        <button
          onClick={() => setActiveTab('MOVEMENTS')}
          className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'MOVEMENTS'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Histórico de Movimentações ({visibleMovements.length})
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por produto, SKU ou marca..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
          />
        </div>

        {userRole === 'ADMIN' && (
          <div className="w-full sm:w-64">
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full p-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:bg-white focus:outline-none"
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
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
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
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {visibleProducts.map((prod) => {
                  const partner = partners.find((p) => p.id === prod.partnerId);
                  const isLow = prod.stock <= prod.minStock;
                  const isOut = prod.stock <= 0;

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-2.5">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                        />
                        <span className="max-w-xs truncate">{prod.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-500">{prod.sku}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-stone-800">{partner?.brandName}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-900">
                        R$ {prod.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-sm text-stone-900">
                        {prod.stock} un.
                      </td>
                      <td className="py-3 px-4 text-center text-stone-500">
                        {prod.minStock} un.
                      </td>
                      <td className="py-3 px-4">
                        {isOut ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                            Esgotado
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            Estoque Baixo
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
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
                          className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
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
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[10px]">
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
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {visibleMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-stone-400">
                      Nenhuma movimentação registrada no período.
                    </td>
                  </tr>
                ) : (
                  visibleMovements.map((mov) => {
                    const isPositive = mov.quantityChanged > 0;
                    return (
                      <tr key={mov.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                          {new Date(mov.timestamp).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-900">{mov.productName}</div>
                          <div className="text-[10px] text-stone-400">{mov.productSku}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              mov.type === 'ENTRADA'
                                ? 'bg-emerald-100 text-emerald-800'
                                : mov.type === 'VENDA'
                                ? 'bg-blue-100 text-blue-800'
                                : mov.type === 'DEVOLUCAO'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {mov.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-stone-500">{mov.quantityBefore}</td>
                        <td className="py-3 px-4 text-center font-bold">
                          <span className={isPositive ? 'text-emerald-700' : 'text-rose-700'}>
                            {isPositive ? `+${mov.quantityChanged}` : mov.quantityChanged}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-stone-900">
                          {mov.quantityAfter}
                        </td>
                        <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                          {mov.reason}
                        </td>
                        <td className="py-3 px-4 text-stone-500">{mov.operatorName}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              Registrar Movimentação de Estoque
            </h3>
            <p className="text-xs text-stone-500">
              Todas as entradas e saídas físicas do Rio Anil Shopping são auditáveis.
            </p>

            <form onSubmit={handleCreateMovementSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Produto</label>
                <select
                  value={modalProductId}
                  onChange={(e) => setModalProductId(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:bg-white"
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
                  <label className="block font-semibold text-stone-700 mb-1">Tipo de Movimento</label>
                  <select
                    value={modalType}
                    onChange={(e) => setModalType(e.target.value as any)}
                    className="w-full p-2.5 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:bg-white"
                  >
                    <option value="ENTRADA">Entrada / Reposição</option>
                    <option value="DEVOLUCAO">Devolução</option>
                    <option value="AJUSTE">Ajuste de Inventário</option>
                    <option value="PERDA">Perda</option>
                    <option value="AVARIA">Avaria / Defeito</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={modalQuantity}
                    onChange={(e) => setModalQuantity(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Motivo do Lançamento</label>
                <input
                  type="text"
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  required
                  placeholder="Ex: Chegada de novo lote feito no ateliê..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-800 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold cursor-pointer shadow-sm"
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
