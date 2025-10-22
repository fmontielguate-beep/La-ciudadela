
import React from 'react';

interface CertificateProps {
  userName: string;
  licenseNumber: string;
  score: number;
  totalQuestions: number;
  date: string;
}

// FIX: Wrap component in React.forwardRef to allow parent components to pass a ref to the underlying SVG element.
const Certificate = React.forwardRef<SVGSVGElement, CertificateProps>(({ userName, licenseNumber, score, totalQuestions, date }, ref) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const status = percentage >= 60 ? "Aprobado" : "No Aprobado";
  const statusColor = percentage >= 60 ? "#166534" : "#991b1b";

  return (
    <svg ref={ref} width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f0fdf4', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#dcfce7', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#backgroundGradient)" />
      
      <rect x="20" y="20" width="760" height="560" fill="none" stroke="#15803d" strokeWidth="4" rx="15" />
      <path d="M 30 50 L 50 30 L 750 30 L 770 50 L 770 550 L 750 570 L 50 570 L 30 550 Z" fill="none" stroke="#4ade80" strokeWidth="2" />
      
      <text x="400" y="80" fontFamily="Georgia, serif" fontSize="36" fill="#14532d" textAnchor="middle" fontWeight="bold">
        Certificado de Finalización
      </text>
      
      <text x="400" y="140" fontFamily="Helvetica, sans-serif" fontSize="20" fill="#166534" textAnchor="middle">
        Este certificado se otorga a
      </text>
      
      <text x="400" y="200" fontFamily="Georgia, serif" fontSize="40" fill="#14532d" textAnchor="middle" fontWeight="bold">
        {userName}
      </text>
      
      <text x="400" y="240" fontFamily="Helvetica, sans-serif" fontSize="18" fill="#166534" textAnchor="middle">
        Nº de Colegiado: {licenseNumber}
      </text>
      
      <text x="400" y="300" fontFamily="Helvetica, sans-serif" fontSize="20" fill="#166534" textAnchor="middle">
        Por completar satisfactoriamente el curso interactivo
      </text>
      
      <text x="400" y="340" fontFamily="Georgia, serif" fontSize="28" fill="#14532d" textAnchor="middle" fontStyle="italic">
        "La Ciudadela: Ética y Desafíos en Pediatría"
      </text>
      
      <text x="400" y="420" fontFamily="Helvetica, sans-serif" fontSize="24" fill="#166534" textAnchor="middle">
        Calificación Obtenida
      </text>
      
      <text x="400" y="470" fontFamily="Helvetica, sans-serif" fontSize="32" fill="#14532d" textAnchor="middle" fontWeight="bold">
        {score} / {totalQuestions} ({percentage}%)
      </text>
      
       <text x="400" y="510" fontFamily="Helvetica, sans-serif" fontSize="28" fill={statusColor} textAnchor="middle" fontWeight="bold">
        {status}
      </text>
      
      <text x="100" y="560" fontFamily="Helvetica, sans-serif" fontSize="16" fill="#166534" textAnchor="start">
        Fecha: {date}
      </text>

      <text x="700" y="560" fontFamily="Helvetica, sans-serif" fontSize="16" fill="#166534" textAnchor="end">
        Generado por GeminiApp
      </text>
    </svg>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;