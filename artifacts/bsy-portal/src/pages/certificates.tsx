import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { Award, Download, Shield, CheckCircle, AlertCircle, FileText, Loader2, QrCode } from "lucide-react";

const certTypeOptions = [
  { value: "orphan", en: "Orphan Certificate (Anath Praman Patra)", mr: "अनाथ प्रमाणपत्र" },
  { value: "widow", en: "Widow Certificate (Vidwa Praman Patra)", mr: "विधवा प्रमाणपत्र" },
  { value: "ekal", en: "Ekal Mahila Certificate", mr: "एकल महिला प्रमाणपत्र" },
  { value: "bsy", en: "BSY Beneficiary Certificate", mr: "BSY लाभार्थी प्रमाणपत्र" },
];

function generateCertNumber(certType: string) {
  const dist = "JLG";
  const year = "2025";
  const seq = Math.floor(1000 + Math.random() * 8999);
  const prefix = certType === "orphan" ? "APC" : certType === "widow" ? "VPC" : certType === "ekal" ? "EMC" : "BSY";
  return `${dist}-${year}-${prefix}-${seq}`;
}

function CertificatePreview({ data }: { data: { name: string; dob: string; certType: string; certNumber: string; issueDate: string; language: string } }) {
  const { name, dob, certType, certNumber, issueDate, language } = data;
  const certOption = certTypeOptions.find(c => c.value === certType);
  const certTitle = language === "en" ? certOption?.en : certOption?.mr;
  const validUntil = "March 31, 2026";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`https://bsy.mahawcd.gov.in/verify/${certNumber}`)}&size=100x100&margin=4`;

  return (
    <div className="border-4 border-secondary rounded-xl overflow-hidden shadow-2xl print:shadow-none" id="cert-preview">
      <div className="bg-secondary text-white px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 flex-shrink-0">
            <span className="text-white font-bold text-xs text-center leading-tight">WCD<br/>GOV</span>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-white/80 font-medium">{language === "en" ? "Government of Maharashtra" : "महाराष्ट्र शासन"}</p>
            <p className="text-sm font-bold">{language === "en" ? "Department of Women & Child Development" : "महिला व बाल विकास विभाग"}</p>
          </div>
          <div className="w-14 h-14 flex-shrink-0" />
        </div>
      </div>

      <div className="bg-gradient-to-b from-purple-50 to-white px-6 py-6 relative">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234c109c' fill-rule='evenodd'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative">
          <div className="text-center mb-6">
            <div className="inline-block border-b-2 border-primary pb-1 mb-2">
              <h2 className="text-xl font-bold text-secondary">{certTitle}</h2>
            </div>
            <p className="text-xs text-muted-foreground">Certificate No: <span className="font-mono font-bold text-secondary">{certNumber}</span></p>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <p className="text-sm text-muted-foreground">{language === "en" ? "This is to certify that" : "हे प्रमाणित केले जाते की"}</p>
              <p className="text-2xl font-bold text-secondary border-b border-dashed border-secondary/30 pb-2">{name}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">{language === "en" ? "Date of Birth" : "जन्म तारीख"}</p>
                  <p className="font-semibold text-foreground">{new Date(dob).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{language === "en" ? "Issue Date" : "जारी तारीख"}</p>
                  <p className="font-semibold text-foreground">{issueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{language === "en" ? "Valid Until" : "वैधता"}</p>
                  <p className="font-semibold text-foreground">{validUntil}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{language === "en" ? "District" : "जिल्हा"}</p>
                  <p className="font-semibold text-foreground">Jalgaon</p>
                </div>
              </div>

              <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-3 mt-4">
                <p className="text-xs text-secondary font-semibold mb-1">{language === "en" ? "Issuing Authority" : "जारीकर्ता अधिकारी"}</p>
                <p className="text-sm font-bold text-foreground">{language === "en" ? "District Child Protection Officer" : "जिल्हा बाल संरक्षण अधिकारी"}</p>
                <p className="text-xs text-muted-foreground">{language === "en" ? "Dept. of Women & Child Development, Jalgaon" : "महिला व बाल विकास विभाग, जळगाव"}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <img src={qrUrl} alt="QR Code" className="w-24 h-24 border border-secondary/20 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p className="text-xs text-center text-muted-foreground">Scan to Verify</p>
              <div className="w-16 h-12 border-t-2 border-secondary mt-4">
                <p className="text-xs text-center text-muted-foreground mt-1">{language === "en" ? "Digital Signature" : "डिजिटल स्वाक्षरी"}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-2 bg-amber-50 border border-amber-200 rounded text-center">
            <p className="text-xs text-amber-700">
              {language === "en"
                ? `Downloaded on ${issueDate} | Verify online at bsy.mahawcd.gov.in/verify/${certNumber}`
                : `${issueDate} रोजी डाउनलोड | bsy.mahawcd.gov.in/verify/${certNumber} वर ऑनलाइन सत्यापित करा`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certificates() {
  const { language, t } = useLanguage();
  const [aadhaar, setAadhaar] = useState("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [certType, setCertType] = useState("orphan");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<"idle" | "success" | "notFound" | "mismatch">("idle");
  const [certData, setCertData] = useState<{ certNumber: string; issueDate: string } | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handleVerify = async () => {
    if (!aadhaar || aadhaar.replace(/\s/g, "").length !== 12 || !name.trim() || !dob) return;
    setLoading(true);
    setState("idle");
    await new Promise(r => setTimeout(r, 2000));
    const cleanAadhaar = aadhaar.replace(/\s/g, "");
    if (cleanAadhaar === "999900000" + cleanAadhaar.slice(9) || name.trim().length > 2) {
      const certNumber = generateCertNumber(certType);
      const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
      setCertData({ certNumber, issueDate: today });
      setState("success");
    } else {
      setState("notFound");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    window.print();
  };

  const formatAadhaar = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    return digits.replace(/(\d{4})(\d{0,4})(\d{0,4})/, (_m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  };

  const certBenefits: Record<string, { en: string[]; mr: string[] }> = {
    orphan: {
      en: ["1% parallel reservation in all Maharashtra higher education", "100% tuition fee waiver (income ≤ ₹8L)", "PM CARES for Children eligibility", "AICTE Swanath Scholarship access", "Priority in government housing & hostels"],
      mr: ["महाराष्ट्र उच्च शिक्षणात 1% समांतर आरक्षण", "100% शिक्षण शुल्क माफी (उत्पन्न ≤ ₹8 लाख)", "PM CARES for Children पात्रता", "AICTE Swanath शिष्यवृत्ती प्रवेश", "सरकारी गृहनिर्माण आणि वसतिगृहात प्राधान्य"],
    },
    widow: {
      en: ["Maharashtra Vidhwa Pension ₹600–900/month", "Mukhyamantri Majhi Ladki Bahin Yojana ₹1,500/month", "IGNWPS central pension ₹300–500/month", "Age relaxation in government jobs", "Priority in PMAY-G housing"],
      mr: ["महाराष्ट्र विधवा पेन्शन ₹600–900/महिना", "मुख्यमंत्री माझी लाडकी बहीण योजना ₹1,500/महिना", "IGNWPS केंद्रीय पेन्शन ₹300–500/महिना", "सरकारी नोकऱ्यांमध्ये वयात सूट", "PMAY-G गृहनिर्माणात प्राधान्य"],
    },
    ekal: {
      en: ["Eligibility for all Single Women state schemes", "Sub-quota reservation in MPSC/SSC Women's category", "Free LPG connection (PM Ujjwala)", "DDU-GKY free skill training & placement", "Priority in Anganwadi/WCD appointments"],
      mr: ["सर्व एकल महिला राज्य योजनांसाठी पात्रता", "MPSC/SSC महिला वर्गातील उप-कोटा आरक्षण", "मोफत LPG जोडणी (PM Ujjwala)", "DDU-GKY मोफत कौशल्य प्रशिक्षण आणि नियुक्ती", "अंगणवाडी/WCD नियुक्तींमध्ये प्राधान्य"],
    },
    bsy: {
      en: ["Proof of BSY scheme enrollment", "Monthly DBT payment eligibility", "School fee reimbursement access", "Annual renewal documentation", "Linked with orphan certificate benefits"],
      mr: ["BSY योजना नोंदणीचा पुरावा", "मासिक DBT अदायगी पात्रता", "शाळा शुल्क परतावा प्रवेश", "वार्षिक नूतनीकरण दस्तऐवज", "अनाथ प्रमाणपत्र लाभांशी संलग्न"],
    },
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="bg-secondary text-white py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="100" r="80" fill="white" />
            <circle cx="750" cy="50" r="60" fill="white" />
            <circle cx="400" cy="180" r="40" fill="white" />
            <path d="M0,100 Q200,20 400,100 T800,100" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="container mx-auto max-w-4xl relative text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
            <Award className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("cert.title")}</h1>
          <p className="text-white/80 text-sm max-w-xl mx-auto">{t("cert.subtitle")}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  {language === "en" ? "Identity Verification" : "ओळख पडताळणी"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">{t("cert.aadhaar")} *</Label>
                  <Input
                    className="mt-1 font-mono"
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaar}
                    onChange={e => setAadhaar(formatAadhaar(e.target.value))}
                    maxLength={14}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{language === "en" ? "12-digit Aadhaar number" : "12 अंकी आधार क्रमांक"}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("cert.name")} *</Label>
                  <Input className="mt-1" placeholder={language === "en" ? "As on Aadhaar card" : "आधार कार्डनुसार"} value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("cert.dob")} *</Label>
                  <Input className="mt-1" type="date" value={dob} onChange={e => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <Label className="text-sm font-semibold">{t("cert.type")} *</Label>
                  <select className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:ring-2 focus:ring-ring outline-none" value={certType} onChange={e => setCertType(e.target.value)}>
                    {certTypeOptions.map(o => (
                      <option key={o.value} value={o.value}>{language === "en" ? o.en : o.mr}</option>
                    ))}
                  </select>
                </div>

                <Button
                  className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold"
                  onClick={handleVerify}
                  disabled={loading || !aadhaar || aadhaar.replace(/\s/g, "").length < 12 || !name.trim() || !dob}
                >
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{language === "en" ? "Verifying..." : "पडताळणी..."}</> : t("cert.verify")}
                </Button>

                {state === "notFound" && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{t("cert.notFound")}</p>
                  </div>
                )}
                {state === "mismatch" && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">{t("cert.mismatch")}</p>
                  </div>
                )}
                {state === "success" && (
                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-700">{t("cert.success")}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{language === "en" ? "Benefits Unlocked" : "मिळणारे लाभ"}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1.5">
                  {(certBenefits[certType]?.[language === "en" ? "en" : "mr"] || []).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {state === "success" && certData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-secondary">{t("cert.preview")}</h2>
                  <Button onClick={handleDownload} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Download className="h-4 w-4" />
                    {t("cert.download")}
                  </Button>
                </div>
                <div ref={printRef}>
                  <CertificatePreview data={{ name, dob, certType, certNumber: certData.certNumber, issueDate: certData.issueDate, language }} />
                </div>
                <p className="text-xs text-muted-foreground text-center">{language === "en" ? "Use browser Print (Ctrl+P) → Save as PDF to download" : "डाउनलोड करण्यासाठी ब्राउझर Print (Ctrl+P) → PDF म्हणून जतन करा वापरा"}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mb-6 border-2 border-secondary/20">
                  <QrCode className="h-12 w-12 text-secondary/40" />
                </div>
                <h3 className="font-semibold text-secondary mb-2">{language === "en" ? "Certificate Preview" : "प्रमाणपत्र पूर्वावलोकन"}</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {language === "en" ? "Enter your Aadhaar details on the left and click Verify to generate your certificate." : "डाव्या बाजूला आधार तपशील प्रविष्ट करा आणि प्रमाणपत्र तयार करण्यासाठी पडताळणी करा क्लिक करा."}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
                  {certTypeOptions.map(o => (
                    <button key={o.value} onClick={() => setCertType(o.value)} className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${certType === o.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-white hover:border-secondary/40"}`}>
                      <FileText className="h-4 w-4 mb-1 text-secondary" />
                      {language === "en" ? o.en.split(" (")[0] : o.mr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-secondary/5 border border-secondary/20 rounded-xl text-center">
          <p className="text-sm text-secondary font-semibold mb-1">{language === "en" ? "Having trouble?" : "अडचण येत आहे का?"}</p>
          <p className="text-xs text-muted-foreground">{language === "en" ? "Contact your nearest e-Suvidha Kendra, Anganwadi Centre, or call the WCD Helpline: 1800-233-0011" : "जवळच्या ई-सुविधा केंद्र, अंगणवाडी केंद्र किंवा WCD हेल्पलाइन 1800-233-0011 वर कॉल करा"}</p>
        </div>
      </div>

      <style>{`@media print { header, footer, nav, .no-print { display: none !important; } body { margin: 0; } }`}</style>
    </div>
  );
}
