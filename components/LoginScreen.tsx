
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (fullName: string, licenseNumber: string) => void;
  existingUserMessage: string | null;
}

const TEST_COURSE_PASSWORD = "Helena2016";

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, existingUserMessage }) => {
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleNormalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!fullName || !licenseNumber) {
      setError('Por favor, complete todos los campos.');
      return;
    }
    setError('');
    onLogin(fullName, licenseNumber);
  };

  const handleTestSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!fullName || !licenseNumber) {
      setError('Por favor, complete todos los campos.');
      return;
    }
    if (password !== TEST_COURSE_PASSWORD) {
      setError('Contraseña incorrecta para el curso de prueba.');
      return;
    }
    setError('');
    onLogin(fullName, licenseNumber);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')"}}>
        <div className="w-full max-w-md p-8 space-y-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-green-200">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-green-900">Bienvenido al Curso Interactivo</h1>
            <p className="mt-2 text-lg text-green-700 font-serif italic">"La Ciudadela: Ética en Pediatría"</p>
          </div>

          {existingUserMessage ? (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Acceso Denegado</p>
                <p>{existingUserMessage}</p>
            </div>
          ) : (
            <form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="full-name" className="sr-only">Nombre y Apellido</label>
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Nombre y Apellido"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="license-number" className="sr-only">Número de Colegiado</label>
                  <input
                    id="license-number"
                    name="licenseNumber"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Número de Colegiado"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                  />
                </div>
                 <div>
                  <label htmlFor="password-number" className="sr-only">Contraseña del Curso</label>
                   <p className="text-xs text-gray-600 px-1 py-2 text-center">Para el curso de prueba, ingrese la contraseña.</p>
                  <input
                    id="password-number"
                    name="password"
                    type="password"
                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Contraseña (solo para prueba)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
  
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}
  
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleNormalSubmit}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 transition-transform transform hover:scale-105"
                >
                  Iniciar Curso
                </button>
                <button
                  onClick={handleTestSubmit}
                  className="group relative w-full flex justify-center py-3 px-4 border border-green-500 text-sm font-medium rounded-md text-green-700 bg-transparent hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Iniciar Curso de Prueba
                </button>
              </div>
              <p className="text-center text-xs text-gray-500">
                Solo se permite realizar el curso una vez por participante.
              </p>
            </form>
          )}
        </div>
    </div>
  );
};

export default LoginScreen;
