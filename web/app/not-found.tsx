import Link from 'next/link';

export default function NotFound () {
  return (
    <div className="min-h-page flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-xl text-title">Not Found</h2>
      <p className="text-subtitle">Could not find the requested resource.</p>
      <Link href="/widgets" className="text-primary hover:underline">
        Return to Widgets
      </Link>
    </div>
  );
}
