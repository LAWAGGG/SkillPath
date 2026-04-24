export default function Skeleton({ className = "", variant = "rectangular", width, height }) {
  const baseClasses = "animate-pulse bg-slate-200 dark:bg-slate-700/50";
  
  const variants = {
    text: "h-3 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant] || variants.rectangular} ${className}`}
      style={{ 
        width: width || undefined, 
        height: height || undefined 
      }}
    />
  );
}
