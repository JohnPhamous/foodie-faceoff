export function Button({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={`bg-black text-white text-lg rounded-full px-16 py-3 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
