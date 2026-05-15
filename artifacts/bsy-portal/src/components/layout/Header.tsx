import { useLanguage } from "@/lib/i18n";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetCurrentUser } from "@workspace/api-client-react";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [location] = useLocation();
  const { data: user } = useGetCurrentUser();

  const isNavActive = (path: string) => location === path;

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              {/* Emblem placeholder */}
              <span className="text-primary font-bold text-xs">GOV</span>
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base leading-tight">
                {language === 'en' ? 'Department of Women & Child Development' : 'महिला व बाल विकास विभाग'}
              </h1>
              <p className="text-xs text-primary-foreground/80 font-medium">
                {language === 'en' ? 'Government of Maharashtra' : 'महाराष्ट्र शासन'}
              </p>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" className={`text-primary-foreground hover:bg-primary/80 hover:text-white ${isNavActive('/') ? 'bg-primary/80' : ''}`}>
              {t('nav.home')}
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className={`text-primary-foreground hover:bg-primary/80 hover:text-white ${isNavActive('/about') ? 'bg-primary/80' : ''}`}>
              {t('nav.about')}
            </Button>
          </Link>
          <Link href="/schemes">
            <Button variant="ghost" className={`text-primary-foreground hover:bg-primary/80 hover:text-white ${isNavActive('/schemes') ? 'bg-primary/80' : ''}`}>
              {t('nav.schemes')}
            </Button>
          </Link>
          <Link href="/track">
            <Button variant="ghost" className={`text-primary-foreground hover:bg-primary/80 hover:text-white ${isNavActive('/track') ? 'bg-primary/80' : ''}`}>
              {t('nav.track')}
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex bg-primary-foreground/20 rounded-md p-1">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-xs font-semibold rounded ${language === "en" ? "bg-white text-primary" : "text-white"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2 py-1 text-xs font-semibold rounded ${language === "mr" ? "bg-white text-primary" : "text-white"}`}
            >
              मराठी
            </button>
          </div>

          {user ? (
            <Link href="/dashboard">
              <Button variant="secondary" size="sm" className="font-semibold text-secondary-foreground hidden sm:flex">
                {t('nav.dashboard')}
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm" className="font-semibold text-secondary-foreground hidden sm:flex">
                {t('nav.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
