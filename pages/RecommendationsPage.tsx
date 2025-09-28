
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getCareerRecommendation } from '../services/geminiService';
import { CareerRecommendation, QuizResult } from '../types';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';

const RecommendationsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, saveQuizResult } = useAuth();
  const [recommendation, setRecommendation] = useState<CareerRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const answers = location.state?.answers;

    if (answers) {
      const fetchRecommendation = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await getCareerRecommendation(answers);
          setRecommendation(result);

          const newQuizResult: QuizResult = {
            date: new Date().toISOString(),
            answers: answers,
            recommendation: result,
          };
          saveQuizResult(newQuizResult);
          navigate(location.pathname, { replace: true, state: {} });

        } catch (err) {
          let errorMessage = "An unknown error occurred while generating your recommendation.";
          if (err instanceof Error) {
             errorMessage = `There was an issue generating your recommendation. Please try the quiz again. Error: ${err.message}`;
          }
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      };
      fetchRecommendation();
    } 
    else if (user?.quizHistory && user.quizHistory.length > 0) {
      const latestResult = user.quizHistory[user.quizHistory.length - 1];
      setRecommendation(latestResult.recommendation);
      setLoading(false);
    } 
    else {
      setLoading(false);
    }
  }, [location, user, saveQuizResult, navigate]);

  if (loading) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4 dark:text-white">Analyzing your results...</h1>
        <p className="dark:text-gray-300">Our AI is crafting your personalized recommendation.</p>
        <div className="mt-4 animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-error mb-4">An Error Occurred</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <Link to="/quiz" className="bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors">
          Try the Quiz Again
        </Link>
      </Card>
    );
  }

  if (!recommendation) {
    return (
      <Card className="text-center max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-primary mb-4">Let's Find Your Path!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          It looks like you haven't taken the career quiz yet. Complete the quiz to receive your personalized recommendation.
        </p>
        <Link to="/quiz" className="bg-primary text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors">
          Take the Quiz Now
        </Link>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <h1 className="text-4xl font-bold text-center mb-2">Your AI-Powered Recommendation</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Based on your quiz answers, here's what we suggest for you.</p>

        <div className="bg-secondary/10 dark:bg-secondary/20 p-6 rounded-lg text-center mb-6">
          <h2 className="text-lg font-semibold text-secondary dark:text-green-300">Recommended Stream</h2>
          <p className="text-5xl font-extrabold text-secondary dark:text-green-300">{recommendation.recommendedStream}</p>
          <div className="mt-2 text-sm text-secondary dark:text-green-400">Confidence: {(recommendation.confidenceScore * 100).toFixed(0)}%</div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Why We Recommend This</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{recommendation.reasoning}</p>
        </div>

        {recommendation.feedback && (
            <div className="mb-6 bg-gray-100 dark:bg-neutral-600 p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">How Your Answers Shaped This</h3>
                <p className="text-gray-700 dark:text-gray-300 italic">{recommendation.feedback}</p>
            </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-2">Suggested Subjects</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {recommendation.suggestedSubjects.map(subject => <li key={subject}>{subject}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Potential Career Paths</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {recommendation.potentialCareers.map(career => <li key={career}>{career}</li>)}
            </ul>
          </div>
        </div>

        <div className="text-center border-t border-gray-200 dark:border-neutral-600 pt-6">
            <h3 className="text-lg font-semibold mb-2">Next Step</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Explore colleges that offer programs in the {recommendation.recommendedStream} stream.</p>
            <Link 
                to={`/colleges?program=${recommendation.recommendedStream}`}
                className="bg-secondary text-white font-bold py-2 px-6 rounded-full hover:bg-emerald-600 transition-colors"
            >
                Find {recommendation.recommendedStream} Colleges
            </Link>
        </div>
      </Card>
      
      {user?.quizHistory && user.quizHistory.length > 1 && (
        <Card className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Quiz History</h2>
          <div className="space-y-4">
            {[...user.quizHistory].reverse().map((result) => (
              <div key={result.date} className={`border p-4 rounded-lg transition-all ${recommendation?.reasoning === result.recommendation.reasoning ? 'bg-primary/10 border-primary dark:border-primary' : 'hover:bg-gray-50 dark:hover:bg-neutral-600 border-gray-200 dark:border-neutral-600'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-neutral dark:text-gray-200">
                      Quiz from: <span className="font-normal">{new Date(result.date).toLocaleString()}</span>
                    </p>
                    <p className="font-semibold text-neutral dark:text-gray-200">
                      Recommendation: <span className="font-bold text-secondary">{result.recommendation.recommendedStream}</span>
                    </p>
                  </div>
                  {recommendation?.reasoning !== result.recommendation.reasoning && (
                      <button onClick={() => setRecommendation(result.recommendation)} className="text-sm bg-primary text-white font-semibold py-1 px-3 rounded-md hover:bg-indigo-700 transition-colors">
                        View Details
                      </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default RecommendationsPage;
