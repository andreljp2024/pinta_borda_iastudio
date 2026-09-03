import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Pin,
  Calendar,
  User,
  Trash2,
  CheckCircle2,
  Share2,
  AlertTriangle,
  Info,
  Clock,
  MessageCircle,
  Tag,
  Sparkles,
} from 'lucide-react';
import { CommunityAnnouncement, UserRole } from '../../types';

interface CommunityMuralTabProps {
  announcements: CommunityAnnouncement[];
  userRole: UserRole;
  onCreateAnnouncement: (data: Omit<CommunityAnnouncement, 'id' | 'date'>) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export const CommunityMuralTab: React.FC<CommunityMuralTabProps> = ({
  announcements,
  userRole,
  onCreateAnnouncement,
  onDeleteAnnouncement,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('TODOS');
  const [acknowledgedIds, setAcknowledgedIds] = useState<Record<string, boolean>>({});
  const [showNewModal, setShowNewModal] = useState(false);

  // New Announcement Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityAnnouncement['category']>('SHOPPING');
  const [newPriority, setNewPriority] = useState<CommunityAnnouncement['priority']>('IMPORTANTE');
  const [newAuthor, setNewAuthor] = useState('Coordenação P&B');
  const [newPinned, setNewPinned] = useState(false);

  const categories: Array<{ value: CommunityAnnouncement['category']; label: string }> = [
    { value: 'SHOPPING', label: 'Shopping' },
    { value: 'PLANTAO', label: 'Plantão' },
    { value: 'ESTOQUE', label: 'Estoque' },
    { value: 'EVENTO', label: 'Eventos' },
    { value: 'CURADORIA', label: 'Curadoria' },
    { value: 'GERAL', label: 'Geral' },
  ];

  const handleToggleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShareToWhatsApp = (item: CommunityAnnouncement) => {
    const text = `📢 *AVISO PINTA E BORDA: ${item.title.toUpperCase()}*\n\n${item.content}\n\n_Publicado por ${item.authorName || item.authorRole} em ${new Date(item.date).toLocaleDateString('pt-BR')}_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    onCreateAnnouncement({
      title: newTitle,
      content: newContent,
      category: newCategory,
      priority: newPriority,
      authorName: newAuthor,
      authorRole: 'Coordenação Coletiva',
      pinned: newPinned,
    });

    setNewTitle('');
    setNewContent('');
    setNewCategory('SHOPPING');
    setNewPriority('IMPORTANTE');
    setNewPinned(false);
    setShowNewModal(false);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (filterCategory === 'TODOS') return true;
    return a.category === filterCategory;
  });

  const pinnedItems = filteredAnnouncements.filter((a) => a.pinned);
  const regularItems = filteredAnnouncements.filter((a) => !a.pinned);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-[#fff0f5] via-[#fff5f8] to-[#ffe4ee] p-5 sm:p-6 rounded-3xl border border-[#fbcfe8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white border border-[#fbcfe8] text-[#f43f7e] shadow-2xs">
              <Bell className="w-5 h-5" />
            </span>
            <h3 className="font-display font-medium text-[#380c25] text-lg sm:text-xl">
              Mural da Casa Pinta e Borda
            </h3>
          </div>
          <p className="text-xs text-[#863b63] mt-1 font-light max-w-xl">
            Comunicados oficiais da administração, diretrizes operacionais do Rio Anil Shopping,
            avisos de campanhas coletivas e escalas de plantão.
          </p>
        </div>

        {userRole === 'ADMIN' && (
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="solid-button !py-2 !px-4 text-xs font-mono-craft flex items-center gap-1.5 shadow-sm shrink-0 font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Comunicado</span>
          </button>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 font-mono-craft text-xs">
        <button
          type="button"
          onClick={() => setFilterCategory('TODOS')}
          className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
            filterCategory === 'TODOS'
              ? 'bg-[#380c25] text-white font-bold shadow-2xs'
              : 'bg-white text-[#863b63] hover:bg-[#fff0f5] border border-[#fbcfe8]'
          }`}
        >
          Todos os Avisos ({announcements.length})
        </button>
        {categories.map((cat) => {
          const count = announcements.filter((a) => a.category === cat.value).length;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilterCategory(cat.value)}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === cat.value
                  ? 'bg-[#380c25] text-white font-bold shadow-2xs'
                  : 'bg-white text-[#863b63] hover:bg-[#fff0f5] border border-[#fbcfe8]'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Pinned Announcements */}
      {pinnedItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-mono-craft text-[#f43f7e] font-bold uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 rotate-45" />
            <span>Fixados no Topo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pinnedItems.map((item) => (
              <AnnouncementCard
                key={item.id}
                item={item}
                userRole={userRole}
                isAcknowledged={!!acknowledgedIds[item.id]}
                onToggleAcknowledge={() => handleToggleAcknowledge(item.id)}
                onShare={() => handleShareToWhatsApp(item)}
                onDelete={() => onDeleteAnnouncement(item.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div className="space-y-3">
        {pinnedItems.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-mono-craft text-[#863b63] font-semibold uppercase tracking-wider pt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Mural Geral</span>
          </div>
        )}

        {regularItems.length === 0 && pinnedItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[#fbcfe8] text-[#863b63]">
            <p className="font-mono-craft text-sm">Nenhum comunicado encontrado nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regularItems.map((item) => (
              <AnnouncementCard
                key={item.id}
                item={item}
                userRole={userRole}
                isAcknowledged={!!acknowledgedIds[item.id]}
                onToggleAcknowledge={() => handleToggleAcknowledge(item.id)}
                onShare={() => handleShareToWhatsApp(item)}
                onDelete={() => onDeleteAnnouncement(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-[#fbcfe8] overflow-hidden">
            <div className="p-5 border-b border-[#fbcfe8] bg-[#fff5f8] flex items-center justify-between">
              <h3 className="font-display font-medium text-lg text-[#380c25]">
                Publicar no Mural da Comunidade
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-[#863b63] hover:text-[#380c25] p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Título do Comunicado *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="Ex: Novo Horário de Domingo - Rio Anil Shopping"
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Categoria
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Prioridade
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none font-mono-craft"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="IMPORTANTE">Importante</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Conteúdo do Aviso *
                </label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  rows={4}
                  placeholder="Escreva os detalhes, datas limites ou orientações para as artesãs..."
                  className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Autor / Emissor
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full p-2.5 border border-[#fbcfe8] rounded-xl text-xs bg-white text-[#380c25] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-mono-craft">
                    <input
                      type="checkbox"
                      checked={newPinned}
                      onChange={(e) => setNewPinned(e.target.checked)}
                      className="rounded text-[#f43f7e] focus:ring-[#f43f7e]"
                    />
                    <span className="text-[#380c25] font-semibold">Fixar no Topo</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#fbcfe8] font-mono-craft">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="outline-button !py-1.5 !px-3 text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="solid-button !py-1.5 !px-4 text-xs font-bold"
                >
                  Publicar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface AnnouncementCardProps {
  item: CommunityAnnouncement;
  userRole: UserRole;
  isAcknowledged: boolean;
  onToggleAcknowledge: () => void;
  onShare: () => void;
  onDelete: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  item,
  userRole,
  isAcknowledged,
  onToggleAcknowledge,
  onShare,
  onDelete,
}) => {
  const priorityConfig = {
    URGENTE: {
      border: 'border-l-4 border-l-rose-500 border-rose-200',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      label: 'Urgente',
    },
    IMPORTANTE: {
      border: 'border-l-4 border-l-[#f43f7e] border-[#fbcfe8]',
      badgeBg: 'bg-[#ffe4ee] text-[#db2777] border-[#fbcfe8]',
      label: 'Importante',
    },
    NORMAL: {
      border: 'border-l-4 border-l-[#1f4e38] border-[#bcdbc7]',
      badgeBg: 'bg-[#dff0e6] text-[#1f4e38] border-[#bcdbc7]',
      label: 'Informativo',
    },
  }[item.priority] || {
    border: 'border-[#fbcfe8]',
    badgeBg: 'bg-[#fff0f5] text-[#863b63] border-[#fbcfe8]',
    label: item.priority,
  };

  return (
    <div
      className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between ${priorityConfig.border}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2 font-mono-craft text-[10px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-full font-bold border uppercase ${priorityConfig.badgeBg}`}
            >
              {priorityConfig.label}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#fff0f5] text-[#863b63] border border-[#fbcfe8]">
              {item.category}
            </span>
            {item.pinned && (
              <span className="flex items-center gap-1 text-[#f43f7e] font-bold">
                <Pin className="w-3 h-3 rotate-45" /> Fixado
              </span>
            )}
          </div>

          <span className="text-[#9b4f76] flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.date).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {/* Title */}
        <h4 className="font-display font-medium text-[#380c25] text-base mb-2">
          {item.title}
        </h4>

        {/* Content */}
        <p className="text-xs text-[#863b63] leading-relaxed font-light mb-4 whitespace-pre-line">
          {item.content}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-[#fbcfe8]/70 flex items-center justify-between gap-2 text-xs font-mono-craft">
        <span className="text-[11px] text-[#9b4f76] flex items-center gap-1 truncate">
          <User className="w-3 h-3" /> {item.authorRole}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onShare}
            className="p-1.5 text-[#1f4e38] hover:bg-[#dff0e6] rounded-lg transition-colors"
            title="Compartilhar no WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onToggleAcknowledge}
            className={`px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 transition-colors ${
              isAcknowledged
                ? 'bg-[#dff0e6] text-[#1f4e38] font-bold border border-[#bcdbc7]'
                : 'bg-[#fff0f5] text-[#863b63] hover:text-[#380c25] border border-[#fbcfe8]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isAcknowledged ? 'Ciente ✓' : 'Marcar Ciente'}</span>
          </button>

          {userRole === 'ADMIN' && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
              title="Excluir comunicado"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
