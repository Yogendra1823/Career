
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUIZ_QUESTIONS } from '../constants';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { QuizQuestion } from '../types';

type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

const QuizPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [difficulty, setDifficulty] = useState<QuizDifficulty | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const getStorageKey = () => (user ? `quizProgress_${user.id}` : null);
  
  const filteredQuestions = useMemo(() => {
    if (!difficulty) return [];
    return QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
  }, [difficulty]);


  // Effect to load saved progress when the component mounts
  useEffect(() => {
    if (!user) {
        setIsLoaded(true);
        return; 
    }
    const storageKey = getStorageKey();
    if (!storageKey) {
        setIsLoaded(true);
        return;
    }

    try {
      const savedProgressRaw = localStorage.getItem(storageKey);
      if (savedProgressRaw) {
        const savedProgress = JSON.parse(savedProgressRaw);
        if (
          Array.isArray(savedProgress.answers) &&
          typeof savedProgress.currentQuestionIndex === 'number' &&
          savedProgress.difficulty
        ) {
          setDifficulty(savedProgress.difficulty);
          setAnswers(savedProgress.answers);
          setCurrentQuestionIndex(savedProgress.currentQuestionIndex);
        }
      }
    } catch (error) {
      console.error("Failed to parse quiz progress from localStorage", error);
      localStorage.removeItem(storageKey);
    }
    setIsLoaded(true);
  }, [user]);

  const clearProgressAndRestart = () => {
    const storageKey = getStorageKey();
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setDifficulty(null);
  };

  const handleDifficultySelect = (level: QuizDifficulty) => {
    setDifficulty(level);
  }

  const handleAnswerSelect = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    const storageKey = getStorageKey();

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      if (storageKey) {
        const progress = { currentQuestionIndex: nextIndex, answers: newAnswers, difficulty };
        localStorage.setItem(storageKey, JSON.stringify(progress));
      }
    } else {
      if (storageKey) {
        localStorage.removeItem(storageKey);
      }
      const formattedAnswers = filteredQuestions.map((q, i) => ({
        question: q.question,
        answer: newAnswers[i],
      }));
      navigate('/recommendations', { state: { answers: formattedAnswers } });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!difficulty) {
      return (
          <div className="max-w-2xl mx-auto">
              <Card>
                  <h1 className="text-3xl font-bold text-center mb-4">Select Quiz Difficulty</h1>
                  <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Choose a difficulty level that suits you.</p>
                  <div className="flex flex-col space-y-4">
                      <button onClick={() => handleDifficultySelect('Easy')} className="w-full text-left p-4 border border-gray-300 dark:border-neutral-500 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                          <h3 className="font-bold text-lg">Easy</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Quick and simple questions to get a baseline recommendation.</p>
                      </button>
                      <button onClick={() => handleDifficultySelect('Medium')} className="w-full text-left p-4 border border-gray-300 dark:border-neutral-500 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                          <h3 className="font-bold text-lg">Medium</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">More nuanced questions for a balanced assessment.</p>
                      </button>
                      <button onClick={() => handleDifficultySelect('Hard')} className="w-full text-left p-4 border border-gray-300 dark:border-neutral-500 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                          <h3 className="font-bold text-lg">Hard</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">In-depth questions for a more precise and detailed recommendation.</p>
                      </button>
                  </div>
              </Card>
          </div>
      )
  }

  const currentQuestion = filteredQuestions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold">Career Discovery Quiz</h1>
            <button 
              onClick={clearProgressAndRestart}
              className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              aria-label="Restart the quiz"
            >
              Restart Quiz
            </button>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Answer a few questions to find your path. ({difficulty} Level)</p>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-neutral-600">
          <div className="bg-secondary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-right mb-6">Question {currentQuestionIndex + 1} of {filteredQuestions.length}</p>

        <div>
          <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className="w-full text-left p-4 border border-gray-300 dark:border-neutral-500 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizPage;
