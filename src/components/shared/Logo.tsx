
import Link from 'next/link';

interface LogoProps {
  onClick?: () => void;
  className?: string;
}

export default function Logo({ onClick, className }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`text-2xl font-bold font-headline text-primary hover:text-primary/80 transition-colors ${className || ''}`}
      onClick={onClick}
    >
      UniShop
    </Link>
  );
}
