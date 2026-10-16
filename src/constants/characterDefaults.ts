import charIdle from '../assets/images/char_educator_idle_1792000022694.jpg';
import charCorrect from '../assets/images/char_educator_correct_1792000034916.jpg';
import charWrong from '../assets/images/char_educator_wrong_1792000047976.jpg';
import { CharacterConfig } from '../types';

export const DEFAULT_CHARACTER_CONFIG: CharacterConfig = {
  enabled: true,
  name: 'Sofia (Educadora)',
  initialUrl: charIdle,
  successUrl: charCorrect,
  errorUrl: charWrong,
};

