// Loading spinner component
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className = 'h-6 w-6' }: SpinnerProps) {
  return <Loader2 className={`animate-spin text-brand-primary ${className}`} />;
}
