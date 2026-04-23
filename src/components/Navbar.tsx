import Link from "next/link";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="bg-brand text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-90 transition-opacity">
          Events BG
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/events"
            className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
          >
            All Events
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
          >
            How It Works
          </Link>
        </div>
        <div className="sm:hidden">
          <Menu className="w-6 h-6" />
        </div>
      </nav>
    </header>
  );
}
