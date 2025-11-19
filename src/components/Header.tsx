import { useState } from "react";
import Logo from "./Logo";

export default function Header() {
  // Mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            <Logo />
          </h1>
          <div className="flex items-center">
            <nav className="hidden md:flex ml-8 space-x-6">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Sign up
            </button>
            <button className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Log in
            </button>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <button className="w-full text-left px-2 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Sign up
                </button>
                <button className="w-full text-left px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Log in
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
