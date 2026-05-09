import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Brain, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuizzes } from '../lib/gemini';
import { QuizQuestion } from '../types';

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [shortAnswer, setShortAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    loadNewQuiz();
  }, []);

  async function loadNewQuiz() {
    setLoading(true);
    setIsFinished(false);
    setCurrentIndex(0);
    setScore(0);
    try {
      const q = await generateQuizzes();
      setQuestions(q);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const currentQuestion = questions[currentIndex];

  const handleCheckAnswer = () => {
    if (!currentQuestion) return;
    
    let correct = false;
    if (currentQuestion.type === 'multiple-choice') {
      correct = selectedAnswer === currentQuestion.correctAnswer;
    } else {
      correct = shortAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    }
    
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) {
      setScore(s => s + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer('');
      setShortAnswer('');
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Generating your personalized quiz...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-xl mx-auto w-full text-center">
        <section className="glass-card p-12 flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 font-display">Quiz Complete!</h2>
          <p className="text-slate-500 mb-8">Great job! You answered {score} out of {questions.length} questions correctly.</p>
          
          <div className="flex gap-4 w-full">
            <button onClick={loadNewQuiz} className="flex-1 btn-primary">Try Another Quiz</button>
            <button onClick={() => window.location.href = '/'} className="flex-1 btn-secondary">Go to Dashboard</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <Brain size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Learn & Practice</h1>
            <p className="text-sm text-slate-500">Question {currentIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Score</div>
          <div className="text-xl font-bold text-indigo-600">{score} XP</div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-8 md:p-10 mb-8"
        >
          <div className="mb-8">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-4 inline-block uppercase tracking-wider">
              {currentQuestion.type.replace('-', ' ')}
            </span>
            <h2 className="text-2xl font-semibold text-slate-800 leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.type === 'multiple-choice' ? (
              currentQuestion.options?.map((option, idx) => (
                <button 
                  key={idx}
                  onClick={() => !isAnswered && setSelectedAnswer(option)}
                  disabled={isAnswered}
                  className={cn(
                    "w-full p-5 rounded-2xl border-2 text-left transition-all flex justify-between items-center",
                    selectedAnswer === option 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                      : "border-slate-100 hover:border-slate-200 text-slate-600",
                    isAnswered && option === currentQuestion.correctAnswer && "border-emerald-500 bg-emerald-50 text-emerald-700",
                    isAnswered && selectedAnswer === option && selectedAnswer !== currentQuestion.correctAnswer && "border-rose-500 bg-rose-50 text-rose-700"
                  )}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle2 size={20} />}
                  {isAnswered && selectedAnswer === option && selectedAnswer !== currentQuestion.correctAnswer && <XCircle size={20} />}
                </button>
              ))
            ) : (
              <div className="space-y-4">
                <input 
                  type="text"
                  value={shortAnswer}
                  onChange={(e) => setShortAnswer(e.target.value)}
                  disabled={isAnswered}
                  placeholder="Type your answer here..."
                  className={cn(
                    "w-full p-5 rounded-2xl border-2 outline-none transition-all text-xl font-medium",
                    isAnswered 
                      ? (isCorrect ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50")
                      : "border-slate-100 focus:border-indigo-600 focus:bg-indigo-50/10"
                  )}
                />
                {isAnswered && !isCorrect && (
                  <p className="text-sm font-medium text-rose-600">
                    Correct answer: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            {!isAnswered ? (
              <button 
                onClick={handleCheckAnswer}
                disabled={currentQuestion.type === 'multiple-choice' ? !selectedAnswer : !shortAnswer}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Answer
              </button>
            ) : (
              <button onClick={handleNext} className="w-full btn-primary bg-slate-800 hover:bg-slate-900 flex items-center justify-center gap-2">
                {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
              </button>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

      <div className="flex justify-center gap-4">
        <button onClick={loadNewQuiz} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 text-sm font-medium">
          <RotateCcw size={16} /> Reset Practice
        </button>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
