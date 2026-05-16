import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { Heart, CheckCircle, ArrowRight, Users, Banknote, Home, BookOpen, Shield, Phone, AlertCircle } from "lucide-react";

const categories = [
  {
    key: "widow",
    en: "Widow (Vidhwa)",
    mr: "विधवा",
    desc_en: "Women whose husband has passed away",
    desc_mr: "ज्या महिलांचे पती निधन पावले आहेत",
    docs_en: "Husband's Death Certificate, Marriage Certificate, Aadhaar, Ration Card, Bank Passbook",
    docs_mr: "पतीचे मृत्यू प्रमाणपत्र, विवाह प्रमाणपत्र, आधार, रेशन कार्ड, बँक पासबुक",
    color: "bg-purple-100 border-purple-300 text-purple-800",
    icon: "💜",
  },
  {
    key: "divorced",
    en: "Divorced (Ghatsfot)",
    mr: "घटस्फोटित",
    desc_en: "Women who have legally obtained a divorce",
    desc_mr: "ज्या महिलांनी कायदेशीरपणे घटस्फोट घेतला आहे",
    docs_en: "Court Divorce Decree, Aadhaar, Address Proof, Bank Passbook",
    docs_mr: "न्यायालयाचा घटस्फोट आदेश, आधार, पत्त्याचा पुरावा, बँक पासबुक",
    color: "bg-pink-100 border-pink-300 text-pink-800",
    icon: "🌸",
  },
  {
    key: "abandoned",
    en: "Abandoned (Parityakta)",
    mr: "परित्यक्ता",
    desc_en: "Women who have been deserted by their husbands",
    desc_mr: "ज्या महिलांना त्यांच्या पतींनी सोडून दिले आहे",
    docs_en: "Magistrate Affidavit, FIR Copy, Aadhaar, Address Proof",
    docs_mr: "दंडाधिकारी शपथपत्र, FIR प्रत, आधार, पत्त्याचा पुरावा",
    color: "bg-amber-100 border-amber-300 text-amber-800",
    icon: "🌻",
  },
  {
    key: "unmarried",
    en: "Unmarried 30+ (Avivahit)",
    mr: "अविवाहित (३०+)",
    desc_en: "Unmarried women above 30 years of age who are economically dependent",
    desc_mr: "३० वर्षांपेक्षा अधिक वयाच्या अविवाहित आर्थिकदृष्ट्या अवलंबित महिला",
    docs_en: "Single Status Affidavit, Age/Birth Certificate, Income Proof, Aadhaar",
    docs_mr: "एकल दर्जाचे शपथपत्र, वय/जन्म प्रमाणपत्र, उत्पन्नाचा पुरावा, आधार",
    color: "bg-green-100 border-green-300 text-green-800",
    icon: "🌿",
  },
];

const stateSchemes = [
  { en: "Mukhyamantri Majhi Ladki Bahin Yojana", mr: "मुख्यमंत्री माझी लाडकी बहीण योजना", benefit_en: "₹1,500/month via DBT", benefit_mr: "₹1,500/महिना DBT द्वारे", tag: "₹1,500/mo" },
  { en: "Maharashtra Vidhwa Pension Yojana", mr: "महाराष्ट्र विधवा पेन्शन योजना", benefit_en: "₹600–900/month", benefit_mr: "₹600–900/महिना", tag: "Pension" },
  { en: "Indira Gandhi National Widow Pension (IGNWPS)", mr: "इंदिरा गांधी राष्ट्रीय विधवा पेन्शन", benefit_en: "₹300–500/month (Central)", benefit_mr: "₹300–500/महिना (केंद्रीय)", tag: "Central" },
  { en: "PMAY-G Housing Priority", mr: "PMAY-G गृहनिर्माण प्राधान्य", benefit_en: "Housing assistance for women-headed households", benefit_mr: "महिला प्रमुख कुटुंबांसाठी गृहनिर्माण सहाय्य", tag: "Housing" },
  { en: "PM Ujjwala Yojana", mr: "PM उज्ज्वला योजना", benefit_en: "Free LPG connection + cylinder subsidy", benefit_mr: "मोफत LPG जोडणी + सिलेंडर अनुदान", tag: "LPG" },
  { en: "DDU-GKY Skill Training", mr: "DDU-GKY कौशल्य प्रशिक्षण", benefit_en: "Free residential skill training + placement", benefit_mr: "मोफत निवासी कौशल्य प्रशिक्षण + नियुक्ती", tag: "Skill" },
  { en: "Mahila Shakti Kendra", mr: "महिला शक्ती केंद्र", benefit_en: "Skill training, livelihood support, awareness", benefit_mr: "कौशल्य प्रशिक्षण, उपजीविका सहाय्य, जागरूकता", tag: "Support" },
  { en: "National Livelihood Mission (SHG)", mr: "राष्ट्रीय उपजीविका मिशन (SHG)", benefit_en: "Low-interest loans for self-help groups", benefit_mr: "स्वयंसहाय्यता गटांसाठी कमी व्याजावर कर्ज", tag: "SHG" },
];

const jobReservations = [
  { en: "30% horizontal reservation for women in Maharashtra state services (MPSC)", mr: "महाराष्ट्र राज्य सेवांमध्ये महिलांसाठी 30% आडवे आरक्षण (MPSC)" },
  { en: "Age relaxation up to 35 years (38 for SC/ST) for widows/divorcees in central govt jobs (SSC/UPSC)", mr: "केंद्र सरकारी नोकऱ्यांमध्ये विधवा/घटस्फोटितांसाठी 35 वर्षांपर्यंत वयात सूट" },
  { en: "Priority in Anganwadi Sevika/Helper appointments (WCD GR)", mr: "अंगणवाडी सेविका/सहाय्यिका नियुक्तींमध्ये प्राधान्य (WCD GR)" },
  { en: "Sub-quota reservation in Women's horizontal reservation (20% of 30% for widows/divorcees)", mr: "महिला आडव्या आरक्षणातील उप-कोटा (विधवा/घटस्फोटितांसाठी 30% पैकी 20%)" },
];

export default function EkalMahila() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState({ name: "", mobile: "", category: "widow", age: "", taluka: "", village: "", income: "", occupation: "", shg: "no", rationCard: "yellow", certNeeded: false });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "schemes" | "register">("info");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-gradient-to-br from-secondary via-purple-700 to-primary text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="80" r="120" fill="white" />
            <circle cx="700" cy="220" r="100" fill="white" />
            <path d="M0,150 Q200,50 400,150 T800,150" stroke="white" strokeWidth="3" fill="none" strokeDasharray="8,4" />
            <path d="M0,200 Q200,100 400,200 T800,200" stroke="white" strokeWidth="2" fill="none" strokeDasharray="4,8" />
            {[1,2,3,4,5,6,7,8].map(i => (
              <circle key={i} cx={i * 100} cy={50 + (i % 3) * 60} r="3" fill="white" opacity="0.6" />
            ))}
          </svg>
        </div>
        <div className="container mx-auto max-w-5xl relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t("ekal.title")}</h1>
              <p className="text-white/80 text-sm mt-1 max-w-xl">{t("ekal.subtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { n: "4", l: language === "en" ? "Categories" : "श्रेणी" },
              { n: "8+", l: language === "en" ? "State Schemes" : "राज्य योजना" },
              { n: "₹1,500", l: language === "en" ? "Max Monthly Aid" : "कमाल मासिक मदत" },
              { n: "30%", l: language === "en" ? "Job Reservation" : "नोकरी आरक्षण" },
            ].map(s => (
              <div key={s.l} className="bg-white/15 rounded-xl p-3 text-center border border-white/20">
                <div className="text-2xl font-bold">{s.n}</div>
                <div className="text-xs text-white/80 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex gap-2 mb-6 border-b border-border pb-2">
          {([["info", language === "en" ? "About & Categories" : "माहिती आणि श्रेणी"], ["schemes", language === "en" ? "Schemes & Benefits" : "योजना आणि लाभ"], ["register", language === "en" ? "Register" : "नोंदणी"]] as const).map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all ${activeTab === tab ? "bg-secondary text-white" : "text-muted-foreground hover:text-secondary"}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => (
                <Card key={cat.key} className={`border-2 shadow-sm ${cat.color.split(" ").slice(0, 2).join(" ")}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <div>{language === "en" ? cat.en : cat.mr}</div>
                        <div className="text-xs font-normal text-muted-foreground">{language === "en" ? cat.desc_en : cat.desc_mr}</div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{language === "en" ? "Required Documents:" : "आवश्यक कागदपत्रे:"}</p>
                    <p className="text-xs text-foreground">{language === "en" ? cat.docs_en : cat.docs_mr}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  {language === "en" ? "Government Job Reservations" : "सरकारी नोकरी आरक्षण"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {jobReservations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{language === "en" ? r.en : r.mr}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => setActiveTab("schemes")} className="bg-secondary text-white gap-2">
                {language === "en" ? "View All Schemes" : "सर्व योजना पाहा"} <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => setActiveTab("register")} className="bg-primary text-primary-foreground gap-2">
                {t("ekal.register")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {activeTab === "schemes" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stateSchemes.map((scheme, i) => (
                <Card key={i} className="shadow-sm hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-secondary text-sm">{language === "en" ? scheme.en : scheme.mr}</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs flex-shrink-0">{scheme.tag}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Banknote className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{language === "en" ? scheme.benefit_en : scheme.benefit_mr}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Link href="/schemes">
                <Button variant="outline" className="border-secondary text-secondary gap-2">
                  {language === "en" ? "View All Government Schemes" : "सर्व सरकारी योजना पाहा"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {activeTab === "register" && (
          submitted ? (
            <Card className="shadow-md max-w-lg mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2">{language === "en" ? "Registration Submitted!" : "नोंदणी सादर केली!"}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "en" ? "Your profile has been registered in the Ekal Mahila MIS. A field worker will contact you within 7 working days." : "तुमचे प्रोफाइल एकल महिला MIS मध्ये नोंदणीकृत केले आहे. एक क्षेत्र कार्यकर्ता ७ कार्य दिवसांत तुमच्याशी संपर्क साधेल."}
                </p>
                <div className="flex justify-center gap-3">
                  <Button onClick={() => setActiveTab("schemes")} variant="outline" size="sm">
                    {language === "en" ? "View Available Schemes" : "उपलब्ध योजना पाहा"}
                  </Button>
                  <Link href="/certificates">
                    <Button size="sm" className="bg-secondary text-white">
                      {language === "en" ? "Download Certificate" : "प्रमाणपत्र डाउनलोड करा"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-md max-w-2xl mx-auto">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{language === "en" ? "Ekal Mahila Registration Form" : "एकल महिला नोंदणी अर्ज"}</CardTitle>
                <p className="text-sm text-muted-foreground">{language === "en" ? "Register to access scheme benefits and get a Single Women Certificate" : "योजनेचे लाभ मिळवण्यासाठी आणि एकल महिला प्रमाणपत्र मिळवण्यासाठी नोंदणी करा"}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Full Name *" : "पूर्ण नाव *"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "As per Aadhaar" : "आधारनुसार"} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Mobile Number *" : "मोबाईल क्रमांक *"}</Label>
                      <Input className="mt-1" placeholder="10-digit mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required maxLength={10} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Age *" : "वय *"}</Label>
                      <Input className="mt-1" type="number" min="18" max="100" placeholder={language === "en" ? "Age in years" : "वर्षांमध्ये वय"} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Category *" : "श्रेणी *"}</Label>
                      <select className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring outline-none" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {categories.map(c => <option key={c.key} value={c.key}>{language === "en" ? c.en : c.mr}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Taluka *" : "तालुका *"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "e.g. Amalner" : "उदा. अमळनेर"} value={form.taluka} onChange={e => setForm({ ...form, taluka: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Village / Ward *" : "गाव / वार्ड *"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "Village name" : "गावाचे नाव"} value={form.village} onChange={e => setForm({ ...form, village: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Monthly Income (₹)" : "मासिक उत्पन्न (₹)"}</Label>
                      <Input className="mt-1" type="number" placeholder="0" value={form.income} onChange={e => setForm({ ...form, income: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Occupation" : "व्यवसाय"}</Label>
                      <select className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring outline-none" value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })}>
                        {["Labour", "Agriculture", "Private Job", "Homemaker", "ASHA/Anganwadi Worker", "Business"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Ration Card Type" : "रेशन कार्ड प्रकार"}</Label>
                      <select className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring outline-none" value={form.rationCard} onChange={e => setForm({ ...form, rationCard: e.target.value })}>
                        {["Yellow (BPL)", "Kesari", "White/APL", "None"].map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "SHG Member?" : "SHG सदस्य?"}</Label>
                      <select className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring outline-none" value={form.shg} onChange={e => setForm({ ...form, shg: e.target.value })}>
                        <option value="yes">{language === "en" ? "Yes" : "होय"}</option>
                        <option value="no">{language === "en" ? "No" : "नाही"}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-secondary/5 border border-secondary/20 rounded-lg p-3">
                    <input type="checkbox" id="certNeeded" className="mt-1" checked={form.certNeeded} onChange={e => setForm({ ...form, certNeeded: e.target.checked })} />
                    <label htmlFor="certNeeded" className="text-sm cursor-pointer">
                      <span className="font-semibold">{language === "en" ? "I need a certificate" : "मला प्रमाणपत्र हवे आहे"}</span>
                      <span className="text-muted-foreground ml-1">{language === "en" ? "(Widow/Divorce/Single Women Certificate for accessing schemes)" : "(योजनांचा लाभ घेण्यासाठी विधवा/घटस्फोट/एकल महिला प्रमाणपत्र)"}</span>
                    </label>
                  </div>
                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold" disabled={!form.name || !form.mobile || !form.taluka || !form.village}>
                    {t("ekal.register")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
