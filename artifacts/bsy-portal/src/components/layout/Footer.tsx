import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground py-8 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">
            {language === 'en' ? 'Contact Us' : 'संपर्क करा'}
          </h3>
          <p className="text-sm text-secondary-foreground/80 mb-2">
            {language === 'en' ? 'Department of Women and Child Development' : 'महिला व बाल विकास विभाग'}
          </p>
          <p className="text-sm text-secondary-foreground/80">
            {language === 'en' ? 'Government of Maharashtra' : 'महाराष्ट्र शासन'}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">
            {language === 'en' ? 'Quick Links' : 'महत्वाच्या लिंक्स'}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:underline text-secondary-foreground/80">
                {language === 'en' ? 'About Scheme' : 'योजनेबद्दल'}
              </Link>
            </li>
            <li>
              <Link href="/schemes" className="hover:underline text-secondary-foreground/80">
                {language === 'en' ? 'Other Schemes' : 'इतर योजना'}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">
            {language === 'en' ? 'Portal Help' : 'पोर्टल मदत'}
          </h3>
          <p className="text-sm text-secondary-foreground/80">
            {language === 'en' ? 'For technical issues, please contact your District WCD office.' : 'तांत्रिक समस्यांसाठी, कृपया तुमच्या जिल्हा महिला व बाल विकास कार्यालयाशी संपर्क साधा.'}
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-4 border-t border-secondary-foreground/20 text-center text-xs text-secondary-foreground/60">
        <p>© {new Date().getFullYear()} {language === 'en' ? 'Government of Maharashtra. All Rights Reserved.' : 'महाराष्ट्र शासन. सर्व हक्क राखीव.'}</p>
      </div>
    </footer>
  );
}
