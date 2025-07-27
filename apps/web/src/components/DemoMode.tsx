'use client';

interface DemoModeProps {
  onEnterDemo: () => void;
}

export function DemoMode({ onEnterDemo }: DemoModeProps) {
  return (
    <div className="mt-4 text-center">
      <button
        onClick={onEnterDemo}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
      >
        Try Demo Mode
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Skip authentication and explore the chat interface
      </p>
    </div>
  );
}