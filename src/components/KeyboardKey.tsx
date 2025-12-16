interface KeyboardKeyProps {
  children: React.ReactNode;
}

/**
 * Displays content styled as a keyboard key
 */
export function KeyboardKey({ children }: KeyboardKeyProps) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-mono bg-white border border-gray-300 rounded shadow-sm">
      {children}
    </kbd>
  );
}
