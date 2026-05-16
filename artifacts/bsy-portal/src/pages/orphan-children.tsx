import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { Baby, CheckCircle, ArrowRight, Shield, Banknote, BookOpen, Heart, AlertTriangle, FileText, Users } from "lucide-react";

const categories = [
  {
    key: "full_orphan",
    en: "Full Orphan",
    mr: "पूर्ण अनाथ",
    marathi: "पूर्ण अनाथ",
    desc_en: "Children who have lost both parents (father and mother both deceased)",
    desc_mr: "ज्या मुलांचे दोन्ही पालक (वडील आणि आई दोघेही मृत) गेले आहेत",
    amount: "₹2,500",
    docs_en: "Death certificates of both parents, Child's Aadhaar, Birth certificate, Ration card, Bank passbook, Guardian's Aadhaar",
    docs_mr: "दोन्ही पालकांचे मृत्यू प्रमाणपत्र, मुलाचे आधार, जन्म प्रमाणपत्र, रेशन कार्ड, बँक पासबुक, पालकाचे आधार",
    color: "bg-purple-100 border-purple-300",
    textColor: "text-purple-800",
    icon: "👨‍👩‍👧",
    priority: true,
  },
  {
    key: "covid_orphan",
    en: "COVID-19 Orphan",
    mr: "कोविड-१९ अनाथ",
    marathi: "कोविड-१९ अनाथ",
    desc_en: "Children who lost one or both parents due to COVID-19 (PM CARES linked)",
    desc_mr: "ज्या मुलांनी COVID-19 मुळे एक किंवा दोन्ही पालक गमावले (PM CARES शी जोडलेले)",
    amount: "₹2,500",
    docs_en: "COVID-19 death certificate of parent, Child's Aadhaar, Birth certificate, Ration card, Bank passbook",
    docs_mr: "पालकाचे COVID-19 मृत्यू प्रमाणपत्र, मुलाचे आधार, जन्म प्रमाणपत्र, रेशन कार्ड, बँक पासबुक",
    color: "bg-pink-100 border-pink-300",
    textColor: "text-pink-800",
    icon: "🌸",
    priority: true,
  },
  {
    key: "semi_orphan",
    en: "Semi-Orphan (Single Parent)",
    mr: "अर्ध-अनाथ (एकल पालक)",
    marathi: "अर्ध-अनाथ",
    desc_en: "Children with one parent deceased and the other unable to provide care",
    desc_mr: "एक पालक मृत आणि दुसरा काळजी घेण्यास असमर्थ असलेल्या मुलांसाठी",
    amount: "₹2,250",
    docs_en: "Death certificate of deceased parent, Medical/income documents of surviving parent, Child's Aadhaar, Bank passbook",
    docs_mr: "मृत पालकाचे मृत्यू प्रमाणपत्र, जिवंत पालकाची वैद्यकीय/उत्पन्न कागदपत्रे, मुलाचे आधार, बँक पासबुक",
    color: "bg-amber-100 border-amber-300",
    textColor: "text-amber-800",
    icon: "🌻",
    priority: false,
  },
  {
    key: "chronic_illness",
    en: "Chronically Ill Parent",
    mr: "दीर्घकालीन आजारी पालक",
    marathi: "तीव्र आजारी पालक",
    desc_en: "Children whose parent has a chronic illness making them unable to earn livelihood",
    desc_mr: "ज्या मुलांचे पालक तीव्र आजारामुळे उपजीविका करण्यास असमर्थ आहेत",
    amount: "₹2,250",
    docs_en: "Medical certificate of parent's illness, Income certificate, Child's Aadhaar, Ration card, Bank passbook",
    docs_mr: "पालकाच्या आजाराचे वैद्यकीय प्रमाणपत्र, उत्पन्न प्रमाणपत्र, मुलाचे आधार, रेशन कार्ड, बँक पासबुक",
    color: "bg-green-100 border-green-300",
    textColor: "text-green-800",
    icon: "🏥",
    priority: false,
  },
  {
    key: "divorced",
    en: "Divorced / Separated Parent",
    mr: "घटस्फोटित / विभक्त पालक",
    marathi: "घटस्फोटित पालक",
    desc_en: "Children of divorced or legally separated parents where one parent is absent",
    desc_mr: "घटस्फोटित किंवा कायदेशीरपणे विभक्त पालकांची मुले जेथे एक पालक अनुपस्थित आहे",
    amount: "₹2,250",
    docs_en: "Court divorce decree or separation document, Income certificate, Child's Aadhaar, Bank passbook",
    docs_mr: "न्यायालयाचा घटस्फोट आदेश किंवा विभक्तता दस्तऐवज, उत्पन्न प्रमाणपत्र, मुलाचे आधार, बँक पासबुक",
    color: "bg-blue-100 border-blue-300",
    textColor: "text-blue-800",
    icon: "📋",
    priority: false,
  },
];

const benefits = [
  {
    icon: BookOpen,
    en: "1% Parallel Reservation in Higher Education",
    mr: "उच्च शिक्षणात 1% समांतर आरक्षण",
    desc_en: "All Maharashtra higher education admissions, MPSC, CET, PG Medical, Engineering",
    desc_mr: "महाराष्ट्र उच्च शिक्षण, MPSC, CET, PG वैद्यकीय, अभियांत्रिकी",
    tag: "Education",
  },
  {
    icon: Banknote,
    en: "100% Tuition & Exam Fee Waiver",
    mr: "100% शिक्षण आणि परीक्षा शुल्क माफी",
    desc_en: "All Govt./aided/unaided colleges if family income ≤ ₹8L/year (effective 2024-25)",
    desc_mr: "कुटुंबाचे उत्पन्न ≤ ₹8 लाख/वर्ष असल्यास सर्व सरकारी/अनुदानित/विनाअनुदानित महाविद्यालये",
    tag: "Fee Waiver",
  },
  {
    icon: Shield,
    en: "PM CARES for Children Benefits",
    mr: "PM CARES for Children लाभ",
    desc_en: "₹10L corpus at age 18, free education Class 1–12, health insurance ₹5L/year, monthly stipend",
    desc_mr: "वयाच्या 18 व्या वर्षी ₹10 लाख, Class 1–12 मोफत शिक्षण, ₹5 लाख/वर्ष आरोग्य विमा",
    tag: "Central Scheme",
  },
  {
    icon: Banknote,
    en: "AICTE Swanath Scholarship",
    mr: "AICTE स्वनाथ शिष्यवृत्ती",
    desc_en: "₹50,000/year for technical degree/diploma students (family income ≤ ₹8L)",
    desc_mr: "तांत्रिक पदवी/डिप्लोमा विद्यार्थ्यांसाठी ₹50,000/वर्ष (कुटुंब उत्पन्न ≤ ₹8 लाख)",
    tag: "Scholarship",
  },
  {
    icon: BookOpen,
    en: "National Scholarship Portal (SC/ST/OBC)",
    mr: "राष्ट्रीय शिष्यवृत्ती पोर्टल (SC/ST/OBC)",
    desc_en: "Post-matric scholarships from Class 11 to PG level for eligible categories",
    desc_mr: "पात्र श्रेणींसाठी इयत्ता 11 ते PG स्तरापर्यंत मॅट्रिकोत्तर शिष्यवृत्ती",
    tag: "Scholarship",
  },
  {
    icon: Baby,
    en: "Orphan Certificate (Anath Praman Patra)",
    mr: "अनाथ प्रमाणपत्र (Anath Praman Patra)",
    desc_en: "Official identity enabling ALL orphan-specific schemes and reservations. Issued within 3 months via Aaple Sarkar portal",
    desc_mr: "सर्व अनाथ-विशिष्ट योजना आणि आरक्षणे सक्षम करणारी अधिकृत ओळख. Aaple Sarkar पोर्टलद्वारे 3 महिन्यांत जारी",
    tag: "Certificate",
  },
];

const disqualifications = [
  { en: "Surviving parent has remarried — child becomes immediately ineligible", mr: "जिवंत पालकाने पुनर्विवाह केल्यास — मूल तात्काळ अपात्र होते" },
  { en: "Child has turned 18 years of age during the scheme year", mr: "योजनेच्या वर्षात मुलाचे वय 18 वर्षे झाले" },
  { en: "Aadhaar not seeded to the designated bank account (DBT fails)", mr: "निर्दिष्ट बँक खात्याशी आधार लिंक नाही (DBT अयशस्वी होते)" },
  { en: "KYC not completed for the bank/post-office account", mr: "बँक/पोस्ट ऑफिस खात्याचे KYC पूर्ण नाही" },
  { en: "Child enrolled in a government residential school providing full maintenance", mr: "मुल पूर्ण देखभालीसह सरकारी निवासी शाळेत नोंदणीकृत आहे" },
];

const allDocuments = [
  { en: "Child's Aadhaar Card", mr: "मुलाचे आधार कार्ड", mandatory: true },
  { en: "Parent/Guardian's Aadhaar Card", mr: "पालक/संरक्षकाचे आधार कार्ड", mandatory: true },
  { en: "Child's Birth Certificate / School Bonafide (if 6+)", mr: "मुलाचे जन्म प्रमाणपत्र / शाळेचे बोनाफाईड (6+ असल्यास)", mandatory: true },
  { en: "Death Certificate of Deceased Parent(s)", mr: "मृत पालकाचे/पालकांचे मृत्यू प्रमाणपत्र", mandatory: false },
  { en: "Income Certificate", mr: "उत्पन्न प्रमाणपत्र", mandatory: true },
  { en: "Medical / Disability Certificate of Parent (if ill)", mr: "पालकाचे वैद्यकीय/अपंगत्व प्रमाणपत्र (आजारी असल्यास)", mandatory: false },
  { en: "Divorce / Separation Legal Document (if applicable)", mr: "घटस्फोट/विभक्तता कायदेशीर दस्तऐवज (लागू असल्यास)", mandatory: false },
  { en: "Ration Card", mr: "रेशन कार्ड", mandatory: true },
  { en: "Domicile / Residency Proof", mr: "अधिवास/निवास पुरावा", mandatory: true },
  { en: "Bank Passbook / Account Details (for DBT)", mr: "बँक पासबुक/खाते तपशील (DBT साठी)", mandatory: true },
  { en: "Passport-size Photograph of Child", mr: "मुलाचा पासपोर्ट आकाराचा फोटो", mandatory: true },
  { en: "Color Family Photograph at Home", mr: "घरातील रंगीत कौटुंबिक छायाचित्र", mandatory: true },
  { en: "COVID-19 Death Certificate of Parent (COVID orphan only)", mr: "पालकाचे COVID-19 मृत्यू प्रमाणपत्र (केवळ COVID अनाथ)", mandatory: false },
];

export default function OrphanChildren() {
  const { language, t } = useLanguage();
  const [form, setForm] = useState({
    childName: "", guardianName: "", mobile: "", age: "", category: "full_orphan",
    district: "", taluka: "", village: "", school: "", class: "", income: "", aadhaarLinked: "no",
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "benefits" | "documents" | "register">("info");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary via-purple-700 to-primary text-white py-14 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <svg width="100%" height="100%" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.1" fill="white">
              <circle cx="720" cy="40" r="130" />
              <circle cx="80" cy="270" r="100" />
            </g>
            <g opacity="0.08" stroke="white" fill="none" strokeWidth="1.5">
              <circle cx="720" cy="40" r="80" />
              <circle cx="720" cy="40" r="50" />
              <circle cx="80" cy="270" r="60" />
            </g>
            {[0,1,2,3,4,5,6].map(i => (
              <circle key={i} cx={80 + i * 100} cy={130 + (i % 3) * 30} r="2.5" fill="white" opacity="0.2" />
            ))}
            <path d="M0,200 Q200,120 400,200 T800,200" stroke="white" strokeWidth="1.5" fill="none" opacity="0.1" strokeDasharray="6,4" />
          </svg>
        </div>
        <div className="container mx-auto max-w-5xl relative">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                  <Baby className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">
                    {language === "en" ? "Kranti Jyoti Savitribai Phule" : "क्रांती ज्योती सावित्रीबाई फुले"}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {language === "en" ? "Bal Sangopan Yojana — Orphan Children" : "बाल संगोपन योजना — अनाथ मुले"}
                  </h1>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-6 max-w-xl leading-relaxed">
                {language === "en"
                  ? "Maharashtra government's comprehensive support program providing monthly financial assistance, education benefits, and certificate-based reservations for orphaned and vulnerable children aged 0–18 years."
                  : "महाराष्ट्र शासनाचा सर्वसमावेशक सहाय्य कार्यक्रम जो 0-18 वर्षे वयोगटातील अनाथ आणि असुरक्षित मुलांना मासिक आर्थिक मदत, शिक्षण लाभ आणि प्रमाणपत्र-आधारित आरक्षण प्रदान करतो."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link href="/apply">
                  <Button className="bg-white text-secondary hover:bg-white/90 font-semibold gap-2">
                    {language === "en" ? "Apply Now" : "अर्ज करा"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/certificates">
                  <Button variant="outline" className="border-white text-white hover:bg-white/15 gap-2">
                    {language === "en" ? "Download Certificate" : "प्रमाणपत्र डाउनलोड करा"}
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              {[
                { n: "5", l: language === "en" ? "Categories" : "श्रेणी" },
                { n: "₹2,500", l: language === "en" ? "Max Monthly" : "कमाल मासिक" },
                { n: "0–18", l: language === "en" ? "Age Group" : "वयोगट" },
                { n: "7,500+", l: language === "en" ? "Beneficiaries" : "लाभार्थी" },
              ].map(s => (
                <div key={s.l} className="bg-white/15 rounded-xl p-3 text-center border border-white/20">
                  <div className="text-xl font-bold">{s.n}</div>
                  <div className="text-xs text-white/80 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-2 overflow-x-auto">
          {([
            ["info", language === "en" ? "Categories" : "श्रेणी"],
            ["benefits", language === "en" ? "Benefits & Schemes" : "लाभ आणि योजना"],
            ["documents", language === "en" ? "Documents" : "कागदपत्रे"],
            ["register", language === "en" ? "Enquiry / Register" : "चौकशी / नोंदणी"],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab ? "bg-secondary text-white" : "text-muted-foreground hover:text-secondary"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* INFO TAB */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => (
                <Card key={cat.key} className={`border-2 shadow-sm ${cat.color}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <span className="text-2xl">{cat.icon}</span>
                        <div>
                          <div className={cat.textColor}>{language === "en" ? cat.en : cat.mr}</div>
                          <div className="text-xs font-normal text-muted-foreground mt-0.5">{language === "en" ? cat.desc_en : cat.desc_mr}</div>
                        </div>
                      </CardTitle>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-xl font-bold text-secondary">{cat.amount}</span>
                        <span className="text-xs text-muted-foreground">{language === "en" ? "/month" : "/महिना"}</span>
                        {cat.priority && <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">{language === "en" ? "Priority" : "प्राधान्य"}</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">{language === "en" ? "Key Documents:" : "मुख्य कागदपत्रे:"}</p>
                    <p className="text-xs text-foreground">{language === "en" ? cat.docs_en : cat.docs_mr}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Disqualification */}
            <Card className="border-2 border-red-200 bg-red-50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  {language === "en" ? "Disqualification Conditions" : "अपात्रतेच्या अटी"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {disqualifications.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">✕</span>
                      {language === "en" ? d.en : d.mr}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => setActiveTab("benefits")} className="bg-secondary text-white gap-2">
                {language === "en" ? "View Benefits & Schemes" : "लाभ आणि योजना पाहा"} <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/apply">
                <Button className="bg-primary text-primary-foreground gap-2">
                  {language === "en" ? "Apply for BSY" : "BSY साठी अर्ज करा"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* BENEFITS TAB */}
        {activeTab === "benefits" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((b, i) => (
                <Card key={i} className="shadow-sm hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <b.icon className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-secondary text-sm">{language === "en" ? b.en : b.mr}</h3>
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs flex-shrink-0">{b.tag}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{language === "en" ? b.desc_en : b.desc_mr}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* BSY Benefit structure */}
            <Card className="shadow-sm border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-secondary">{language === "en" ? "BSY Monthly Payment Structure" : "BSY मासिक अदायगी संरचना"}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-semibold">{language === "en" ? "Category" : "श्रेणी"}</th>
                        <th className="text-right py-2 text-muted-foreground font-semibold">{language === "en" ? "Monthly Amount" : "मासिक रक्कम"}</th>
                        <th className="text-right py-2 text-muted-foreground font-semibold">{language === "en" ? "Payment Route" : "अदायगी मार्ग"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cat_en: "General / Single Parent", cat_mr: "सामान्य / एकल पालक", amt: "₹2,250", route: "DBT" },
                        { cat_en: "COVID-19 Orphan (one/both parents)", cat_mr: "COVID-19 अनाथ (एक/दोन्ही पालक)", amt: "₹2,500", route: "DBT" },
                        { cat_en: "Full Orphan (both parents deceased)", cat_mr: "पूर्ण अनाथ (दोन्ही पालक मृत)", amt: "₹2,500", route: "DBT" },
                        { cat_en: "Admin Grant to Sanstha (per child)", cat_mr: "संस्थेला प्रशासकीय अनुदान (प्रति मूल)", amt: "₹75", route: "To NGO" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2.5 font-medium">{language === "en" ? row.cat_en : row.cat_mr}</td>
                          <td className="py-2.5 text-right font-bold text-secondary">{row.amt}</td>
                          <td className="py-2.5 text-right">
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">{row.route}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/schemes">
                <Button variant="outline" className="border-secondary text-secondary gap-2">
                  {language === "en" ? "View All Related Schemes" : "सर्व संबंधित योजना पाहा"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allDocuments.map((doc, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm border border-border hover:border-primary/40 transition-colors">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm text-foreground font-medium">{language === "en" ? doc.en : doc.mr}</span>
                    <Badge className={`ml-2 text-xs ${doc.mandatory ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                      {doc.mandatory ? (language === "en" ? "Mandatory" : "अनिवार्य") : (language === "en" ? "If applicable" : "लागू असल्यास")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-secondary mb-2">
                  {language === "en" ? "Documents at SIR / Home Visit Stage (Protection Officer)" : "SIR / गृहभेट टप्प्यावर कागदपत्रे (संरक्षण अधिकारी)"}
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    { en: "Completed Social Investigation Report (SIR) — filled online on portal", mr: "पूर्ण सामाजिक तपास अहवाल (SIR) — पोर्टलवर ऑनलाइन भरलेला" },
                    { en: "Geo-tagged home visit photographs (minimum 2, with GPS metadata)", mr: "भू-टॅग केलेले गृहभेट छायाचित्रे (किमान 2, GPS मेटाडेटासह)" },
                    { en: "Observation notes / field assessment narrative", mr: "निरीक्षण नोट्स / क्षेत्र मूल्यांकन वृत्तांत" },
                    { en: "Cross-verification of documents during home visit", mr: "गृहभेटी दरम्यान कागदपत्रांची क्रॉस-पडताळणी" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-secondary flex-shrink-0 mt-0.5" />
                      {language === "en" ? item.en : item.mr}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/apply">
                <Button className="bg-secondary text-white gap-2 font-semibold">
                  {language === "en" ? "Start Application" : "अर्ज सुरू करा"} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* REGISTER TAB */}
        {activeTab === "register" && (
          submitted ? (
            <Card className="shadow-md max-w-lg mx-auto">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-secondary text-lg mb-2">
                  {language === "en" ? "Enquiry Submitted!" : "चौकशी सादर केली!"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "en"
                    ? "Your enquiry has been registered. A Facilitator or GIMABA officer will contact you within 5 working days to guide you through the full application process."
                    : "तुमची चौकशी नोंदणीकृत केली आहे. एक सुलभक किंवा GIMABA अधिकारी संपूर्ण अर्ज प्रक्रियेतून मार्गदर्शन करण्यासाठी 5 कार्य दिवसांत तुमच्याशी संपर्क साधेल."}
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <Link href="/apply">
                    <Button className="bg-secondary text-white" size="sm">
                      {language === "en" ? "Apply Online Now" : "आता ऑनलाइन अर्ज करा"}
                    </Button>
                  </Link>
                  <Link href="/certificates">
                    <Button variant="outline" size="sm" className="border-secondary text-secondary">
                      {language === "en" ? "Download Certificate" : "प्रमाणपत्र डाउनलोड करा"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-md max-w-2xl mx-auto">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">{language === "en" ? "Orphan Child Enquiry Form" : "अनाथ मूल चौकशी अर्ज"}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {language === "en"
                    ? "Fill this form to enquire about BSY eligibility. A Facilitator will guide you through the complete application process."
                    : "BSY पात्रतेबाबत चौकशी करण्यासाठी हा फॉर्म भरा. एक सुलभक तुम्हाला संपूर्ण अर्ज प्रक्रियेत मार्गदर्शन करेल."}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Child's Full Name *" : "मुलाचे संपूर्ण नाव *"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "As per Aadhaar" : "आधारनुसार"} value={form.childName} onChange={e => setForm({ ...form, childName: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Guardian's Name *" : "पालक/संरक्षकाचे नाव *"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "Guardian / relative name" : "पालक/नातेवाईकाचे नाव"} value={form.guardianName} onChange={e => setForm({ ...form, guardianName: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Mobile Number *" : "मोबाईल क्रमांक *"}</Label>
                      <Input className="mt-1" placeholder="10-digit mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required maxLength={10} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Child's Age *" : "मुलाचे वय *"}</Label>
                      <Input className="mt-1" type="number" min="0" max="18" placeholder={language === "en" ? "0–18 years" : "0–18 वर्षे"} value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Category *" : "श्रेणी *"}</Label>
                      <select className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring outline-none" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {categories.map(c => <option key={c.key} value={c.key}>{language === "en" ? c.en : c.mr}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "District *" : "जिल्हा *"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "e.g. Jalgaon" : "उदा. जळगाव"} value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Taluka *" : "तालुका *"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "Taluka name" : "तालुक्याचे नाव"} value={form.taluka} onChange={e => setForm({ ...form, taluka: e.target.value })} required />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Village / Ward" : "गाव / वार्ड"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "Village name" : "गावाचे नाव"} value={form.village} onChange={e => setForm({ ...form, village: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "School Name" : "शाळेचे नाव"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "Current school (if applicable)" : "सध्याची शाळा (लागू असल्यास)"} value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Class / Standard" : "इयत्ता"}</Label>
                      <Input className="mt-1" placeholder={language === "en" ? "e.g. 7th Standard" : "उदा. 7वी"} value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Guardian Annual Income (₹)" : "पालक वार्षिक उत्पन्न (₹)"}</Label>
                      <Input className="mt-1" type="number" placeholder="0" value={form.income} onChange={e => setForm({ ...form, income: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">{language === "en" ? "Aadhaar Linked to Bank?" : "आधार बँकेशी जोडलेले आहे का?"}</Label>
                      <select className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring outline-none" value={form.aadhaarLinked} onChange={e => setForm({ ...form, aadhaarLinked: e.target.value })}>
                        <option value="yes">{language === "en" ? "Yes" : "होय"}</option>
                        <option value="no">{language === "en" ? "No / Not sure" : "नाही / माहित नाही"}</option>
                      </select>
                    </div>
                  </div>

                  {form.aadhaarLinked === "no" && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700">
                        {language === "en"
                          ? "Aadhaar seeding to bank account is mandatory for DBT payment. Please visit your nearest bank branch or Common Service Centre (CSC) to complete this before the application is processed."
                          : "DBT अदायगीसाठी बँक खात्याशी आधार जोडणे अनिवार्य आहे. अर्ज प्रक्रिया करण्यापूर्वी कृपया जवळच्या बँक शाखा किंवा CSC ला भेट द्या."}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold"
                    disabled={!form.childName || !form.guardianName || !form.mobile || !form.district || !form.taluka}
                  >
                    {language === "en" ? "Submit Enquiry" : "चौकशी सादर करा"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    {language === "en"
                      ? "Ready to apply directly? "
                      : "थेट अर्ज करायचा आहे? "}
                    <Link href="/apply" className="text-secondary font-semibold underline">
                      {language === "en" ? "Start full application →" : "संपूर्ण अर्ज सुरू करा →"}
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
