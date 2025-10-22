
import React, { useRef, useCallback } from 'react';
import type { User } from '../types';
import Certificate from './Certificate';

interface ResultsScreenProps {
  user: User;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ user, score, totalQuestions, onRestart }) => {
  const certificateRef = useRef<SVGSVGElement>(null);
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const today = new Date().toLocaleDateString('es-ES');

  const handleDownload = useCallback(() => {
    if (certificateRef.current) {
      const svg = certificateRef.current;
      const serializer = new XMLSerializer();
      const source = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(svg);
      const image = new Image();
      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(image, 0, 0, 800, 600);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = `Certificado_${user.fullName.replace(/\s/g, '_')}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      };
      image.src = url;
    }
  }, [user.fullName]);

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl border border-green-200">
      <h1 className="text-4xl font-bold text-green-900 text-center mb-4">¡Curso Finalizado!</h1>
      <p className="text-xl text-center text-green-700 mb-8">
        Felicitaciones, {user.fullName}, has completado el curso.
      </p>

      <div className="text-center bg-green-100 p-6 rounded-lg mb-8">
        <h2 className="text-2xl font-semibold text-green-800">Tu Resultado Final</h2>
        <p className="text-6xl font-bold text-green-900 my-4">
          {score} / {totalQuestions}
        </p>
        <p className="text-3xl font-medium text-green-700">({percentage}%)</p>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-green-800 text-center mb-4">Vista Previa del Certificado</h3>
         <div className="flex justify-center border-2 border-dashed border-green-300 rounded-lg p-4 bg-green-50">
            {/* FIX: Moved ref from the wrapping div to the Certificate component directly. This matches the ref's type (SVGSVGElement) with the component that will receive it. */}
            <Certificate
                ref={certificateRef}
                userName={user.fullName}
                licenseNumber={user.licenseNumber}
                score={score}
                totalQuestions={totalQuestions}
                date={today}
            />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleDownload}
          className="w-full max-w-sm bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 text-lg shadow-lg"
        >
          Descargar Certificado (PNG)
        </button>
        <button
          onClick={onRestart}
          className="w-full max-w-sm bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;