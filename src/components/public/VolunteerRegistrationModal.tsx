import React, { useState } from 'react';
import {
  X,
  Heart,
  Store,
  Sparkles,
  Send,
  CheckCircle2,
  MessageCircle,
  Users,
  Palette,
  ShieldCheck,
} from 'lucide-react';

interface VolunteerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteerRegistrationModal: React.FC<VolunteerRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    instagram: '',
    whatsapp: '',
    craftType: 'Arte, Pintura & Azulejaria',
    modality: 'ambos', // 'loja', 'social', 'ambos'
    availability: 'Turnos flexíveis quinzenais',
    story: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá Keka / Equipe Pinta e Borda!\n\n` +
      `Gostaria de me inscrever como voluntária/expositora no Projeto Social Pinta e Borda:\n\n` +
      `👤 *Nome:* ${formData.name}\n` +
      `🎨 *Ateliê/Marca:* ${formData.brandName || 'Voluntária Individual'}\n` +
      `📸 *Instagram:* ${formData.instagram || 'Não informado'}\n` +
      `📱 *WhatsApp:* ${formData.whatsapp}\n` +
      `🧵 *Técnica/Segmento:* ${formData.craftType}\n` +
      `🤝 *Interesse:* ${
        formData.modality === 'loja'
          ? 'Exposição no Rio Anil Shopping'
          : formData.modality === 'social'
          ? 'Ações Sociais Itinerantes'
          : 'Exposição no Shopping & Ações Sociais'
      }\n` +
      `⏰ *Disponibilidade de Escala:* ${formData.availability}\n` +
      `📝 *História/Apresentação:* ${formData.story}\n\n` +
      `Aguardando retorno para os próximos passos!`
  );

  const directWhatsappUrl = `https://wa.me/5598988289123?text=${whatsappMessage}`;

  const resetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      brandName: '',
      instagram: '',
      whatsapp: '',
      craftType: 'Arte, Pintura & Azulejaria',
      modality: 'ambos',
      availability: 'Turnos flexíveis quinzenais',
      story: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#380c25]/60 backdrop-blur-xs p-4 overflow-y-auto selection:bg-[#fbcfe8] selection:text-[#380c25]">
      <div className="bg-[#ffffff] rounded-3xl max-w-xl w-full shadow-2xl border border-[#fbcfe8] overflow-hidden relative animate-in fade-in zoom-in-95 my-8">
        {/* Header */}
        <div className="bg-[#380c25] text-[#ffffff] p-6 relative border-b border-[#2f0a1e]">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 text-[#c9d9d0] hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#ff7597] text-xs font-semibold uppercase tracking-wider mb-2 font-mono-craft">
            <Sparkles className="w-4 h-4" />
            <span>Cadastro de Voluntárias & Novos Ateliês</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-medium leading-tight text-[#ffffff]">
            Faça Parte do pinta <em className="italic text-[#ff7597]">e</em> borda
          </h3>
          <p className="text-[#c9d9d0] text-xs sm:text-sm mt-1 leading-relaxed font-light">
            Una sua paixão pelo artesanato ao propósito solidário. Exponha no Rio Anil Shopping e participe das nossas ações sociais itinerantes.
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3.5 bg-[#fff0f5]/60 rounded-2xl border border-[#fbcfe8] text-xs text-[#380c25] flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#f43f7e] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>Regra Institucional de Ingresso:</strong> Conforme nosso dossiê, todas as marcas participantes aderem ao voluntariado e ao compromisso solidário mútuo no quiosque colaborativo.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Maria Clara Silva"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Nome do Ateliê / Marca
                  </label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="Ex: Ateliê Sol da Ilha"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                    WhatsApp (com DDD) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="(98) 99999-9999"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Instagram Oficial (@)
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@seuatelie"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Técnica / Segmento Manual *
                  </label>
                  <select
                    value={formData.craftType}
                    onChange={(e) => setFormData({ ...formData, craftType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none"
                  >
                    <option value="Arte, Pintura & Azulejaria">Arte, Pintura & Azulejaria</option>
                    <option value="Biojoias & Acessórios Étnicos">Biojoias & Acessórios Étnicos</option>
                    <option value="Cerâmica Artesanal">Cerâmica Artesanal</option>
                    <option value="Macramê & Cristais">Macramê & Cristais</option>
                    <option value="Velas Botânicas & Saboaria">Velas Botânicas & Saboaria</option>
                    <option value="Crochê & Costura Criativa">Crochê & Costura Criativa</option>
                    <option value="Gastronomia & Temperos">Gastronomia & Temperos Artesanais</option>
                    <option value="Encadernação & Papelaria">Encadernação & Papelaria Afetiva</option>
                    <option value="Outro Artesanato">Outro Artesanato Autoral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                    Como deseja participar? *
                  </label>
                  <select
                    value={formData.modality}
                    onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none"
                  >
                    <option value="ambos">Expor no Shopping & Ações Sociais</option>
                    <option value="loja">Apenas Exposição no Quiosque</option>
                    <option value="social">Apenas Voluntariado nas Ações Sociais</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Disponibilidade para Escala Colaborativa no Shopping
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none"
                >
                  <option value="Turnos semanais regulares (1 a 2 turnos/semana)">Turnos regulares (1 a 2 turnos por semana)</option>
                  <option value="Turnos flexíveis quinzenais">Turnos quinzenais</option>
                  <option value="Aos fins de semana (Sábados/Domingos)">Apenas fins de semana (Sábados ou Domingos)</option>
                  <option value="Disponibilidade sob agendamento">Disponibilidade sob agendamento prévio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#380c25] mb-1 font-mono-craft">
                  Conte um pouco sobre sua trajetória e suas criações
                </label>
                <textarea
                  rows={3}
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Quais materiais você utiliza? Há quanto tempo cria? Por que deseja se juntar ao Pinta e Borda?"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#fbcfe8] bg-white text-xs text-[#380c25] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 font-mono-craft">
                <button
                  type="submit"
                  className="w-full solid-button !py-3.5 text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Pré-Inscrição</span>
                </button>
                <p className="text-[11px] text-[#9b4f76] text-center mt-2 font-sans">
                  A curadoria do projeto entrará em contato para agendar uma conversa e visita ao espaço.
                </p>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#dff0e6] text-[#1f4e38] flex items-center justify-center mx-auto shadow-xs border border-[#bcdbc7]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-2xl font-medium text-[#380c25]">
                  Pré-Inscrição Registrada com Sucesso!
                </h4>
                <p className="text-[#863b63] text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-light">
                  Obrigada pelo interesse em somar com o <strong>Projeto Social Pinta e Borda</strong>.
                  Para acelerar sua avaliação, envie os dados diretamente à coordenação pelo WhatsApp:
                </p>
              </div>

              <div className="p-4 bg-[#fff0f5]/50 rounded-2xl border border-[#fbcfe8] max-w-md mx-auto text-left text-xs space-y-1.5 font-mono-craft text-[#380c25]">
                <div><strong className="text-[#9b4f76]">Artesã:</strong> {formData.name}</div>
                <div><strong className="text-[#9b4f76]">Ateliê:</strong> {formData.brandName || 'Individual'}</div>
                <div><strong className="text-[#9b4f76]">Segmento:</strong> {formData.craftType}</div>
                <div><strong className="text-[#9b4f76]">WhatsApp:</strong> {formData.whatsapp}</div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono-craft">
                <a
                  href={directWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-[#1f4e38] hover:bg-[#2d7353] text-white rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Enviar Agora no WhatsApp da Keka</span>
                </a>

                <button
                  onClick={resetAndClose}
                  className="w-full sm:w-auto outline-button !py-3 !px-5 text-xs font-semibold cursor-pointer"
                >
                  Fechar Janela
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
