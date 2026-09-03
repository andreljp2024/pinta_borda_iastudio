import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Tag,
  Sparkles,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { handleImageError, FALLBACK_PRODUCT_IMAGE } from '../../utils/imageFallbacks';

export const ProductsView: React.FC = () => {
  const {
    products,
    partners,
    categories,
    userRole,
    currentPartner,
    addProduct,
    updateProduct,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(
    userRole === 'PARTNER' && currentPartner ? currentPartner.id : 'all'
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPartnerId, setFormPartnerId] = useState(
    userRole === 'PARTNER' && currentPartner ? currentPartner.id : partners[0]?.id || ''
  );
  const [formCategoryId, setFormCategoryId] = useState(categories[0]?.id || '');
  const [formPrice, setFormPrice] = useState<number>(50);
  const [formStock, setFormStock] = useState<number>(10);
  const [formMinStock, setFormMinStock] = useState<number>(3);
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPublished, setFormIsPublished] = useState(true);

  // Scoped list
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      if (userRole === 'PARTNER' && currentPartner && p.partnerId !== currentPartner.id) {
        return false;
      }
      if (selectedPartnerId !== 'all' && p.partnerId !== selectedPartnerId) {
        return false;
      }
      if (selectedCategoryId !== 'all' && p.categoryId !== selectedCategoryId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const brand = partners.find((pt) => pt.id === p.partnerId)?.brandName.toLowerCase() || '';
        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || brand.includes(q);
      }
      return true;
    });
  }, [products, partners, searchQuery, selectedPartnerId, selectedCategoryId, userRole, currentPartner]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSku(`SKU-${Math.floor(100 + Math.random() * 900)}`);
    setFormPartnerId(userRole === 'PARTNER' && currentPartner ? currentPartner.id : partners[0]?.id || '');
    setFormCategoryId(categories[0]?.id || '');
    setFormPrice(45);
    setFormStock(10);
    setFormMinStock(3);
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80');
    setFormIsFeatured(false);
    setFormIsPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormPartnerId(prod.partnerId);
    setFormCategoryId(prod.categoryId);
    setFormPrice(prod.price);
    setFormStock(prod.stock);
    setFormMinStock(prod.minStock);
    setFormDescription(prod.description);
    setFormImageUrl(prod.imageUrl);
    setFormIsFeatured(prod.isFeatured);
    setFormIsPublished(prod.isPublished);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Informe o nome do produto.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        sku: formSku,
        partnerId: formPartnerId,
        categoryId: formCategoryId,
        price: formPrice,
        stock: formStock,
        minStock: formMinStock,
        description: formDescription,
        imageUrl: formImageUrl,
        isFeatured: formIsFeatured,
        isPublished: formIsPublished,
      });
    } else {
      addProduct({
        name: formName,
        sku: formSku,
        partnerId: formPartnerId,
        categoryId: formCategoryId,
        price: formPrice,
        stock: formStock,
        minStock: formMinStock,
        description: formDescription,
        imageUrl: formImageUrl,
        isFeatured: formIsFeatured,
        isPublished: formIsPublished,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  const handleTogglePublish = (prod: Product) => {
    updateProduct(prod.id, { isPublished: !prod.isPublished });
  };

  const handleToggleFeatured = (prod: Product) => {
    updateProduct(prod.id, { isFeatured: !prod.isFeatured });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#f43f7e] font-mono-craft">
            Catálogo & Acervo
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#380c25]">
            Gestão de Produtos
          </h2>
          <p className="text-xs sm:text-sm text-[#9b4f76] mt-1 font-light">
            Cadastre peças autorais, configure fotos, preços e publicação na vitrine física do Rio Anil Shopping.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="solid-button text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#ff7597]" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#ffffff] rounded-2xl p-4 border border-[#fbcfe8] shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between font-mono-craft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#9b4f76] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, SKU ou marca..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#fbcfe8] focus:outline-none bg-white text-[#380c25]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto font-mono-craft">
          {userRole === 'ADMIN' && (
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="p-2 text-xs bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] focus:outline-none"
            >
              <option value="all">Todas as Marcas</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brandName}
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="p-2 text-xs bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] focus:outline-none"
          >
            <option value="all">Todas as Categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#ffffff] rounded-2xl border border-[#fbcfe8] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fff0f5]/70 border-b border-[#fbcfe8] text-[#9b4f76] uppercase tracking-wider text-[10px] font-mono-craft">
              <tr>
                <th className="py-3 px-4 font-semibold">Produto</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold">Marca Proprietária</th>
                <th className="py-3 px-4 font-semibold text-right">Preço</th>
                <th className="py-3 px-4 font-semibold text-center">Estoque</th>
                <th className="py-3 px-4 font-semibold text-center">Destaque</th>
                <th className="py-3 px-4 font-semibold text-center">Publicado</th>
                <th className="py-3 px-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#fff0f5] text-[#380c25]">
              {visibleProducts.map((prod) => {
                const partner = partners.find((p) => p.id === prod.partnerId);
                return (
                  <tr key={prod.id} className="hover:bg-[#fff0f5]/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-[#380c25] flex items-center gap-2.5">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, FALLBACK_PRODUCT_IMAGE)}
                        className="w-9 h-9 rounded-lg object-cover border border-[#fbcfe8]"
                      />
                      <div>
                        <div className="max-w-xs truncate font-display text-sm">{prod.name}</div>
                        <div className="text-[10px] text-[#9b4f76] font-light">
                          {prod.description?.substring(0, 40)}...
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono-craft text-[#9b4f76]">{prod.sku}</td>
                    <td className="py-3 px-4 font-medium text-[#380c25]">
                      {partner?.brandName || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold font-mono-craft text-[#380c25]">
                      R$ {prod.price.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono-craft">
                      <span
                        className={`font-bold ${
                          prod.stock <= prod.minStock ? 'text-[#f43f7e]' : 'text-[#380c25]'
                        }`}
                      >
                        {prod.stock} un.
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                          prod.isFeatured
                            ? 'bg-[#fff0f5] text-[#f43f7e]'
                            : 'bg-stone-100 text-stone-400 hover:text-stone-700'
                        }`}
                        title="Alternar destaque no catálogo público"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(prod)}
                        className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                          prod.isPublished
                            ? 'bg-[#dff0e6] text-[#1f4e38]'
                            : 'bg-stone-100 text-stone-400 hover:text-stone-700'
                        }`}
                        title="Alternar visibilidade na vitrine física"
                      >
                        {prod.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 text-[#863b63] hover:text-[#380c25] rounded-lg hover:bg-[#fff0f5] transition-colors cursor-pointer"
                        title="Editar produto"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4">
          <div className="bg-[#ffffff] rounded-3xl max-w-lg w-full shadow-2xl border border-[#fbcfe8] p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-medium text-xl text-[#380c25]">
              {editingProduct ? 'Editar Produto Autoral' : 'Novo Produto para a Loja'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Nome da Peça</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    placeholder="Ex: Vestido Casinha de Abelha em Linho"
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Código SKU</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    required
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono-craft bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                    required
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-bold font-mono-craft bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Marca Proprietária</label>
                  <select
                    value={formPartnerId}
                    onChange={(e) => setFormPartnerId(e.target.value)}
                    disabled={userRole === 'PARTNER'}
                    className="w-full p-2.5 bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] text-xs focus:outline-none"
                  >
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.brandName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Categoria</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-white text-[#380c25] rounded-xl border border-[#fbcfe8] text-xs focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Estoque Físico Inicial</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none font-mono-craft"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Estoque Mínimo (Alerta)</label>
                  <input
                    type="number"
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none font-mono-craft"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">URL da Imagem</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs font-mono-craft bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">Descrição Detalhada da Peça</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  placeholder="Conte sobre materiais, técnicas manuais e especificações..."
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-2 font-mono-craft">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-[#f43f7e] focus:ring-[#f43f7e]"
                  />
                  <span className="font-semibold text-[#380c25]">Destaque na Vitrine</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="rounded text-[#3c6b54] focus:ring-[#3c6b54]"
                  />
                  <span className="font-semibold text-[#380c25]">Publicado no Catálogo</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#fbcfe8] font-mono-craft">
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
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Peça'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
