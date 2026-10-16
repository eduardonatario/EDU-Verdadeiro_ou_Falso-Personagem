export const translations = {
  pt: {
    questionLabel: (current: number, total: number) => `Questão ${current} de ${total}`,
    trueBtn: 'VERDADEIRO',
    falseBtn: 'FALSO',
    correctFeedback: 'Você Acertou!',
    incorrectFeedback: 'Feedback Explicativo do Criador:',
    nextBtn: 'Próxima Pergunta',
    resultBtn: 'Ver Resultado',
    score: (correct: number, wrong: number) => `Você acertou ${correct} ${correct === 1 ? 'questão' : 'questões'} e errou ${wrong} ${wrong === 1 ? 'questão' : 'questões'}.`,
    restartBtn: 'Reiniciar',
    loading: 'Carregando perguntas...',
    characterWait: 'Aguardando sua resposta...',
    characterSuccess: '🎉 Acertou! Muito bem!',
    characterError: '💡 Feedback explicativo',
    imageAlt: 'Imagem da questão',
    noChar: 'Sem imagem de personagem'
  },
  en: {
    questionLabel: (current: number, total: number) => `Question ${current} of ${total}`,
    trueBtn: 'TRUE',
    falseBtn: 'FALSE',
    correctFeedback: 'You Got It!',
    incorrectFeedback: 'Creator\'s Explanatory Feedback:',
    nextBtn: 'Next Question',
    resultBtn: 'See Result',
    score: (correct: number, wrong: number) => `You got ${correct} ${correct === 1 ? 'question' : 'questions'} right and ${wrong} ${wrong === 1 ? 'question' : 'questions'} wrong.`,
    restartBtn: 'Restart',
    loading: 'Loading questions...',
    characterWait: 'Waiting for your answer...',
    characterSuccess: '🎉 Correct! Well done!',
    characterError: '💡 Explanatory feedback',
    imageAlt: 'Question image',
    noChar: 'No character image'
  }
};
