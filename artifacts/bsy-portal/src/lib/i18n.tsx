import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "mr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About Scheme",
    "nav.schemes": "Related Schemes",
    "nav.track": "Track Status",
    "nav.apply": "Apply Now",
    "nav.login": "Login",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Logout",
    
    "home.hero.title": "Kranti Jyoti Savitribai Phule Bal Sangopan Yojana",
    "home.hero.subtitle": "Government of Maharashtra's initiative to provide financial assistance to orphaned and vulnerable children for their upbringing, education, and rehabilitation.",
    "home.hero.cta": "Apply for Assistance",
    "home.hero.track": "Track Application",
    
    "home.eligibility.title": "Who is Eligible?",
    "home.eligibility.orphan": "Orphaned children (both parents deceased)",
    "home.eligibility.semiOrphan": "Children with one parent deceased",
    "home.eligibility.chronic": "Children of parents with chronic illness",
    "home.eligibility.divorced": "Children of divorced/separated parents",
    "home.eligibility.age": "Age between 0 to 18 years",
    "home.eligibility.income": "Annual family income less than prescribed limit",
    
    "home.benefits.title": "Scheme Benefits",
    "home.benefits.amount": "₹2,250 - ₹2,500 per month",
    "home.benefits.desc": "Financial assistance credited directly to the beneficiary's or joint bank account.",
    
    "about.title": "About Bal Sangopan Yojana",
    "about.objective": "The main objective of this scheme is to prevent institutionalization of children by providing family-based non-institutional care.",
    
    "login.title": "Portal Login",
    "login.subtitle": "Select your role to login to the BSY MIS Portal",
    "login.applicant": "Applicant / Citizen",
    "login.staff": "Department Staff / NGO",
    "login.mobile": "Mobile Number",
    "login.sendOtp": "Send OTP",
    "login.enterOtp": "Enter OTP",
    "login.verifyOtp": "Verify & Login",
    "login.username": "Username",
    "login.password": "Password",
    "login.role": "Role",
    
    "register.title": "New Registration",
    "register.name": "Full Name",
    "register.mobile": "Mobile Number",
    "register.submit": "Register",
    
    "track.title": "Track Application Status",
    "track.appNo": "Application Number",
    "track.submit": "Check Status",
    
    "apply.title": "Application Form",
    "apply.step1": "Child Details",
    "apply.step2": "Guardian Details",
    "apply.step3": "Bank & Address",
    "apply.step4": "Documents",
    
    "common.submit": "Submit",
    "common.cancel": "Cancel",
    "common.next": "Next",
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.error": "An error occurred. Please try again."
  },
  mr: {
    "nav.home": "मुख्य पृष्ठ",
    "nav.about": "योजनेबद्दल",
    "nav.schemes": "संबंधित योजना",
    "nav.track": "स्थिती तपासा",
    "nav.apply": "अर्ज करा",
    "nav.login": "लॉगिन",
    "nav.dashboard": "डॅशबोर्ड",
    "nav.logout": "लॉगआउट",
    
    "home.hero.title": "क्रांती ज्योती सावित्रीबाई फुले बाल संगोपन योजना",
    "home.hero.subtitle": "अनाथ आणि असुरक्षित मुलांच्या संगोपन, शिक्षण आणि पुनर्वसनासाठी आर्थिक मदत प्रदान करणारा महाराष्ट्र शासनाचा उपक्रम.",
    "home.hero.cta": "मदतीसाठी अर्ज करा",
    "home.hero.track": "अर्जाची स्थिती पहा",
    
    "home.eligibility.title": "पात्र कोण आहे?",
    "home.eligibility.orphan": "अनाथ मुले (दोन्ही पालक मृत)",
    "home.eligibility.semiOrphan": "एक पालक मृत असलेली मुले",
    "home.eligibility.chronic": "तीव्र आजार असलेल्या पालकांची मुले",
    "home.eligibility.divorced": "घटस्फोटित/विभक्त पालकांची मुले",
    "home.eligibility.age": "वय ० ते १८ वर्षे",
    "home.eligibility.income": "वार्षिक कौटुंबिक उत्पन्न विहित मर्यादेपेक्षा कमी",
    
    "home.benefits.title": "योजनेचे फायदे",
    "home.benefits.amount": "₹२,२५० - ₹२,५०० प्रति महिना",
    "home.benefits.desc": "लाभार्थ्याच्या किंवा संयुक्त बँक खात्यात थेट जमा केलेली आर्थिक मदत.",
    
    "about.title": "बाल संगोपन योजनेबद्दल",
    "about.objective": "कौटुंबिक आधारित बिगर-संस्थात्मक काळजी प्रदान करून मुलांचे संस्थात्मीकरण रोखणे हा या योजनेचा मुख्य उद्देश आहे.",
    
    "login.title": "पोर्टल लॉगिन",
    "login.subtitle": "बीएसवाय एमआयएस पोर्टलवर लॉग इन करण्यासाठी तुमची भूमिका निवडा",
    "login.applicant": "अर्जदार / नागरिक",
    "login.staff": "विभागीय कर्मचारी / स्वयंसेवी संस्था",
    "login.mobile": "मोबाईल क्रमांक",
    "login.sendOtp": "ओटीपी पाठवा",
    "login.enterOtp": "ओटीपी प्रविष्ट करा",
    "login.verifyOtp": "पडताळणी करा आणि लॉग इन करा",
    "login.username": "वापरकर्तानाव",
    "login.password": "पासवर्ड",
    "login.role": "भूमिका",
    
    "register.title": "नवीन नोंदणी",
    "register.name": "संपूर्ण नाव",
    "register.mobile": "मोबाईल क्रमांक",
    "register.submit": "नोंदणी करा",
    
    "track.title": "अर्जाची स्थिती तपासा",
    "track.appNo": "अर्ज क्रमांक",
    "track.submit": "स्थिती तपासा",
    
    "apply.title": "अर्ज",
    "apply.step1": "मुलाचा तपशील",
    "apply.step2": "पालकाचा तपशील",
    "apply.step3": "बँक आणि पत्ता",
    "apply.step4": "कागदपत्रे",
    
    "common.submit": "प्रस्तुत करा",
    "common.cancel": "रद्द करा",
    "common.next": "पुढे",
    "common.back": "मागे",
    "common.loading": "लोड होत आहे...",
    "common.error": "एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा."
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
