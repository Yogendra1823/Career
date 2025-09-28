
import { QuizQuestion } from './types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Which of these activities do you enjoy the most in your free time?",
    options: [
      "Solving puzzles or playing strategy games",
      "Reading, writing, or debating",
      "Creating art, music, or performing",
      "Organizing events or leading a team"
    ],
    difficulty: 'Easy',
  },
  {
    id: 2,
    question: "Which school subject are you most passionate about?",
    options: [
      "Mathematics or Physics",
      "History or Literature",
      "Art or Music",
      "Economics or Business Studies"
    ],
    difficulty: 'Easy',
  },
  {
    id: 3,
    question: "How do you prefer to solve problems?",
    options: [
      "Through logical, step-by-step analysis",
      "By understanding different perspectives and finding a middle ground",
      "By thinking outside the box and trying new, creative approaches",
      "By collaborating with others and delegating tasks"
    ],
    difficulty: 'Medium',
  },
  {
    id: 4,
    question: "What kind of work environment do you envision for yourself?",
    options: [
      "A research lab or a tech company with a focus on innovation",
      "A library, a government office, or a non-profit organization",
      "A creative studio, a theater, or a design firm",
      "A corporate office with a clear structure and growth path"
    ],
    difficulty: 'Medium',
  },
  {
    id: 5,
    question: "What motivates you more?",
    options: [
      "Understanding how things work and discovering new principles",
      "Helping people and making a positive impact on society",
      "Expressing your ideas and emotions to an audience",
      "Achieving financial success and building a successful enterprise"
    ],
    difficulty: 'Hard',
  }
];
