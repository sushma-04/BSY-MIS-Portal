import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { useListSchemes } from "@workspace/api-client-react";
import { CheckCircle, ArrowRight, Shield, Users, FileText, Heart, Award } from "lucide-react";

const steps = [
  { en: "Register with your mobile number via OTP", mr: "OTP द्वारे मोबाईल नंबरने नोंदणी करा" },
  { en: "Fill the application form & upload documents", mr: "अर्ज भरा आणि कागदपत्रे अपलोड करा" },
  { en: "GIMABA reviews and forwards for home visit", mr: "GIMABA पुनरावलोकन करते आणि गृहभेटीसाठी पाठवते" },
  { en: "Protection Officer conducts SIR & home visit", mr: "संरक्षण अधिकारी SIR व गृहभेट घेतात" },
  { en: "PWC Committee approves in quarterly meeting", mr: "PWC समिती त्रैमासिक बैठकीत मंजुरी देते" },
  { en: "Monthly DBT payment credited to bank account", mr: "लाभार्थ्याच्या बँक खात्यात मासिक DBT जमा" },
];

const benefits = [
  { en: "General / Single Parent", mr: "सामान्य / एकल पालक", amount: "₹2,250", color: "from-purple-50 to-pink-50 border-purple-200" },
  { en: "Full Orphan (Both Parents Deceased)", mr: "पूर्ण अनाथ (दोन्ही पालक मृत)", amount: "₹2,500", color: "from-pink-50 to-purple-50 border-pink-200" },
  { en: "COVID-19 Orphan", mr: "कोविड-१९ अनाथ", amount: "₹2,500", color: "from-purple-50 to-pink-50 border-purple-200" },
  { en: "Administrative Grant (per Sanstha)", mr: "प्रशासकीय अनुदान (प्रति संस्था)", amount: "₹75/child", color: "from-amber-50 to-yellow-50 border-amber-200" },
];

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const beneficiaries = useCountUp(7500, 1800, visible);
  const districts = useCountUp(36, 1200, visible);
  const years = useCountUp(16, 900, visible);
  return (
    <div ref={ref} className="mt-10 grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
      <div>
        <div className="text-3xl md:text-4xl font-bold">{visible ? beneficiaries.toLocaleString("en-IN") + "+" : "0+"}</div>
        <div className="text-xs text-white/80 mt-1">Beneficiaries</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-bold">₹2,500</div>
        <div className="text-xs text-white/80 mt-1">Max Monthly Aid</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-bold">{visible ? districts : 0}</div>
        <div className="text-xs text-white/80 mt-1">Districts Covered</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { language, t } = useLanguage();
  const { data: schemes } = useListSchemes();
  const schemesArr = Array.isArray(schemes) ? schemes : [];

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-purple-800 to-primary text-white py-16 md:py-24">
        {/* Background SVG line art */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 1200 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            {/* lotus / mandala arcs */}
            <g stroke="white" fill="none" strokeWidth="1.5" opacity="0.12">
              <circle cx="1100" cy="80" r="200" />
              <circle cx="1100" cy="80" r="150" />
              <circle cx="1100" cy="80" r="100" />
              <circle cx="100" cy="450" r="180" />
              <circle cx="100" cy="450" r="120" />
            </g>
            {/* floating dots grid */}
            <g fill="white" opacity="0.15">
              {[0,1,2,3,4,5,6].map(col => [0,1,2,3].map(row => (
                <circle key={`${col}-${row}`} cx={60 + col * 160} cy={60 + row * 110} r="2.5" />
              )))}
            </g>
            {/* flowing wave lines */}
            <g stroke="white" fill="none" strokeWidth="1" opacity="0.1">
              <path d="M0,300 Q300,200 600,300 T1200,300" />
              <path d="M0,340 Q300,240 600,340 T1200,340" strokeDasharray="6,6" />
              <path d="M0,260 Q300,160 600,260 T1200,260" strokeDasharray="3,9" />
            </g>
            {/* child silhouette hint — simplified figure */}
            <g fill="white" opacity="0.07" transform="translate(580,80)">
              <circle cx="30" cy="18" r="18" />
              <path d="M10,40 Q30,90 50,40" />
              <line x1="30" y1="40" x2="30" y2="95" strokeWidth="12" stroke="white" strokeLinecap="round" />
              <line x1="30" y1="55" x2="5" y2="75" strokeWidth="10" stroke="white" strokeLinecap="round" />
              <line x1="30" y1="55" x2="55" y2="75" strokeWidth="10" stroke="white" strokeLinecap="round" />
              <line x1="30" y1="95" x2="15" y2="130" strokeWidth="10" stroke="white" strokeLinecap="round" />
              <line x1="30" y1="95" x2="45" y2="130" strokeWidth="10" stroke="white" strokeLinecap="round" />
            </g>
            {/* star accents */}
            {[[200,120],[900,350],[300,400],[1050,200]].map(([cx,cy],i) => (
              <g key={i} transform={`translate(${cx},${cy})`} fill="white" opacity="0.2">
                <polygon points="0,-8 2,-3 7,-3 3,1 5,7 0,4 -5,7 -3,1 -7,-3 -2,-3" />
              </g>
            ))}
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1 font-semibold mb-6 inline-block">
              {language === "en" ? "Maharashtra Government Scheme since 2008" : "२००८ पासून महाराष्ट्र शासन योजना"}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6" data-testid="hero-title" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.3)" }}>
              {t("home.hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button size="lg" className="bg-white text-secondary hover:bg-white/90 font-bold px-8 shadow-lg" data-testid="btn-apply-hero">
                  {t("home.hero.cta")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/15 font-bold px-8" data-testid="btn-track-hero">
                  {t("home.hero.track")}
                </Button>
              </Link>
            </div>
            <AnimatedStats />
          </div>
        </div>
      </section>

      {/* ── Eligibility ── */}
      <section className="py-14 bg-muted/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3" aria-hidden />
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">{t("home.eligibility.title")}</h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">
              {language === "en" ? "Children meeting any of the following criteria are eligible to apply" : "खालीलपैकी कोणत्याही निकषाची पूर्तता करणारी मुले अर्ज करण्यास पात्र आहेत"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: "home.eligibility.orphan", icon: "👨‍👩‍👧" },
                { key: "home.eligibility.semiOrphan", icon: "👤" },
                { key: "home.eligibility.chronic", icon: "🏥" },
                { key: "home.eligibility.divorced", icon: "📋" },
                { key: "home.eligibility.age", icon: "📅" },
                { key: "home.eligibility.income", icon: "💰" },
              ].map((item) => (
                <div key={item.key} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-border hover:border-primary/50 transition-colors group">
                  <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-sm text-foreground font-medium pt-1">{t(item.key)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-700 mb-2">⚠️ {language === "en" ? "Disqualification Conditions:" : "अपात्रतेच्या अटी:"}</p>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• {language === "en" ? "Surviving parent has remarried" : "जिवंत पालकाने पुनर्विवाह केलेला आहे"}</li>
                <li>• {language === "en" ? "Child has turned 18 years of age" : "मुलाचे वय १८ वर्षे झाले आहे"}</li>
                <li>• {language === "en" ? "Aadhaar not seeded to bank account" : "बँक खात्याशी आधार लिंक केलेले नाही"}</li>
                <li>• {language === "en" ? "Child enrolled in government residential school providing full maintenance" : "मुल सरकारी निवासी शाळेत पूर्ण देखभालीसह नोंदणीकृत आहे"}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-14 bg-white relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-secondary/5 rounded-full translate-y-1/3 -translate-x-1/4" aria-hidden />
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">{t("home.benefits.title")}</h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">
              {language === "en" ? "Monthly financial assistance transferred directly via DBT (Direct Benefit Transfer)" : "DBT द्वारे थेट हस्तांतरित मासिक आर्थिक मदत"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((b) => (
                <Card key={b.en} className={`text-center border-2 hover:shadow-lg transition-all hover:-translate-y-1 bg-gradient-to-b ${b.color}`}>
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-secondary mb-3">{b.amount}</div>
                    <p className="text-sm text-foreground font-medium">{language === "en" ? b.en : b.mr}</p>
                    <p className="text-xs text-muted-foreground mt-2">{language === "en" ? "per month via DBT" : "प्रति महिना DBT द्वारे"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How to Apply ── */}
      <section className="py-14 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(266 81% 97%) 0%, hsl(324 100% 98%) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.05" stroke="hsl(266 81% 34%)" fill="none" strokeWidth="1">
              {[0,1,2,3,4].map(i => <circle key={i} cx="750" cy="50" r={60 + i * 40} />)}
            </g>
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">
              {language === "en" ? "How to Apply?" : "अर्ज कसा करावा?"}
            </h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">
              {language === "en" ? "Complete 6-step process from registration to monthly DBT payment" : "नोंदणीपासून मासिक DBT अदायगीपर्यंत ६-पायरी प्रक्रिया"}
            </p>
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white hover:border-primary/30 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center flex-shrink-0 text-sm group-hover:scale-105 transition-transform">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="pt-1.5">
                    <p className="text-sm font-medium text-foreground">{language === "en" ? step.en : step.mr}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/apply">
                <Button size="lg" className="bg-secondary text-white font-bold px-10 shadow-lg hover:bg-secondary/90" data-testid="btn-apply-steps">
                  {t("home.hero.cta")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Required Documents ── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">
              {language === "en" ? "Required Documents" : "आवश्यक कागदपत्रे"}
            </h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">
              {language === "en" ? "Keep these documents ready before starting your application" : "अर्ज सुरू करण्यापूर्वी ही कागदपत्रे तयार ठेवा"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { en: "Child's Aadhaar Card", mr: "मुलाचे आधार कार्ड", required: true },
                { en: "Parent/Guardian's Aadhaar Card", mr: "पालक/संरक्षकाचे आधार कार्ड", required: true },
                { en: "Child's Birth Certificate / School Bonafide", mr: "मुलाचे जन्म प्रमाणपत्र / शाळेचे बोनाफाईड", required: true },
                { en: "Death Certificate of Deceased Parent(s)", mr: "मृत पालकाचे मृत्यू प्रमाणपत्र", required: false },
                { en: "Income Certificate", mr: "उत्पन्न प्रमाणपत्र", required: true },
                { en: "Bank Passbook / Account Details (for DBT)", mr: "बँक पासबुक / खाते तपशील (DBT साठी)", required: true },
                { en: "Ration Card", mr: "रेशन कार्ड", required: true },
                { en: "Domicile / Residency Proof", mr: "अधिवास / निवास पुरावा", required: true },
                { en: "Passport-size Photograph of Child", mr: "मुलाचा पासपोर्ट आकाराचा फोटो", required: true },
                { en: "Color Family Photograph at Home", mr: "घरातील रंगीत कौटुंबिक छायाचित्र", required: true },
                { en: "Medical Certificate (if parent ill)", mr: "वैद्यकीय प्रमाणपत्र (पालक आजारी असल्यास)", required: false },
                { en: "COVID-19 Death Certificate (if applicable)", mr: "COVID-19 मृत्यू प्रमाणपत्र (लागू असल्यास)", required: false },
              ].map((doc) => (
                <div key={doc.en} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3 border border-border">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-foreground font-medium">{language === "en" ? doc.en : doc.mr}</span>
                    <Badge className={`ml-2 text-xs ${doc.required ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                      {doc.required ? (language === "en" ? "Mandatory" : "अनिवार्य") : (language === "en" ? "If applicable" : "लागू असल्यास")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ekal Mahila CTA ── */}
      <section className="py-14 bg-gradient-to-br from-secondary to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.1" fill="white">
              <circle cx="720" cy="50" r="120" />
              <circle cx="80" cy="260" r="100" />
            </g>
            {[0,1,2,3,4,5].map(i => (
              <circle key={i} cx={100 + i * 130} cy={150 + (i % 2) * 40} r="3" fill="white" opacity="0.2" />
            ))}
          </svg>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">{language === "en" ? "Ekal Mahila (Single Women) Scheme" : "एकल महिला योजना"}</h2>
                </div>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  {language === "en"
                    ? "A dedicated support system for widowed, divorced, abandoned, and unmarried single women of Maharashtra — providing financial assistance, certificate issuance, and scheme linkage."
                    : "महाराष्ट्रातील विधवा, घटस्फोटित, परित्यक्ता आणि अविवाहित एकल महिलांसाठी आर्थिक सहाय्य, प्रमाणपत्र जारी करणे आणि योजना जोडणी प्रदान करणारी समर्पित सहाय्य प्रणाली."}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { en: "₹1,500/month Ladki Bahin", mr: "₹1,500/महिना लाडकी बहीण" },
                    { en: "₹600–900 Vidhwa Pension", mr: "₹600–900 विधवा पेन्शन" },
                    { en: "Free LPG connection", mr: "मोफत LPG जोडणी" },
                    { en: "Job reservation benefits", mr: "नोकरी आरक्षण लाभ" },
                  ].map(b => (
                    <div key={b.en} className="flex items-center gap-2 text-xs">
                      <CheckCircle className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="text-white/90">{language === "en" ? b.en : b.mr}</span>
                    </div>
                  ))}
                </div>
                <Link href="/ekal-mahila">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold gap-2">
                    {language === "en" ? "Learn More & Register" : "अधिक जाणून घ्या आणि नोंदणी करा"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "💜", en: "Widow (Vidhwa)", mr: "विधवा" },
                  { icon: "🌸", en: "Divorced (Ghatsfot)", mr: "घटस्फोटित" },
                  { icon: "🌻", en: "Abandoned (Parityakta)", mr: "परित्यक्ता" },
                  { icon: "🌿", en: "Unmarried 30+ (Avivahit)", mr: "अविवाहित ३०+" },
                ].map(cat => (
                  <div key={cat.en} className="bg-white/10 border border-white/20 rounded-xl p-4 text-center hover:bg-white/15 transition-colors">
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <p className="text-xs font-semibold text-white">{language === "en" ? cat.en : cat.mr}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Schemes Preview ── */}
      {schemesArr.length > 0 && (
        <section className="py-14 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">
                {language === "en" ? "Related Government Schemes" : "संबंधित सरकारी योजना"}
              </h2>
              <p className="text-center text-muted-foreground mb-10 text-sm">
                {language === "en" ? "Other schemes available for BSY beneficiaries and their families" : "BSY लाभार्थी आणि त्यांच्या कुटुंबासाठी उपलब्ध इतर योजना"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {schemesArr.slice(0, 3).map((scheme: any) => (
                  <Card key={scheme.id} className="shadow-sm hover:shadow-md hover:border-primary/50 transition-all hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <Badge className={`text-xs mb-2 ${scheme.targetGroup === "children" ? "bg-pink-100 text-pink-800 border-pink-200" : "bg-purple-100 text-purple-800 border-purple-200"}`}>
                        {scheme.targetGroup === "children" ? (language === "en" ? "Children" : "मुले") : (language === "en" ? "Women" : "महिला")}
                      </Badge>
                      <h3 className="font-bold text-secondary text-sm mb-1">{language === "mr" && scheme.marathiName ? scheme.marathiName : scheme.name}</h3>
                      <p className="text-xs text-muted-foreground">{scheme.benefit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link href="/schemes">
                  <Button variant="outline" className="border-secondary text-secondary gap-2 hover:bg-secondary hover:text-white transition-colors">
                    {language === "en" ? "View All Schemes" : "सर्व योजना पाहा"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Certificate Download CTA ── */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/20 rounded-2xl p-8 text-center">
            <Award className="h-10 w-10 text-secondary mx-auto mb-3" />
            <h3 className="text-xl font-bold text-secondary mb-2">{language === "en" ? "Download Your Certificate" : "तुमचे प्रमाणपत्र डाउनलोड करा"}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              {language === "en"
                ? "Verified BSY beneficiaries can download Orphan Certificate, Widow Certificate, or BSY Beneficiary Certificate using Aadhaar verification."
                : "सत्यापित BSY लाभार्थी आधार पडताळणी वापरून अनाथ प्रमाणपत्र, विधवा प्रमाणपत्र किंवा BSY लाभार्थी प्रमाणपत्र डाउनलोड करू शकतात."}
            </p>
            <Link href="/certificates">
              <Button className="bg-secondary text-white hover:bg-secondary/90 gap-2 font-semibold">
                {language === "en" ? "Download Certificate" : "प्रमाणपत्र डाउनलोड करा"} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Roles login section ── */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2 text-center">
              {language === "en" ? "Login by Role" : "भूमिकेनुसार लॉगिन करा"}
            </h2>
            <p className="text-center text-muted-foreground mb-10 text-sm">
              {language === "en" ? "The BSY MIS Portal serves all stakeholders in the scheme workflow" : "BSY MIS पोर्टल योजना प्रक्रियेतील सर्व भागधारकांना सेवा देते"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { en: "Applicant / Citizen", mr: "अर्जदार / नागरिक", desc_en: "Apply for BSY benefits via OTP login", desc_mr: "OTP लॉगिनद्वारे BSY लाभांसाठी अर्ज करा", icon: Users, color: "text-primary border-primary/20 hover:border-primary" },
                { en: "GIMABA / District Officer", mr: "GIMABA / जिल्हा अधिकारी", desc_en: "Review and forward applications", desc_mr: "अर्जांचे पुनरावलोकन आणि अग्रेषण", icon: Shield, color: "text-secondary border-secondary/20 hover:border-secondary" },
                { en: "Protection Officer", mr: "संरक्षण अधिकारी", desc_en: "Conduct SIR home visits", desc_mr: "SIR गृहभेट घेणे", icon: Shield, color: "text-purple-700 border-purple-200 hover:border-purple-500" },
                { en: "PWC Committee", mr: "PWC समिती", desc_en: "Schedule meetings & approve cases", desc_mr: "बैठका आयोजित करा आणि प्रकरणे मंजूर करा", icon: FileText, color: "text-indigo-700 border-indigo-200 hover:border-indigo-500" },
                { en: "Sanstha / NGO", mr: "संस्था / NGO", desc_en: "Manage enrolled beneficiaries", desc_mr: "नोंदणीकृत लाभार्थ्यांचे व्यवस्थापन", icon: Users, color: "text-green-700 border-green-200 hover:border-green-500" },
                { en: "Facilitator", mr: "सुलभक", desc_en: "Assist applicants at e-Suvidha Kendra", desc_mr: "ई-सुविधा केंद्रात अर्जदारांना मदत करा", icon: Heart, color: "text-pink-700 border-pink-200 hover:border-pink-500" },
              ].map((role) => (
                <Link key={role.en} href="/login">
                  <Card className={`border-2 cursor-pointer transition-all hover:shadow-md ${role.color}`}>
                    <CardContent className="p-4">
                      <role.icon className={`h-5 w-5 mb-2 ${role.color.split(" ")[0]}`} />
                      <p className="font-bold text-sm text-foreground">{language === "en" ? role.en : role.mr}</p>
                      <p className="text-xs text-muted-foreground mt-1">{language === "en" ? role.desc_en : role.desc_mr}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Help footer ── */}
      <section className="py-10 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="font-bold text-lg mb-1">{language === "en" ? "Need Help?" : "मदत हवी आहे का?"}</p>
          <p className="text-white/70 text-sm mb-4">
            {language === "en" ? "Contact your nearest e-Suvidha Kendra, Anganwadi Centre, or WCD District Office" : "जवळच्या ई-सुविधा केंद्र, अंगणवाडी केंद्र किंवा WCD जिल्हा कार्यालयाशी संपर्क साधा"}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-secondary gap-2">
              📞 {language === "en" ? "Helpline: 1800-233-0011" : "हेल्पलाइन: 1800-233-0011"}
            </Button>
            <Link href="/track">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-secondary gap-2">
                {language === "en" ? "Track Application" : "अर्ज ट्रॅक करा"} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-secondary gap-2">
                {language === "en" ? "About Scheme" : "योजनेबद्दल"} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
