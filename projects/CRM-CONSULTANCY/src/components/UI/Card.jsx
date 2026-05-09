export default function Card({ children, className = '', accent, glow }) {
  const classes = ['card', className];
  if (accent) classes.push('card-accent');
  if (glow) classes.push('card-glow');
  
  return (
    <div className={classes.join(' ')}>
      {children}
    </div>
  );
}
