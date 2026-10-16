import React, { useState } from 'react';
import { CheckCircle2, XCircle, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { TrueFalseQuestion, CharacterConfig } from '../types';
import { DEFAULT_CHARACTER_CONFIG } from '../constants/characterDefaults';
import { handleImageFallback } from '../utils/imageUrl';

interface LiveQuestionPreviewProps {
  question: Partial<TrueFalseQuestion>;
  character?: CharacterConfig;
}

export const LiveQuestionPreview: React.FC<LiveQuestionPreviewProps> = ({ question, character }) => {
  const [previewState, setPreviewState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const charConfig = character || DEFAULT_CHARACTER_CONFIG;
  const showCharacter = charConfig.enabled !== false;

  let activeCharacterImage = charConfig.initialUrl || DEFAULT_CHARACTER_CONFIG.initialUrl;
  let charBadge = 'Aguardando resposta';

  if (previewState === 'correct') {
    activeCharacterImage = charConfig.successUrl || DEFAULT_CHARACTER_CONFIG.successUrl;
    charBadge = '🎉 Acertou!';
  } else if (previewState === 'wrong') {
    activeCharacterImage = charConfig.errorUrl || DEFAULT_CHARACTER_CONFIG.errorUrl;
    charBadge = '💡 Feedback';
  }

  const statement = question.statement?.trim() || 'Sua pergunta ou afirmação aparecerá aqui...';
  const statementType = question.statementType || (question.imageUrl && !question.statement ? 'image' : question.imageUrl ? 'both' : 'text');
  const imageUrl = question.imageUrl;
  const isTrue = question.isTrue ?? true;
  const successMsg = question.successMessage?.trim() || 'Mensagem de parabéns elaborada pelo criador para quem acertar.';
  const errorMsg = question.errorMessage?.trim() || 'Feedback explicativo elaborado pelo criador para quem errar.';

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-inner">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Prévia em Tempo Real com a Personagem
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setPreviewState('idle')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-bold ${
              previewState === 'idle' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Abertura
          </button>
          <button
            type="button"
            onClick={() => setPreviewState('correct')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-bold ${
              previewState === 'correct' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Acerto
          </button>
          <button
            type="button"
            onClick={() => setPreviewState('wrong')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer font-bold ${
              previewState === 'wrong' ? 'bg-rose-700 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Erro
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${showCharacter ? 'sm:grid-cols-12 gap-4' : ''} items-stretch`}>
        
        {/* Personagem na prévia */}
        {showCharacter && (
          <div className="sm:col-span-4 flex flex-col">
            <div className="h-full rounded-2xl bg-[#f2f4f6] p-2 border-2 border-slate-200/90 flex flex-col items-center justify-between min-h-[220px]">
              <div className="w-full flex-1 rounded-xl border-2 border-white bg-slate-50/90 p-1.5 flex items-center justify-center overflow-hidden">
                <img
                  key={activeCharacterImage}
                  src={activeCharacterImage}
                  alt="Personagem na prévia"
                  className="w-auto h-full max-h-56 object-contain drop-shadow transition-all duration-200"
                />
              </div>
              <span className={`mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                previewState === 'idle'
                  ? 'bg-white text-slate-700 border border-slate-200 shadow-2xs'
                  : previewState === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 text-white'
              }`}>
                {charBadge}
              </span>
            </div>
          </div>
        )}

        {/* Mock Player Card */}
        <div className={`${showCharacter ? 'sm:col-span-8' : ''} relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 transition-all text-slate-900 shadow-xs flex flex-col justify-between`}>
          <div>
            <div className="text-xs text-slate-500 mb-2 font-medium">
              <span>Gabarito: <strong className={isTrue ? 'text-emerald-700' : 'text-rose-700'}>{isTrue ? 'Verdadeiro' : 'Falso'}</strong></span>
            </div>

            {/* Statement area: Image Only, Image + Text, or Text Only */}
            <div className="mb-4 space-y-2">
              {Boolean(imageUrl && imageUrl.trim() && (statementType === 'image' || statementType === 'both')) && imageUrl && (
                <div className="w-full h-44 sm:h-52 flex items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-100/90 p-0 shadow-2xs">
                  <img
                    key={imageUrl.trim()}
                    src={imageUrl.trim()}
                    alt="Enunciado"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageFallback(e, imageUrl.trim())}
                    className="h-full w-full object-cover select-none block"
                  />
                </div>
              )}

              {statementType !== 'image' && (
                <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  {statement}
                </h4>
              )}
            </div>

            {/* Buttons Mockup */}
            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-xs transition-all bg-emerald-100/90 text-slate-900 border-2 border-emerald-300 ${
                  previewState === 'correct' ? 'ring-2 ring-emerald-300 shadow-xs' : ''
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-800 stroke-[2.5]" />
                <span>VERDADEIRO</span>
              </div>

              <div
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl font-bold text-xs transition-all bg-rose-100/90 text-slate-900 border-2 border-rose-300 ${
                  previewState === 'wrong' ? 'ring-2 ring-rose-300 shadow-xs' : ''
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-800 stroke-[2.5]" />
                <span>FALSO</span>
              </div>
            </div>

            {/* Dynamic Simulated Feedback */}
            {previewState === 'correct' && (
              <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-3 animate-in fade-in duration-200 text-xs">
                <div className="flex items-center gap-1.5 mb-1 text-emerald-900 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Mensagem de Acerto (Parabéns):</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-normal">
                  {successMsg}
                </p>
              </div>
            )}

            {previewState === 'wrong' && (
              <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-3 animate-in fade-in duration-200 text-xs">
                <div className="flex items-center gap-1.5 mb-1 text-rose-900 font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                  <span>Mensagem de Erro (Feedback Explicativo):</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-normal">
                  {errorMsg}
                </p>
              </div>
            )}

            {previewState === 'idle' && (
              <div className="text-center py-1 text-[11px] text-slate-500 italic">
                Clique em "Acerto" ou "Erro" acima para testar como sua mensagem e a personagem reagirão.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
