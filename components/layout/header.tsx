"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout } from "@/utils/data/user-management";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  const checkAuth = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Listen for auth changes via localStorage
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsMenuOpen(false);
    checkAuth(); // Recheck authentication immediately
  };

  const publicNavigation = [
    { name: "Appointment Booking", href: "/booking" },
    { name: "Health Hub", href: "/health-hub" },
    { name: "Health Check", href: "/health-check" },
    { name: "About", href: "/about" },
  ];

  const authenticatedNavigation = [
    { name: "Appointment Booking", href: "/booking" },
    { name: "My Appointments", href: "/my-appointments" },
    { name: "Health Hub", href: "/health-hub" },
    { name: "Health Check", href: "/health-check" },
    { name: "About", href: "/about" },
  ];

  const navigation = user ? authenticatedNavigation : publicNavigation;

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/95 shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-lg font-bold text-white">D</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-neutral-50 dark:to-neutral-300 bg-clip-text text-transparent">
                  DocBook
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Healthcare Made Simple</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <nav role="navigation" aria-label="Main navigation" className="flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                    isActive(item.href)
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                  )}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="ml-6 flex items-center space-x-3 pl-6 border-l border-neutral-200 dark:border-neutral-800">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500">
                      <span className="text-xs font-medium text-white">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {user.firstName}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
                    aria-label="Logout from your account"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="sm" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="w-full md:hidden border-t border-neutral-200 dark:border-neutral-800 mt-4 pt-4">
            <nav role="navigation" aria-label="Mobile navigation">
              <div className="space-y-1 px-4 pb-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                      isActive(item.href)
                        ? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
            <div className="px-4 py-4 border-t border-neutral-200 dark:border-neutral-800">
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500">
                      <span className="text-sm font-medium text-white">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Welcome back
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                    aria-label="Logout from your account"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button variant="outline" size="sm" className="w-full mb-3">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)} className="block">
                    <Button size="sm" className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}