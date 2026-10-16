import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  Clock, 
  Shuffle, 
  Tag,
  Type,
  Code,
  Download,
  Check,
  ListOrdered,
  Sliders,
  BarChart2,
  Image as ImageIcon,
  Maximize2,
  RotateCcw,
  UserCheck,
  Upload,
  Link,
  Eye,
  Smile
} from 'lucide-react';
import { QuizGame, TrueFalseQuestion, QuizTypography, CharacterConfig } from '../types';
import { DEFAULT_CHARACTER_CONFIG } from '../constants/characterDefaults';
import { playClickSound } from '../utils/audio';
import { generateStandaloneQuizHtml } from '../utils/exportHtml';
import { handleImageFallback } from '../utils/imageUrl';

interface QuestionListProps {
  quiz: QuizGame;
  onUpdateQuiz: (updated: QuizGame) => void;
  onOpenQuestionModal: (question: TrueFalseQuestion | null, index: number) => void;
  onStartPlaying: () => void;
  onDownloadHtml: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  quiz,
  onUpdateQuiz,
  onOpenQuestionModal,
  onDownloadHtml,
}) => {
  const [showTypography, setShowTypography] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const typography: QuizTypography = quiz.typography || {
    questionSize: 'md',
    questionFont: 'sans',
    questionWeight: 'bold',
    buttonSize: 'md',
    buttonFont: 'sans',
    buttonWeight: 'bold',
  };

  const handleCopyEmbedCode = () => {
    playClickSound();
    const html = generateStandaloneQuizHtml(quiz);
    navigator.clipboard.writeText(html);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadHtml = () => {
    playClickSound();
    const html = generateStandaloneQuizHtml(quiz);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Verdadeiro_ou_Falso.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    playClickSound();
    const newQuestions = [...quiz.questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    
    const [moved] = newQuestions.splice(index, 1);
    newQuestions.splice(targetIndex, 0, moved);
    onUpdateQuiz({ ...quiz, questions: newQuestions, updatedAt: new Date().toISOString() });
  };

  const handleDuplicateQuestion = (index: number) => {
    playClickSound();
    const q = quiz.questions[index];
    const duplicated: TrueFalseQuestion = {
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      statement: `${q.statement} (Cópia)`,
    };
    const newQuestions = [...quiz.questions];
    newQuestions.splice(index + 1, 0, duplicated);
    onUpdateQuiz({ ...quiz, questions: newQuestions, updatedAt: new Date().toISOString() });
  };

  const handleDeleteQuestion = (index: number) => {
    playClickSound();
    const confirmed = window.confirm(`Deseja realmente excluir a pergunta #${index + 1}?`);
    if (!confirmed) return;
    const newQuestions = quiz.questions.filter((_, i) => i !== index);
    onUpdateQuiz({ ...quiz, questions: newQuestions, updatedAt: new Date().toISOString() });
  };

  const handleTitleChange = (val: string) => {
    onUpdateQuiz({ ...quiz, title: val, updatedAt: new Date().toISOString() });
  };

  const handleDescChange = (val: string) => {
    onUpdateQuiz({ ...quiz, description: val, updatedAt: new Date().toISOString() });
  };

  const handleThemeTopicChange = (val: string) => {
    onUpdateQuiz({ ...quiz, themeTopic: val, updatedAt: new Date().toISOString() });
  };

  const handleTypographyChange = (key: keyof QuizTypography, value: string) => {
    onUpdateQuiz({
      ...quiz,
      typography: {
        ...typography,
        [key]: value,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const [characterPreviewTab, setCharacterPreviewTab] = useState<'initial' | 'success' | 'error'>('initial');
  const character: CharacterConfig = quiz.character || DEFAULT_CHARACTER_CONFIG;

  const handleCharacterChange = (field: keyof CharacterConfig, value: any) => {
    onUpdateQuiz({
      ...quiz,
      character: {
        ...character,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleCharacterFileUpload = (field: 'initialUrl' | 'successUrl' | 'errorUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (dataUrl) {
        handleCharacterChange(field, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreDefaultCharacter = () => {
    playClickSound();
    onUpdateQuiz({
      ...quiz,
      character: { ...DEFAULT_CHARACTER_CONFIG },
      updatedAt: new Date().toISOString(),
    });
  };

  const currentPreviewCharacterUrl =
    characterPreviewTab === 'initial'
      ? character.initialUrl
      : characterPreviewTab === 'success'
      ? character.successUrl
      : character.errorUrl;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Quiz Configuration Panel with White Background */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Coluna da Esquerda: Título expandido, Subtítulo (1 linha) e Tema expandidos para alinhar à direita */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Campo Título - ampliado para alinhar à altura da coluna direita */}
            <div className="space-y-1.5 flex-1 flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Título
              </label>
              <textarea
                value={quiz.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Título do Quiz..."
                rows={6}
                className="w-full flex-1 min-h-[170px] bg-white border border-slate-300 rounded-xl px-4 py-3 font-display text-xl sm:text-2xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Campo Subtítulo - 1 linha, como no tema */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Subtítulo
              </label>
              <input
                type="text"
                value={quiz.description}
                onChange={(e) => handleDescChange(e.target.value)}
                placeholder="Subtítulo ou breve descrição..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Campo Tema */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>Tema</span>
              </label>
              <input
                type="text"
                value={quiz.themeTopic || ''}
                onChange={(e) => handleThemeTopicChange(e.target.value)}
                placeholder="Ex: Ciência, História, Cinema, Treinamento, Geral..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Coluna da Direita: Opções empilhadas e menu de texto */}
          <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* 1. Tempo Limite */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tempo Limite por Questão</span>
                </label>
                <select
                  value={quiz.timeLimitPerQuestion}
                  onChange={(e) =>
                    onUpdateQuiz({
                      ...quiz,
                      timeLimitPerQuestion: Number(e.target.value),
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium h-9"
                >
                  <option value={0}>Sem limite de tempo</option>
                  <option value={10}>10 segundos</option>
                  <option value={15}>15 segundos</option>
                  <option value={20}>20 segundos</option>
                  <option value={30}>30 segundos</option>
                </select>
              </div>

              {/* 2. Tamanho do Quiz */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tamanho do Quiz</span>
                </label>
                <select
                  value={quiz.quizSize || 'md'}
                  onChange={(e) =>
                    onUpdateQuiz({
                      ...quiz,
                      quizSize: e.target.value as 'sm' | 'md',
                      updatedAt: new Date().toISOString(),
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium h-9"
                >
                  <option value="md">Médio (Padrão)</option>
                  <option value="sm">Pequeno (Compacto)</option>
                </select>
              </div>

              {/* Checkboxes empilhadas */}
              <div className="space-y-1.5 pt-1.5 border-t border-slate-200/80 text-xs">
                {/* 3. Embaralhar Perguntas */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.shuffleQuestions}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        shuffleQuestions: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Embaralhar perguntas</span>
                  </span>
                </label>

                {/* 4. Som */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.soundEnabled}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        soundEnabled: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Efeitos sonoros ativados</span>
                </label>

                {/* 5. Resultado Final */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showFinalResults}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showFinalResults: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span>Exibir estatística completa ao final</span>
                </label>

                {/* 6. Número da Questão */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showQuestionNumber !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showQuestionNumber: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exibir "Questão 1 de 5"</span>
                  </span>
                </label>

                {/* 7. Barra de Progresso */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showProgressBar !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showProgressBar: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exibir barra de progresso</span>
                  </span>
                </label>

                {/* 8. Status de Acertos */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showLiveScore !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showLiveScore: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exibir estatística simples ao final</span>
                  </span>
                </label>

                {/* 9. Revisão de Respostas */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={!!quiz.showAnswerReview}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showAnswerReview: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Exibir "Revisão de Respostas" ao final</span>
                  </span>
                </label>

                {/* Opção Reiniciar */}
                <label className="flex items-center gap-2.5 cursor-pointer text-slate-800 font-medium p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={quiz.showRestartOption !== false}
                    onChange={(e) =>
                      onUpdateQuiz({
                        ...quiz,
                        showRestartOption: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="rounded border-slate-300 bg-white text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exibir opção "Reiniciar" ao final</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Menu de Configuração de Texto na Coluna da Direita */}
            <div className="pt-2 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => setShowTypography(!showTypography)}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-blue-600" />
                  <span>Configuração de Texto</span>
                </span>
                <span className="text-[11px] text-blue-600 font-bold">
                  {showTypography ? 'Ocultar' : 'Exibir'}
                </span>
              </button>

              {showTypography && (
                <div className="mt-2.5 space-y-3 p-3 rounded-xl border border-slate-200 bg-white text-xs">
                  {/* Fonte da Pergunta */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-900 block border-b border-slate-100 pb-1">
                      Fonte da Pergunta
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Tamanho</label>
                        <select
                          value={typography.questionSize}
                          onChange={(e) => handleTypographyChange('questionSize', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sm">Pequeno (16px)</option>
                          <option value="md">Médio (20px)</option>
                          <option value="lg">Grande (24px)</option>
                          <option value="xl">Muito Grande (28px)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Estilo</label>
                        <select
                          value={typography.questionFont}
                          onChange={(e) => handleTypographyChange('questionFont', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sans">Sem Serifa</option>
                          <option value="display">Display</option>
                          <option value="serif">Serifada</option>
                          <option value="mono">Monoespaçada</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px] mb-1">Espessura (Peso)</label>
                      <select
                        value={typography.questionWeight}
                        onChange={(e) => handleTypographyChange('questionWeight', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="normal">Normal (400)</option>
                        <option value="medium">Médio (500)</option>
                        <option value="semibold">Semi-negrito (600)</option>
                        <option value="bold">Negrito (700)</option>
                      </select>
                    </div>
                  </div>

                  {/* Fonte dos Botões V e F */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-900 block border-b border-slate-100 pb-1">
                      Fonte nos Botões V e F
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Tamanho</label>
                        <select
                          value={typography.buttonSize}
                          onChange={(e) => handleTypographyChange('buttonSize', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sm">Pequeno (14px)</option>
                          <option value="md">Médio (16px)</option>
                          <option value="lg">Grande (18px)</option>
                          <option value="xl">Muito Grande (22px)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 text-[10px] mb-1">Estilo</label>
                        <select
                          value={typography.buttonFont}
                          onChange={(e) => handleTypographyChange('buttonFont', e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                        >
                          <option value="sans">Sem Serifa</option>
                          <option value="display">Display</option>
                          <option value="serif">Serifada</option>
                          <option value="mono">Monoespaçada</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[10px] mb-1">Espessura (Peso)</label>
                      <select
                        value={typography.buttonWeight}
                        onChange={(e) => handleTypographyChange('buttonWeight', e.target.value)}
                        className="w-full rounded-md border border-slate-300 bg-white p-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                      >
                        <option value="normal">Normal (400)</option>
                        <option value="semibold">Semi-negrito (600)</option>
                        <option value="bold">Negrito (700)</option>
                        <option value="black">Extra Negrito (900)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Seção da Personagem à Esquerda com 3 URLs: Abertura, Acerto e Erro */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <UserCheck className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900 font-display">
                Personagem Interativa (Espaço à Esquerda do Quiz)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Conforme demonstrado no modelo, a personagem fica posicionada à esquerda do quiz e altera sua imagem conforme a resposta do jogador.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={character.enabled !== false}
                onChange={(e) => handleCharacterChange('enabled', e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-0 cursor-pointer"
              />
              <span>Ativar Personagem</span>
            </label>

            <button
              type="button"
              onClick={handleRestoreDefaultCharacter}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              title="Restaurar imagens padrão da personagem"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Restaurar Padrão</span>
            </button>
            
            <button
              onClick={onDownloadHtml}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-all cursor-pointer"
              title="Baixar arquivo HTML do jogo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar HTML</span>
            </button>
          </div>
        </div>

        {character.enabled !== false && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Coluna da Esquerda: Os 3 Espaços para URLs */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Espaço 1: Imagem de Abertura */}
              <div className="space-y-2 p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">1</span>
                    <span>URL para Imagem de Abertura (Neutra / Inicial)</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Exibida antes da resposta</span>
                </div>
                
                <p className="text-xs text-slate-500">
                  Mostrada quando a pergunta é apresentada ao jogador.
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={character.initialUrl || ''}
                      onChange={(e) => handleCharacterChange('initialUrl', e.target.value)}
                      placeholder="Cole a URL da imagem de abertura (https://...)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                    />
                  </div>

                  <label className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCharacterFileUpload('initialUrl', e)}
                    />
                  </label>

                  {character.initialUrl && (
                    <button
                      type="button"
                      onClick={() => handleCharacterChange('initialUrl', '')}
                      className="p-2 text-xs text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Limpar URL"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Espaço 2: Imagem do Acerto */}
              <div className="space-y-2 p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold">2</span>
                    <span>URL para Imagem do Acerto (Comemorando)</span>
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold">Exibida ao acertar 🎉</span>
                </div>

                <p className="text-xs text-slate-500">
                  Mostrada instantaneamente quando o jogador acerta a resposta.
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={character.successUrl || ''}
                      onChange={(e) => handleCharacterChange('successUrl', e.target.value)}
                      placeholder="Cole a URL da imagem de acerto (https://...)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-emerald-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                    />
                  </div>

                  <label className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-white border border-emerald-300 rounded-lg text-emerald-900 hover:bg-emerald-50 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCharacterFileUpload('successUrl', e)}
                    />
                  </label>

                  {character.successUrl && (
                    <button
                      type="button"
                      onClick={() => handleCharacterChange('successUrl', '')}
                      className="p-2 text-xs text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Limpar URL"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Espaço 3: Imagem do Erro */}
              <div className="space-y-2 p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-200 text-rose-900 text-[10px] font-bold">3</span>
                    <span>URL para Imagem do Erro (Feedback Explicativo)</span>
                  </label>
                  <span className="text-[11px] text-rose-700 font-semibold">Exibida ao errar 💡</span>
                </div>

                <p className="text-xs text-slate-500">
                  Mostrada quando o jogador erra, acompanhando o feedback explicativo.
                </p>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={character.errorUrl || ''}
                      onChange={(e) => handleCharacterChange('errorUrl', e.target.value)}
                      placeholder="Cole a URL da imagem de erro (https://...)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-rose-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-100"
                    />
                  </div>

                  <label className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-white border border-rose-300 rounded-lg text-rose-900 hover:bg-rose-50 cursor-pointer transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5 text-rose-600" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCharacterFileUpload('errorUrl', e)}
                    />
                  </label>

                  {character.errorUrl && (
                    <button
                      type="button"
                      onClick={() => handleCharacterChange('errorUrl', '')}
                      className="p-2 text-xs text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Limpar URL"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Coluna da Direita: Teste Visual e Prévia da Personagem à Esquerda */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col items-center">
              
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Prévia da Personagem</span>
                </span>

                {/* Botões para alternar as 3 expressões */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setCharacterPreviewTab('initial');
                    }}
                    className={`px-2 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                      characterPreviewTab === 'initial'
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Abertura
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setCharacterPreviewTab('success');
                    }}
                    className={`px-2 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                      characterPreviewTab === 'success'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Acerto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setCharacterPreviewTab('error');
                    }}
                    className={`px-2 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                      characterPreviewTab === 'error'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Erro
                  </button>
                </div>
              </div>

              {/* Quadro que emula a moldura da personagem no jogo */}
              <div className="relative w-full max-w-[240px] rounded-2xl bg-[#f2f4f6] p-2 border-2 border-slate-200/90 shadow-sm flex flex-col items-center overflow-hidden">
                <div className="w-full h-80 rounded-xl border-4 border-white bg-slate-50/90 p-2 flex items-center justify-center overflow-hidden shadow-xs">
                  {currentPreviewCharacterUrl ? (
                    <img
                      src={currentPreviewCharacterUrl}
                      alt="Personagem"
                      className="w-auto h-full max-h-76 object-contain drop-shadow-md transition-all duration-200"
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-400 text-xs">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span>Nenhuma imagem configurada para este estado</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center w-full px-1">
                  <span className={`inline-flex items-center justify-center w-full gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-xs ${
                    characterPreviewTab === 'initial'
                      ? 'bg-white text-slate-700 border border-slate-200/90'
                      : characterPreviewTab === 'success'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 text-white'
                  }`}>
                    {characterPreviewTab === 'initial' && 'Estado: Imagem de Abertura'}
                    {characterPreviewTab === 'success' && 'Estado: Imagem do Acerto 🎉'}
                    {characterPreviewTab === 'error' && 'Estado: Imagem do Erro 💡'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-3">
                No jogo, a personagem aparecerá exatamente ao lado esquerdo das perguntas.
              </p>

            </div>

          </div>
        )}
      </div>

      {/* Questions Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Perguntas do Jogo ({quiz.questions.length})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada pergunta conta com gabarito oficial, mensagem de parabéns e feedback de erro.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onOpenQuestionModal(null, quiz.questions.length);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Nova Pergunta</span>
        </button>
      </div>

      {/* Empty State */}
      {quiz.questions.length === 0 ? (
        <div className="text-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 shadow-xs">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">
            Nenhuma pergunta adicionada ainda
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Comece elaborando sua primeira pergunta! Defina o enunciado, se é Verdadeiro ou Falso, e as mensagens de parabéns e feedback de erro.
          </p>
          <button
            onClick={() => {
              playClickSound();
              onOpenQuestionModal(null, 0);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeira Pergunta</span>
          </button>
        </div>
      ) : (
        /* Questions List */
        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="group rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all p-5 sm:p-6 shadow-xs text-slate-900"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                {/* Left: Question info & custom messages */}
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-500">
                      #{index + 1}
                    </span>
                    
                    <span aria-hidden="true" className="text-slate-300">·</span>

                    {/* Official answer badge: Softer green or red */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-black text-xs ${
                        question.isTrue
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}
                    >
                      {question.isTrue ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 stroke-[2.5]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-700 stroke-[2.5]" />
                      )}
                      <span>Gabarito: {question.isTrue ? 'VERDADEIRO' : 'FALSO'}</span>
                    </div>

                    {/* Badge de Imagem se houver */}
                    {question.imageUrl ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[11px]">
                        <ImageIcon className="w-3 h-3" />
                        <span>{question.statementType === 'image' ? 'Apenas Imagem' : 'Imagem + Texto'}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          onOpenQuestionModal({ ...question, statementType: 'both' }, index);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-blue-700 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>+ Adicionar imagem a esta pergunta</span>
                      </button>
                    )}
                  </div>

                  {/* Statement with optional thumbnail */}
                  {question.imageUrl ? (
                    <div className="flex flex-col sm:flex-row items-start gap-3 pt-1">
                      <div className="relative rounded-xl border border-slate-200 shadow-2xs overflow-hidden shrink-0 bg-slate-50">
                        <img
                          key={question.id + '_' + question.imageUrl}
                          src={question.imageUrl}
                          alt="Imagem da pergunta"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageFallback(e, question.imageUrl || '')}
                          className="h-20 w-32 object-contain bg-slate-100/80 p-1 rounded-xl"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        {question.statementType !== 'image' && (
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {question.statement}
                          </h3>
                        )}
                        {question.statementType === 'image' && (
                          <span className="text-xs text-slate-400 italic">
                            (Enunciado composto exclusivamente por imagem)
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {question.statement}
                    </h3>
                  )}

                  {/* Creator's Feedback Messages Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {/* Success Message Card */}
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mensagem de Acerto (Parabéns):</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-normal">
                        {question.successMessage}
                      </p>
                    </div>

                    {/* Error Message Card */}
                    <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Mensagem de Erro (Feedback):</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-normal">
                        {question.errorMessage}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center lg:flex-col gap-1.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenQuestionModal(question, index);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    title="Editar pergunta e mensagens"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-white" />
                    <span>Editar</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleMoveQuestion(index, 'down')}
                      disabled={index === quiz.questions.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDuplicateQuestion(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Duplicar pergunta"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteQuestion(index)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir pergunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Add question bottom shortcut */}
          <div className="pt-2 text-center">
            <button
              onClick={() => {
                playClickSound();
                onOpenQuestionModal(null, quiz.questions.length);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-slate-300 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/30 text-sm font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Adicionar Mais Uma Pergunta</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
