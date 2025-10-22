
import React, { useState, useMemo } from 'react';
import type { CourseData, Module as ModuleType, QuizQuestion } from '../types';
import ProgressBar from './ProgressBar';

interface CourseViewProps {
  courseData: CourseData;
  onComplete: (score: number) => void;
}

const Module: React.FC<{ module: ModuleType }> = ({ module }) => (
  <div className="prose prose-lg max-w-none text-gray-800 bg-white p-8 rounded-xl shadow-md border border-green-200">
    <h2 className="text-3xl font-bold text-green-900 border-b-2 border-green-200 pb-2 mb-4">{module.title}</h2>
    <p className="text-base italic text-green-700">{module.summary}</p>
    <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br />') }} />
  </div>
);

const Quiz: React.FC<{
  questions: QuizQuestion[];
  moduleIndex: number;
  onQuizComplete: (answers: number[]) => void;
}> = ({ questions, moduleIndex, onQuizComplete }) => {
  const [currentAnswers, setCurrentAnswers] = useState<number[]>(Array(questions.length).fill(-1));

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...currentAnswers];
    newAnswers[questionIndex] = optionIndex;
    setCurrentAnswers(newAnswers);
  };
  
  const allAnswered = useMemo(() => currentAnswers.every(ans => ans !== -1), [currentAnswers]);

  return (
    <div className="mt-8 bg-green-50 p-8 rounded-xl shadow-inner border border-green-200">
      <h3 className="text-2xl font-bold text-green-800 mb-6">Test de Autoevaluación</h3>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 bg-white p-6 rounded-lg shadow">
          <p className="font-semibold text-lg text-gray-800 mb-4">{qIndex + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((option, oIndex) => (
              <label key={oIndex} className="flex items-center p-3 rounded-md hover:bg-green-100 transition-colors cursor-pointer border">
                <input
                  type="radio"
                  name={`question-${moduleIndex}-${qIndex}`}
                  value={oIndex}
                  checked={currentAnswers[qIndex] === oIndex}
                  onChange={() => handleOptionChange(qIndex, oIndex)}
                  className="form-radio h-5 w-5 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-4 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="text-center mt-8">
        <button
          onClick={() => onQuizComplete(currentAnswers)}
          disabled={!allAnswered}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
        >
          Siguiente Módulo
        </button>
      </div>
    </div>
  );
};


const CourseView: React.FC<CourseViewProps> = ({ courseData, onComplete }) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  
  const handleQuizComplete = (moduleAnswers: number[]) => {
    const module = courseData.modules[currentModuleIndex];
    const moduleScore = module.quiz.reduce((score, question, index) => {
      return score + (question.correctAnswer === moduleAnswers[index] ? 1 : 0);
    }, 0);

    const newTotalScore = totalScore + moduleScore;
    setTotalScore(newTotalScore);
    
    if (currentModuleIndex < courseData.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete(newTotalScore);
    }
  };

  const currentModule = courseData.modules[currentModuleIndex];
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <ProgressBar current={currentModuleIndex + 1} total={courseData.modules.length} />
      <Module module={currentModule} />
      <Quiz
        key={currentModuleIndex}
        questions={currentModule.quiz}
        moduleIndex={currentModuleIndex}
        onQuizComplete={handleQuizComplete}
      />
    </div>
  );
};

export default CourseView;
