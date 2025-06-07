import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="text-2xl font-bold font-headline text-primary hover:text-primary/80 transition-colors">
      UniShop
    </Link>
  );
}
