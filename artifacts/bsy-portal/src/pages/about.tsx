import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { Link } from "wouter";
import { BookOpen, Target, CheckCircle, Phone, Globe, MapPin, ArrowRight } from "lucide-react";

export default function About() {
  const { language } = useLanguage();

  const timeline = [
    { year: "2008", en: "Scheme launched by Maharashtra Government for orphaned and vulnerable children", mr: "अनाथ आणि असुरक्षित मुलांसाठी महाराष्ट्र सरकारकडून योजना सुरू" },
    { year: "2015", en: "Scheme expanded to include children of chronically ill parents and COVID-affected families", mr: "तीव्र आजारी पालकांच्या आणि कोविड-बाधित कुटुंबांच्या मुलांसाठी योजना विस्तारित" },
    { year: "2019", en: "Monthly grant revised to ₹2,250 / ₹2,500. DBT (Direct Benefit Transfer) enabled", mr: "मासिक अनुदान ₹२,२५० / ₹२,५०० ला सुधारित. DBT (थेट लाभ हस्तांतरण) सक्षम" },
    { year: "2021", en: "COVID-19 orphan category added. PM CARES for Children linked", mr: "कोविड-१९ अनाथ श्रेणी जोडली. PM CARES for Children लिंक केले" },
    { year: "2023", en: "Scheme renamed to Kranti Jyoti Savitribai Phule Bal Sangopan Yojana", mr: "योजनेचे नाव क्रांती ज्योती सावित्रीबाई फुले बाल संगोपन योजना असे बदलण्यात आले" },
    { year: "2025", en: "Digital MIS portal launched for end-to-end application and payment tracking", mr: "एंड-टू-एंड अर्ज आणि अदायगी ट्रॅकिंगसाठी डिजिटल MIS पोर्टल लॉन्च" },
  ];

  const roles = [
    { title_en: "Applicant / Guardian", title_mr: "अर्जदार / पालक", desc_en: "Registers and submits application with required documents. Receives DBT payments and status updates.", desc_mr: "आवश्यक कागदपत्रांसह नोंदणी करतो आणि अर्ज सादर करतो. DBT अदायगी आणि स्थिती अपडेट प्राप्त करतो.", color: "bg-pink-100 border-pink-200 text-pink-800" },
    { title_en: "Sanstha / NGO", title_mr: "संस्था / NGO", desc_en: "Licensed NGOs that enroll beneficiaries and submit cases. Receive administrative grants of ₹75/child/month.", desc_mr: "परवानाधारक NGO जे लाभार्थ्यांना नोंदवतात आणि प्रकरणे सादर करतात. ₹७५/मूल/महिना प्रशासकीय अनुदान प्राप्त करतात.", color: "bg-green-100 border-green-200 text-green-800" },
    { title_en: "GIMABA / District WCD", title_mr: "GIMABA / जिल्हा WCD", desc_en: "Reviews applications, forwards for home visit, maintains district records, and uploads annual reports.", desc_mr: "अर्जांचे पुनरावलोकन करते, गृहभेटीसाठी पाठवते, जिल्हा नोंदी ठेवते आणि वार्षिक अहवाल अपलोड करते.", color: "bg-blue-100 border-blue-200 text-blue-800" },
    { title_en: "Protection Officer (PO)", title_mr: "संरक्षण अधिकारी (PO)", desc_en: "Conducts Social Investigation Report (SIR), home visits, and verification of child's living conditions.", desc_mr: "सामाजिक तपास अहवाल (SIR), गृहभेट आणि मुलाच्या राहणीमान परिस्थितीची पडताळणी करतो.", color: "bg-purple-100 border-purple-200 text-purple-800" },
    { title_en: "PWC Committee", title_mr: "PWC समिती", desc_en: "Child Welfare Committee that reviews SIR reports and approves/rejects applications in formal quarterly meetings.", desc_mr: "बाल कल्याण समिती जी SIR अहवालांचे पुनरावलोकन करते आणि औपचारिक त्रैमासिक बैठकांमध्ये अर्ज मंजूर/नाकारते.", color: "bg-indigo-100 border-indigo-200 text-indigo-800" },
    { title_en: "Facilitator", title_mr: "सुलभक", desc_en: "e-Suvidha Kendra / Anganwadi workers who assist applicants in filling forms and document uploads.", desc_mr: "ई-सुविधा केंद्र / अंगणवाडी कर्मचारी जे अर्जदारांना फॉर्म भरण्यात आणि कागदपत्रे अपलोड करण्यात मदत करतात.", color: "bg-yellow-100 border-yellow-200 text-yellow-800" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
            {language === "en" ? "Government of Maharashtra, WCD Department" : "महाराष्ट्र शासन, महिला व बाल विकास विभाग"}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-3">
            {language === "en" ? "About the Scheme" : "योजनेबद्दल"}
          </h1>
          <h2 className="text-lg text-primary font-semibold">
            {language === "en" ? "Kranti Jyoti Savitribai Phule Bal Sangopan Yojana" : "क्रांती ज्योती सावित्रीबाई फुले बाल संगोपन योजना"}
          </h2>
        </div>

        {/* Objective */}
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5 text-primary" />
              {language === "en" ? "Scheme Objective" : "योजनेचा उद्देश"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              {language === "en"
                ? "The main objective of Bal Sangopan Yojana is to prevent the institutionalization of children by providing family-based, non-institutional care through financial assistance. The scheme aims to ensure that vulnerable children remain within their families and communities rather than being placed in institutional care."
                : "बाल संगोपन योजनेचा मुख्य उद्देश आर्थिक मदतीद्वारे कौटुंबिक-आधारित, बिगर-संस्थात्मक काळजी प्रदान करून मुलांचे संस्थात्मीकरण रोखणे आहे. असुरक्षित मुले संस्थात्मक देखभालीत ठेवण्याऐवजी त्यांच्या कुटुंब आणि समुदायात राहतील याची खात्री करणे हे योजनेचे उद्दिष्ट आहे."}
            </p>
            <p>
              {language === "en"
                ? "Under this scheme, financial assistance is provided to children who are orphaned, semi-orphaned, from economically distressed families, or whose parents suffer from chronic illness — enabling their guardian to look after them at home without the need for institutional placement."
                : "या योजने अंतर्गत, अनाथ, अर्ध-अनाथ, आर्थिकदृष्ट्या विवंचनेत असलेल्या कुटुंबातील किंवा ज्यांचे पालक तीव्र आजाराने ग्रस्त आहेत अशा मुलांना आर्थिक मदत दिली जाते — ज्यामुळे त्यांच्या पालकाला संस्थात्मक प्लेसमेंटची गरज न पडता घरी त्यांची काळजी घेता येते."}
            </p>
          </CardContent>
        </Card>

        {/* Roles */}
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-primary" />
              {language === "en" ? "System Roles & Responsibilities" : "प्रणाली भूमिका आणि जबाबदाऱ्या"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roles.map(r => (
                <div key={r.title_en} className={`rounded-lg border p-3 ${r.color}`}>
                  <p className="font-bold text-sm mb-1">{language === "en" ? r.title_en : r.title_mr}</p>
                  <p className="text-xs leading-relaxed">{language === "en" ? r.desc_en : r.desc_mr}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-primary" />
              {language === "en" ? "Scheme Timeline" : "योजनेचा कालक्रम"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeline.map(t => (
                <div key={t.year} className="flex gap-4">
                  <div className="w-14 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {t.year}
                  </div>
                  <p className="text-sm text-muted-foreground pt-1">{language === "en" ? t.en : t.mr}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Rules */}
        <Card className="shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-base">{language === "en" ? "Key Rules & Provisions" : "मुख्य नियम आणि तरतुदी"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {[
                { en: "Application window: January 1 to March 31 every year for the next financial year", mr: "अर्ज विंडो: पुढील आर्थिक वर्षासाठी प्रत्येक वर्षी १ जानेवारी ते ३१ मार्च" },
                { en: "Benefits cease when the child completes 18 years of age or when the surviving parent remarries", mr: "मूल १८ वर्षे पूर्ण करते किंवा जिवंत पालक पुनर्विवाह करते तेव्हा लाभ बंद होतो" },
                { en: "Annual renewal required: field officer verifies child is alive and eligible in April–May", mr: "वार्षिक नूतनीकरण आवश्यक: क्षेत्र अधिकारी एप्रिल–मे मध्ये मूल जिवंत आणि पात्र आहे का ते सत्यापित करतो" },
                { en: "DBT payments are issued from June to March (10 months/year)", mr: "DBT अदायगी जून ते मार्च (वर्षातून १० महिने) दिली जाते" },
                { en: "Aadhaar must be seeded to the beneficiary's bank/post-office account for DBT", mr: "DBT साठी आधार लाभार्थ्याच्या बँक/पोस्ट ऑफिस खात्याशी लिंक असणे आवश्यक आहे" },
                { en: "Child enrolled in a government residential school providing full maintenance is ineligible", mr: "सरकारी निवासी शाळेत पूर्ण देखभालीसह नोंदणीकृत मूल अपात्र आहे" },
                { en: "SIR (Social Investigation Report) must be submitted by Protection Officer before PWC approval", mr: "PWC मंजुरीपूर्वी संरक्षण अधिकाऱ्याने SIR (सामाजिक तपास अहवाल) सादर करणे आवश्यक आहे" },
              ].map(r => (
                <li key={r.en} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{language === "en" ? r.en : r.mr}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="shadow-sm bg-secondary text-white">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">{language === "en" ? "Contact & Resources" : "संपर्क आणि संसाधने"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">WCD Department, Maharashtra</p>
                  <p className="text-white/70">3rd Floor, New Mantralaya, Mumbai - 400 032</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{language === "en" ? "Helpline" : "हेल्पलाइन"}</p>
                  <p className="text-white/70">1800-233-4444 ({language === "en" ? "Toll Free" : "टोल फ्री"})</p>
                  <p className="text-white/70">childline@maharashtra.gov.in</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{language === "en" ? "Website" : "वेबसाइट"}</p>
                  <a href="https://womenchild.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">womenchild.maharashtra.gov.in</a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link href="/apply">
            <Button size="lg" className="bg-primary text-white font-bold px-10">
              {language === "en" ? "Apply for BSY Now" : "आता BSY साठी अर्ज करा"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
