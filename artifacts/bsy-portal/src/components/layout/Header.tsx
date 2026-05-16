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
    <header className="bg-secondary text-secondary-foreground shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-white/20 border border-white/30 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">WCD</span>
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base leading-tight text-white">
                {language === 'en' ? 'Department of Women & Child Development' : 'महिला व बाल विकास विभाग'}
              </h1>
              <p className="text-xs text-white/70 font-medium">
                {language === 'en' ? 'Government of Maharashtra' : 'महाराष्ट्र शासन'}
              </p>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {[
            { href: "/", label: t('nav.home') },
            { href: "/about", label: t('nav.about') },
            { href: "/orphan-children", label: t('nav.orphanChildren') },
            { href: "/ekal-mahila", label: t('nav.ekalMahila') },
            { href: "/track", label: t('nav.track') },
            { href: "/certificates", label: t('nav.certificates') },
          ].map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button variant="ghost" size="sm" className={`text-white/90 hover:text-white hover:bg-white/15 text-sm ${isNavActive(href) ? 'bg-white/20 text-white' : ''}`}>
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/15 rounded-md p-0.5">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${language === "en" ? "bg-white text-secondary" : "text-white/80 hover:text-white"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("mr")}
              className={`px-2 py-1 text-xs font-semibold rounded transition-all ${language === "mr" ? "bg-white text-secondary" : "text-white/80 hover:text-white"}`}
            >
              मराठी
            </button>
          </div>

          {user ? (
            <Link href="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold hidden sm:flex text-xs">
                {t('nav.dashboard')}
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold hidden sm:flex text-xs">
                {t('nav.login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
