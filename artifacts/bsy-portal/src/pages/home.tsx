import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { useListSchemes } from "@workspace/api-client-react";
import { CheckCircle, ArrowRight, Shield, Users, Banknote, FileText, Phone, Globe } from "lucide-react";

const steps = [
  { en: "Register with your mobile number", mr: "मोबाईल नंबरने नोंदणी करा", num: "01" },
  { en: "Fill the application form & upload documents", mr: "अर्ज भरा आणि कागदपत्रे अपलोड करा", num: "02" },
  { en: "GIMABA reviews and forwards for home visit", mr: "GIMABA पुनरावलोकन करते आणि गृहभेटीसाठी पाठवते", num: "03" },
  { en: "Protection Officer conducts SIR & home visit", mr: "संरक्षण अधिकारी SIR व गृहभेट घेतात", num: "04" },
  { en: "PWC Committee approves/rejects in meeting", mr: "PWC समिती बैठकीत मंजुरी/नकार देते", num: "05" },
  { en: "Monthly DBT payment to beneficiary's bank account", mr: "लाभार्थ्याच्या बँक खात्यात मासिक DBT अदायगी", num: "06" },
];

const benefits = [
  { en: "General / Single Parent", mr: "सामान्य / एकल पालक", amount: "₹2,250", color: "bg-orange-100 text-orange-800" },
  { en: "Full Orphan (Both Parents Deceased)", mr: "पूर्ण अनाथ (दोन्ही पालक मृत)", amount: "₹2,500", color: "bg-blue-100 text-blue-800" },
  { en: "COVID-19 Orphan", mr: "कोविड-१९ अनाथ", amount: "₹2,500", color: "bg-green-100 text-green-800" },
  { en: "Administrative Grant (per Sanstha)", mr: "प्रशासकीय अनुदान (प्रति संस्था)", amount: "₹75/child", color: "bg-purple-100 text-purple-800" },
];

export default function Home() {
  const { language, t } = useLanguage();
  const { data: schemes } = useListSchemes();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-orange-600 to-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-1 font-semibold">
                {language === "en" ? "Maharashtra Government Scheme since 2008" : "२००८ पासून महाराष्ट्र शासन योजना"}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6" data-testid="hero-title">
              {t("home.hero.title")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("home.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/apply">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold px-8" data-testid="btn-apply-hero">
                  {t("home.hero.cta")} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold px-8" data-testid="btn-track-hero">
                  {t("home.hero.track")}
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
              <div>
                <div className="text-3xl font-bold">7,500+</div>
                <div className="text-sm text-white/80">{language === "en" ? "Beneficiaries" : "लाभार्थी"}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">₹2,500</div>
                <div className="text-sm text-white/80">{language === "en" ? "Max Monthly Aid" : "कमाल मासिक मदत"}</div>
              </div>
              <div>
                <div className="text-3xl font-bold">0–18</div>
                <div className="text-sm text-white/80">{language === "en" ? "Age Eligibility" : "वय पात्रता"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">{t("home.eligibility.title")}</h2>
            <p className="text-center text-muted-foreground mb-10">
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
                <div key={item.key} className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm border border-border">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground font-medium">{t(item.key)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-700 mb-2">{language === "en" ? "Disqualification Conditions:" : "अपात्रतेच्या अटी:"}</p>
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

      {/* Benefits Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">{t("home.benefits.title")}</h2>
            <p className="text-center text-muted-foreground mb-10">
              {language === "en" ? "Monthly financial assistance transferred directly via DBT (Direct Benefit Transfer)" : "DBT द्वारे थेट हस्तांतरित मासिक आर्थिक मदत"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((b) => (
                <Card key={b.amount + b.en} className="text-center border-2 hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="text-3xl font-bold text-primary mb-2">{b.amount}</div>
                    <div className="text-sm font-medium text-foreground">{language === "en" ? b.en : b.mr}</div>
                    <div className="text-xs text-muted-foreground mt-1">{language === "en" ? "per month" : "प्रति महिना"}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              {language === "en" ? "Payment routed via MahaDBT to child's bank/post-office account. Annual window: April 1 – March 31" : "MahaDBT द्वारे मुलाच्या बँक/पोस्ट ऑफिस खात्यात अदायगी. वार्षिक कालावधी: १ एप्रिल – ३१ मार्च"}
            </p>
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">
              {language === "en" ? "How to Apply" : "अर्ज कसा करावा"}
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              {language === "en" ? "Complete application workflow from submission to approval" : "सादरीकरणापासून मंजुरीपर्यंत संपूर्ण अर्ज प्रक्रिया"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step) => (
                <div key={step.num} className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    {step.num}
                  </div>
                  <p className="text-sm text-foreground font-medium pt-2">{language === "en" ? step.en : step.mr}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/apply">
                <Button size="lg" className="bg-primary text-white font-bold px-10" data-testid="btn-apply-steps">
                  {language === "en" ? "Start Your Application" : "अर्ज सुरू करा"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-secondary mb-2">
              {language === "en" ? "Required Documents" : "आवश्यक कागदपत्रे"}
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              {language === "en" ? "Keep these documents ready before starting your application" : "अर्ज सुरू करण्यापूर्वी ही कागदपत्रे तयार ठेवा"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { en: "Child's Aadhaar Card", mr: "मुलाचे आधार कार्ड", required: true },
                { en: "Parent/Guardian Aadhaar Card", mr: "पालक/संरक्षकाचे आधार कार्ड", required: true },
                { en: "Child's Birth Certificate", mr: "मुलाचे जन्म प्रमाणपत्र", required: true },
                { en: "Income Certificate", mr: "उत्पन्न प्रमाणपत्र", required: true },
                { en: "Bank Passbook / Account Details", mr: "बँक पासबुक / खाते तपशील", required: true },
                { en: "Passport-size Photograph of Child", mr: "मुलाचा पासपोर्ट आकाराचा फोटो", required: true },
                { en: "Ration Card (Residency Proof)", mr: "रेशन कार्ड (निवास पुरावा)", required: true },
                { en: "Death Certificate (for orphan/semi-orphan)", mr: "मृत्यू प्रमाणपत्र (अनाथ/अर्ध-अनाथ)", required: false },
                { en: "Medical/Disability Certificate of Parent", mr: "पालकाचे वैद्यकीय/अपंगत्व प्रमाणपत्र", required: false },
                { en: "COVID-19 Death Certificate", mr: "कोविड-१९ मृत्यू प्रमाणपत्र", required: false },
              ].map((doc) => (
                <div key={doc.en} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm flex-1">{language === "en" ? doc.en : doc.mr}</span>
                  <Badge variant={doc.required ? "default" : "secondary"} className="text-xs">
                    {doc.required ? (language === "en" ? "Mandatory" : "अनिवार्य") : (language === "en" ? "If Applicable" : "लागू असल्यास")}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Schemes Preview */}
      {Array.isArray(schemes) && schemes.length > 0 && (
        <section className="py-14 bg-secondary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                {language === "en" ? "Related Government Schemes" : "संबंधित सरकारी योजना"}
              </h2>
              <p className="text-center text-white/80 mb-10">
                {language === "en" ? "Other welfare schemes available for BSY beneficiaries" : "BSY लाभार्थ्यांसाठी उपलब्ध इतर कल्याण योजना"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(schemes as any[]).slice(0, 6).map((scheme) => (
                  <Card key={scheme.id} className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-colors">
                    <CardContent className="p-4">
                      <Badge className="bg-primary text-white text-xs mb-2">{scheme.targetGroup === "children" ? (language === "en" ? "Children" : "मुले") : (language === "en" ? "Women" : "महिला")}</Badge>
                      <h3 className="font-semibold text-sm mb-1">{language === "en" ? scheme.name : scheme.marathiName}</h3>
                      <p className="text-xs text-white/70">{scheme.benefit}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/schemes">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    {language === "en" ? "View All Schemes" : "सर्व योजना पहा"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Login/Role Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
              {language === "en" ? "Portal Login" : "पोर्टल लॉगिन"}
            </h2>
            <p className="text-muted-foreground mb-10">
              {language === "en" ? "Different login options for different roles" : "वेगवेगळ्या भूमिकांसाठी वेगवेगळ्या लॉगिन पर्याय"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { en: "Applicant / Citizen", mr: "अर्जदार / नागरिक", desc_en: "Apply for BSY benefits via OTP login", desc_mr: "OTP लॉगिनद्वारे BSY लाभांसाठी अर्ज करा", icon: Users, color: "text-primary" },
                { en: "GIMABA / District Officer", mr: "GIMABA / जिल्हा अधिकारी", desc_en: "Review and approve applications", desc_mr: "अर्जांचे पुनरावलोकन आणि मंजुरी द्या", icon: Shield, color: "text-secondary" },
                { en: "Sanstha / NGO", mr: "संस्था / NGO", desc_en: "Manage enrolled students and renewals", desc_mr: "नोंदणीकृत विद्यार्थी आणि नूतनीकरण व्यवस्थापित करा", icon: Globe, color: "text-green-600" },
              ].map((role) => (
                <Card key={role.en} className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <role.icon className={`h-10 w-10 mx-auto mb-3 ${role.color}`} />
                    <h3 className="font-bold text-foreground mb-1">{language === "en" ? role.en : role.mr}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{language === "en" ? role.desc_en : role.desc_mr}</p>
                    <Link href="/login">
                      <Button size="sm" className="w-full" data-testid={`btn-login-${role.en.toLowerCase().replace(/\s+/g, '-')}`}>
                        {language === "en" ? "Login" : "लॉगिन"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="py-10 bg-accent border-t border-accent-border">
        <div className="container mx-auto px-4 text-center">
          <h3 className="font-bold text-lg text-secondary mb-2">{language === "en" ? "Need Help?" : "मदत हवी आहे का?"}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {language === "en" ? "Visit your nearest e-Suvidha Kendra, Anganwadi, or contact the District WCD Office" : "तुमच्या जवळच्या ई-सुविधा केंद्रात, अंगणवाडीत जा, किंवा जिल्हा WCD कार्यालयाशी संपर्क करा"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://womenchild.maharashtra.gov.in" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="border-primary text-primary">
                <Globe className="h-4 w-4 mr-2" /> womenchild.maharashtra.gov.in
              </Button>
            </a>
            <Button variant="outline" size="sm" className="border-secondary text-secondary">
              <Phone className="h-4 w-4 mr-2" /> 1800-233-4444
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
