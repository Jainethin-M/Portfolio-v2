import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="eyebrow">Signal lost · 404</p>
      <h1 className="text-4xl font-bold">This sector does not exist</h1>
      <p className="max-w-md text-nexus-muted">The page you were looking for is outside the command center.</p>
      <Link href="/" className="btn btn-primary">
        Return to the hub
      </Link>
    </main>
  );
}
