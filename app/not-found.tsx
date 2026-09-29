import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <p className="text-sm text-muted">Fathom</p>
      <h1 className="mt-2 font-serif text-3xl">This page is not a meeting.</h1>
      <Link href="/" className="mt-6 text-sm text-accent">
        Back to meetings
      </Link>
    </main>
  );
}
