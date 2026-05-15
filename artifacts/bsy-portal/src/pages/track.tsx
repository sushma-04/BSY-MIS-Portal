import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const statusSteps = [
  { key: "submitted", en: "Submitted", mr: "सादर" },
  { key: "under_review", en: "GIMABA Review", mr: "GIMABA पुनरावलोकन" },
  { key: "forwarded_to_po", en: "Protection Officer SIR", mr: "संरक्षण अधिकारी SIR" },
  { key: "pwc_scheduled", en: "PWC Committee Meeting", mr: "PWC समिती बैठक" },
  { key: "approved", en: "Approved & Enrolled", mr: "मंजूर आणि नोंदणी" },
];

const statusOrder: Record<string, number> = {
  draft: -1,
  submitted: 0,
  under_review: 1,
  pending_documents: 1,
  forwarded_to_po: 2,
  sir_pending: 2,
  pwc_scheduled: 3,
  approved: 4,
  rejected: 4,
};

function getStatusColor(status: string) {
  switch (status) {
    case "approved": return "bg-green-100 text-green-800 border-green-200";
    case "rejected": return "bg-red-100 text-red-800 border-red-200";
    case "submitted": return "bg-blue-100 text-blue-800 border-blue-200";
    case "under_review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "pending_documents": return "bg-amber-100 text-amber-800 border-amber-200";
    case "forwarded_to_po": return "bg-purple-100 text-purple-800 border-purple-200";
    case "pwc_scheduled": return "bg-indigo-100 text-indigo-800 border-indigo-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusLabel(status: string, lang: string) {
  const labels: Record<string, { en: string; mr: string }> = {
    draft: { en: "Draft", mr: "मसुदा" },
    submitted: { en: "Submitted", mr: "सादर केला" },
    under_review: { en: "Under Review (GIMABA)", mr: "पुनरावलोकनाधीन (GIMABA)" },
    pending_documents: { en: "Documents Pending", mr: "कागदपत्रे प्रलंबित" },
    forwarded_to_po: { en: "Forwarded to Protection Officer", mr: "संरक्षण अधिकाऱ्यांकडे पाठवले" },
    sir_pending: { en: "SIR Pending", mr: "SIR प्रलंबित" },
    pwc_scheduled: { en: "PWC Meeting Scheduled", mr: "PWC बैठक निर्धारित" },
    approved: { en: "Approved", mr: "मंजूर" },
    rejected: { en: "Rejected", mr: "नाकारले" },
  };
  return lang === "en" ? (labels[status]?.en || status) : (labels[status]?.mr || status);
}

interface AppTrack {
  id: number;
  applicationNumber: string;
  childName: string;
  district: string;
  financialYear: string;
  status: string;
  beneficiaryCategory: string;
  aadhaarSeeded: boolean;
  submittedAt: string | null;
}

export default function Track() {
  const { language, t } = useLanguage();
  const [searchNo, setSearchNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<AppTrack | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchNo.trim()) return;
    setLoading(true);
    setFound(null);
    setNotFound(false);
    setError("");
    try {
      const res = await fetch(`/api/applications/track/${encodeURIComponent(searchNo.trim())}`);
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) { setError(t("common.error")); return; }
      const data = await res.json();
      setFound(data);
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const currentStep = found ? statusOrder[found.status] ?? -1 : -1;

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">{t("track.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "en" ? "Enter your Application Number to check the current status" : "सध्याची स्थिती तपासण्यासाठी तुमचा अर्ज क्रमांक प्रविष्ट करा"}
          </p>
        </div>

        <Card className="shadow-md mb-6">
          <CardContent className="p-6">
            <Label className="font-semibold">{t("track.appNo")}</Label>
            <div className="flex gap-3 mt-2">
              <Input
                placeholder={language === "en" ? "e.g. BSY/2025/10001" : "उदा. BSY/2025/10001"}
                value={searchNo}
                onChange={(e) => setSearchNo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-testid="input-app-number"
                className="flex-1 font-mono"
              />
              <Button onClick={handleSearch} disabled={!searchNo.trim() || loading} className="bg-primary" data-testid="btn-track-search">
                {loading ? t("common.loading") : t("track.submit")}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === "en" ? "Try: BSY/2025/10001, BSY/2025/10002, BSY/2025/10003, BSY/2025/10004, BSY/2025/10005" : "प्रयत्न करा: BSY/2025/10001, BSY/2025/10002 ..."}
            </p>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50 mb-4">
            <CardContent className="p-4 text-center text-red-600 text-sm">{error}</CardContent>
          </Card>
        )}

        {notFound && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
              <p className="font-semibold text-red-700">{language === "en" ? "Application Not Found" : "अर्ज सापडला नाही"}</p>
              <p className="text-sm text-red-600 mt-1">{language === "en" ? `No application found with number: ${searchNo}` : `${searchNo} क्रमांकाचा अर्ज सापडला नाही`}</p>
            </CardContent>
          </Card>
        )}

        {found && (
          <div className="space-y-4 animate-in fade-in">
            <Card className="shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{language === "en" ? "Application Details" : "अर्जाचा तपशील"}</CardTitle>
                  <Badge className={`text-xs font-semibold border ${getStatusColor(found.status)}`}>
                    {getStatusLabel(found.status, language)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">{language === "en" ? "Application No." : "अर्ज क्र."}</span><div className="font-mono font-semibold text-primary">{found.applicationNumber}</div></div>
                  <div><span className="text-muted-foreground">{language === "en" ? "Child Name" : "मुलाचे नाव"}</span><div className="font-semibold">{found.childName}</div></div>
                  <div><span className="text-muted-foreground">{language === "en" ? "District" : "जिल्हा"}</span><div className="font-semibold">{found.district}</div></div>
                  <div><span className="text-muted-foreground">{language === "en" ? "Financial Year" : "आर्थिक वर्ष"}</span><div className="font-semibold">{found.financialYear}</div></div>
                  <div><span className="text-muted-foreground">{language === "en" ? "Category" : "श्रेणी"}</span><div className="font-semibold capitalize">{found.beneficiaryCategory.replace(/_/g, " ")}</div></div>
                  <div><span className="text-muted-foreground">{language === "en" ? "Aadhaar Linked" : "आधार लिंक"}</span><div className={`font-semibold ${found.aadhaarSeeded ? "text-green-600" : "text-red-500"}`}>{found.aadhaarSeeded ? (language === "en" ? "✓ Yes" : "✓ होय") : (language === "en" ? "✗ No" : "✗ नाही")}</div></div>
                </div>
              </CardContent>
            </Card>

            {found.status === "rejected" ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <XCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <p className="font-semibold text-red-700">{language === "en" ? "Application Rejected" : "अर्ज नाकारला"}</p>
                  <p className="text-sm text-red-600 mt-1">{language === "en" ? "Your application was not approved by the PWC Committee. You may re-apply in the next window (January–March)." : "तुमचा अर्ज PWC समितीने मंजूर केला नाही. तुम्ही पुढील विंडो (जानेवारी–मार्च) मध्ये पुन्हा अर्ज करू शकता."}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{language === "en" ? "Application Progress" : "अर्जाची प्रगती"}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {statusSteps.map((step, idx) => {
                      const isCompleted = currentStep > idx;
                      const isCurrent = currentStep === idx;
                      return (
                        <div key={step.key} className="flex items-center gap-4">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors border-2 ${isCompleted ? "bg-green-500 border-green-500" : isCurrent ? "bg-primary border-primary" : "bg-white border-border"}`}>
                            {isCompleted ? <CheckCircle className="h-5 w-5 text-white" /> : isCurrent ? <Clock className="h-4 w-4 text-white animate-pulse" /> : <span className="text-xs text-muted-foreground font-semibold">{idx + 1}</span>}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm font-semibold ${isCompleted ? "text-green-700" : isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                              {language === "en" ? step.en : step.mr}
                            </div>
                            {isCurrent && (
                              <div className="text-xs text-primary font-medium mt-0.5">
                                {language === "en" ? "▶ Current Stage" : "▶ सध्याची स्थिती"}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {found.status === "pending_documents" && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-700 text-sm">{language === "en" ? "Action Required" : "कृती आवश्यक"}</p>
                    <p className="text-xs text-amber-600 mt-1">{language === "en" ? "Additional documents have been requested. Please login and upload them to continue." : "अतिरिक्त कागदपत्रे मागवण्यात आली आहेत. कृपया लॉगिन करा आणि ती अपलोड करा."}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
