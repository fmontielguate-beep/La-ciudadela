
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import CourseView from './components/CourseView';
import ResultsScreen from './components/ResultsScreen';
import Spinner from './components/Spinner';
import { generateCourseContent } from './services/geminiService';
import type { User, CourseData, StoredUser } from './types';

const APP_STORAGE_KEY = 'laCiudadelaCourseUsers';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [existingUserMessage, setExistingUserMessage] = useState<string | null>(null);

  const getStoredUsers = (): Record<string, StoredUser> => {
    try {
      const stored = localStorage.getItem(APP_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const setStoredUser = (userKey: string, userData: StoredUser) => {
    const users = getStoredUsers();
    users[userKey] = userData;
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(users));
  };

  const handleLogin = useCallback((fullName: string, licenseNumber: string) => {
    const userKey = `${fullName.toLowerCase().trim()}_${licenseNumber.trim()}`;
    const users = getStoredUsers();
    
    if (users[userKey] && users[userKey].courseTaken) {
      setExistingUserMessage(`El participante ${fullName} (Nº Col. ${licenseNumber}) ya ha completado el curso. Su nota fue ${users[userKey].score || 'N/A'}.`);
      return;
    }
    
    const newUser = { fullName, licenseNumber };
    setUser(newUser);
    setStoredUser(userKey, { ...newUser, courseTaken: false });
    
    setIsLoading(true);
    setError(null);
    generateCourseContent()
      .then(data => {
        setCourseData(data);
      })
      .catch(err => {
        setError(err.message);
        setUser(null); // Log out on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  
  const handleCourseComplete = (score: number) => {
    if (user) {
      const userKey = `${user.fullName.toLowerCase().trim()}_${user.licenseNumber.trim()}`;
      setStoredUser(userKey, { ...user, courseTaken: true, score });
      setFinalScore(score);
      setCourseCompleted(true);
      window.scrollTo(0, 0);
    }
  };

  const handleRestart = () => {
    setUser(null);
    setCourseData(null);
    setCourseCompleted(false);
    setFinalScore(0);
    setError(null);
    setExistingUserMessage(null);
  };

  const renderContent = () => {
    if (!user) {
      return <LoginScreen onLogin={handleLogin} existingUserMessage={existingUserMessage} />;
    }

    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-800">
          <Spinner />
          <p className="mt-4 text-xl font-semibold">Generando tu curso personalizado...</p>
          <p className="mt-2 text-gray-600">Esto puede tardar unos momentos.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 p-4">
          <h2 className="text-2xl font-bold mb-4">Ocurrió un Error</h2>
          <p className="text-center mb-6">{error}</p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-300"
          >
            Volver al Inicio
          </button>
        </div>
      );
    }

    if (courseCompleted && user) {
        const totalQuestions = courseData?.modules.reduce((total, module) => total + module.quiz.length, 0) || 0;
        return <ResultsScreen user={user} score={finalScore} totalQuestions={totalQuestions} onRestart={handleRestart} />;
    }

    if (courseData) {
      return <CourseView courseData={courseData} onComplete={handleCourseComplete} />;
    }

    return null; // Should not be reached
  };

  return <div className="min-h-screen bg-green-100 font-sans">{renderContent()}</div>;
};

export default App;
