export default function Card({ children, className = '' }) {
  return (
    <div 
      className={`rounded-2xl p-5 card-hover animate-card ${className}`}
      style={{
        background: 'linear-gradient(145deg, rgba(30, 58, 95, 0.8) 0%, rgba(30, 64, 175, 0.6) 50%, rgba(30, 58, 138, 0.8) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </div>
  );
}
