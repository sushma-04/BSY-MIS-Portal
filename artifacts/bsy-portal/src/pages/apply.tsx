import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { useCreateApplication, useListSanstha } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ChevronRight, ChevronLeft, FileText, User, MapPin, Banknote } from "lucide-react";

const steps = [
  { en: "Child Details", mr: "मुलाचा तपशील", icon: User },
  { en: "Guardian Details", mr: "पालकाचा तपशील", icon: User },
  { en: "Bank & Address", mr: "बँक आणि पत्ता", icon: MapPin },
  { en: "Review & Submit", mr: "पुनरावलोकन आणि सादर करा", icon: FileText },
];

const categories = [
  { value: "orphan", en: "Full Orphan (Both Parents Deceased)", mr: "पूर्ण अनाथ (दोन्ही पालक मृत)" },
  { value: "semi-orphan", en: "Semi-Orphan (One Parent Deceased)", mr: "अर्ध-अनाथ (एक पालक मृत)" },
  { value: "covid_orphan", en: "COVID-19 Orphan", mr: "कोविड-१९ अनाथ" },
  { value: "chronic_illness", en: "Parent with Chronic Illness", mr: "तीव्र आजारी पालक" },
  { value: "economic_distress", en: "Economic Distress / Separated Parents", mr: "आर्थिक संकट / विभक्त पालक" },
];

const castes = [
  { value: "SC", en: "SC (Scheduled Caste)", mr: "अनुसूचित जाती" },
  { value: "ST", en: "ST (Scheduled Tribe)", mr: "अनुसूचित जमाती" },
  { value: "OBC", en: "OBC / SBC", mr: "OBC / SBC" },
  { value: "VJNT", en: "VJNT (Vimukta Jati / Nomadic Tribe)", mr: "VJNT (विमुक्त जाती / भटक्या जमाती)" },
  { value: "General", en: "General / Open Category", mr: "सामान्य / खुला प्रवर्ग" },
];

export default function Apply() {
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const { data: sansthaData } = useListSanstha();
  const createApp = useCreateApplication();

  const [form, setForm] = useState({
    childName: "", childDob: "", childGender: "Male", aadhaarNumber: "",
    casteCateogry: "OBC", beneficiaryCategory: "semi-orphan",
    fatherStatus: "Deceased", motherStatus: "Alive",
    guardianName: "", guardianMobile: "", guardianRelationship: "Mother",
    annualIncome: "", schoolName: "", currentClass: "", sansthaId: "",
    address: "", district: "Jalgaon", taluka: "", pincode: "",
    bankAccountNumber: "", ifscCode: "", accountHolderName: "",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = (s: number) => {
    if (s === 0) return form.childName && form.childDob && form.aadhaarNumber.length === 12;
    if (s === 1) return form.guardianName && form.guardianMobile.length === 10;
    if (s === 2) return form.address && form.bankAccountNumber && form.ifscCode;
    return true;
  };

  const handleSubmit = () => {
    createApp.mutate({
      data: {
        childName: form.childName,
        childDob: form.childDob,
        childGender: form.childGender as "Male" | "Female",
        aadhaarNumber: form.aadhaarNumber,
        casteCateogry: form.casteCateogry,
        beneficiaryCategory: form.beneficiaryCategory as any,
        fatherStatus: form.fatherStatus,
        motherStatus: form.motherStatus,
        guardianName: form.guardianName,
        guardianMobile: form.guardianMobile,
        guardianRelationship: form.guardianRelationship,
        annualIncome: Number(form.annualIncome) || 0,
        schoolName: form.schoolName,
        currentClass: form.currentClass,
        sansthaId: form.sansthaId ? Number(form.sansthaId) : undefined,
        address: form.address,
        district: form.district,
        taluka: form.taluka,
        pincode: form.pincode,
        bankAccountNumber: form.bankAccountNumber,
        ifscCode: form.ifscCode,
        accountHolderName: form.accountHolderName,
        financialYear: "2025-2026",
      }
    }, {
      onSuccess: (res) => {
        toast({ title: language === "en" ? "Application Submitted Successfully!" : "अर्ज यशस्वीरित्या सादर झाला!" });
        setLocation("/dashboard");
      },
      onError: () => toast({ title: t("common.error"), variant: "destructive" }),
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-secondary">{t("apply.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "en" ? "Kranti Jyoti Savitribai Phule Bal Sangopan Yojana" : "क्रांती ज्योती सावित्रीबाई फुले बाल संगोपन योजना"}
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={s.en} className="flex items-center flex-1">
              <div className={`flex flex-col items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i < step ? "bg-green-500 text-white" : i === step ? "bg-primary text-white" : "bg-muted border-2 border-border text-muted-foreground"}`}>
                  {i < step ? <CheckCircle className="h-5 w-5" /> : i + 1}
                </div>
                <div className={`text-xs mt-1 text-center hidden sm:block ${i === step ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {language === "en" ? s.en : s.mr}
                </div>
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 flex-1 mx-2 ${i < step ? "bg-green-500" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">{language === "en" ? steps[step].en : steps[step].mr}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Child's Full Name *" : "मुलाचे संपूर्ण नाव *"}</Label>
                    <Input className="mt-1" value={form.childName} onChange={e => set("childName", e.target.value)} placeholder={language === "en" ? "As per birth certificate" : "जन्म प्रमाणपत्रानुसार"} data-testid="input-childName" />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Date of Birth *" : "जन्म तारीख *"}</Label>
                    <Input className="mt-1" type="date" value={form.childDob} onChange={e => set("childDob", e.target.value)} data-testid="input-childDob" />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Gender *" : "लिंग *"}</Label>
                    <select className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.childGender} onChange={e => set("childGender", e.target.value)} data-testid="select-gender">
                      <option value="Male">{language === "en" ? "Male" : "पुरुष"}</option>
                      <option value="Female">{language === "en" ? "Female" : "महिला"}</option>
                      <option value="Other">{language === "en" ? "Other" : "इतर"}</option>
                    </select>
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Aadhaar Number *" : "आधार क्रमांक *"}</Label>
                    <Input className="mt-1 font-mono" value={form.aadhaarNumber} onChange={e => set("aadhaarNumber", e.target.value)} maxLength={12} placeholder="XXXX XXXX XXXX" data-testid="input-aadhaar" />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Caste Category *" : "जाती श्रेणी *"}</Label>
                    <select className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.casteCateogry} onChange={e => set("casteCateogry", e.target.value)}>
                      {castes.map(c => <option key={c.value} value={c.value}>{language === "en" ? c.en : c.mr}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Beneficiary Category *" : "लाभार्थी श्रेणी *"}</Label>
                    <select className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.beneficiaryCategory} onChange={e => set("beneficiaryCategory", e.target.value)} data-testid="select-category">
                      {categories.map(c => <option key={c.value} value={c.value}>{language === "en" ? c.en : c.mr}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Father's Status *" : "वडिलांची स्थिती *"}</Label>
                    <select className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.fatherStatus} onChange={e => set("fatherStatus", e.target.value)}>
                      {["Alive", "Deceased", "Unknown", "Absconded", "Ill"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Mother's Status *" : "आईची स्थिती *"}</Label>
                    <select className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.motherStatus} onChange={e => set("motherStatus", e.target.value)}>
                      {["Alive", "Deceased", "Unknown", "Absconded", "Ill"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">{language === "en" ? "School Name" : "शाळेचे नाव"}</Label>
                    <Input className="mt-1" value={form.schoolName} onChange={e => set("schoolName", e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Current Class" : "सध्याचा वर्ग"}</Label>
                    <Input className="mt-1" value={form.currentClass} onChange={e => set("currentClass", e.target.value)} placeholder="e.g. 5th" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Guardian Full Name *" : "संरक्षकाचे संपूर्ण नाव *"}</Label>
                    <Input className="mt-1" value={form.guardianName} onChange={e => set("guardianName", e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Guardian Mobile *" : "संरक्षकाचा मोबाईल *"}</Label>
                    <Input className="mt-1" type="tel" maxLength={10} value={form.guardianMobile} onChange={e => set("guardianMobile", e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Relationship with Child *" : "मुलाशी संबंध *"}</Label>
                    <select className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.guardianRelationship} onChange={e => set("guardianRelationship", e.target.value)}>
                      {["Mother", "Father", "Grandmother", "Grandfather", "Uncle", "Aunt", "Other"].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Annual Family Income (₹) *" : "वार्षिक कौटुंबिक उत्पन्न (₹) *"}</Label>
                    <Input className="mt-1" type="number" value={form.annualIncome} onChange={e => set("annualIncome", e.target.value)} placeholder="e.g. 85000" />
                  </div>
                </div>
                {sansthaData && (
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Sanstha / NGO (if applicable)" : "संस्था / NGO (लागू असल्यास)"}</Label>
                    <select className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.sansthaId} onChange={e => set("sansthaId", e.target.value)}>
                      <option value="">{language === "en" ? "-- Select Sanstha --" : "-- संस्था निवडा --"}</option>
                      {sansthaData.sanstha?.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s.district})</option>)}
                    </select>
                  </div>
                )}
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  {language === "en" ? "Note: Guardian must have a valid Aadhaar card and a bank account linked to their Aadhaar for DBT payments." : "टीप: DBT अदायगींसाठी संरक्षकाकडे वैध आधार कार्ड आणि आधार-लिंक बँक खाते असणे आवश्यक आहे."}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">{language === "en" ? "Full Address *" : "संपूर्ण पत्ता *"}</Label>
                  <textarea
                    className="w-full mt-1 border border-input rounded-md px-3 py-2 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={2}
                    value={form.address}
                    onChange={e => set("address", e.target.value)}
                    placeholder={language === "en" ? "House/Ward, Street, Village/Town" : "घर/वार्ड, रस्ता, गाव/शहर"}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">{language === "en" ? "District *" : "जिल्हा *"}</Label>
                    <Input className="mt-1" value={form.district} onChange={e => set("district", e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Taluka" : "तालुका"}</Label>
                    <Input className="mt-1" value={form.taluka} onChange={e => set("taluka", e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Pincode" : "पिनकोड"}</Label>
                    <Input className="mt-1" maxLength={6} value={form.pincode} onChange={e => set("pincode", e.target.value)} />
                  </div>
                </div>
                <hr className="my-4" />
                <p className="text-sm font-bold text-secondary mb-2">{language === "en" ? "Bank Account Details (for DBT)" : "बँक खात्याचा तपशील (DBT साठी)"}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">{language === "en" ? "Account Number *" : "खाता क्रमांक *"}</Label>
                    <Input className="mt-1 font-mono" value={form.bankAccountNumber} onChange={e => set("bankAccountNumber", e.target.value)} />
                  </div>
                  <div>
                    <Label className="font-semibold">{language === "en" ? "IFSC Code *" : "IFSC कोड *"}</Label>
                    <Input className="mt-1 font-mono uppercase" value={form.ifscCode} onChange={e => set("ifscCode", e.target.value.toUpperCase())} placeholder="e.g. MAHB0001234" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="font-semibold">{language === "en" ? "Account Holder Name" : "खातेधारकाचे नाव"}</Label>
                    <Input className="mt-1" value={form.accountHolderName} onChange={e => set("accountHolderName", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                  {language === "en" ? "Please review your application details before submitting." : "सादर करण्यापूर्वी कृपया तुमच्या अर्जाचा तपशील तपासा."}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-bold text-secondary mb-2">{language === "en" ? "Child Details" : "मुलाचा तपशील"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-muted-foreground">{language === "en" ? "Name" : "नाव"}:</span> <span className="font-medium">{form.childName}</span></div>
                      <div><span className="text-muted-foreground">{language === "en" ? "DOB" : "जन्म तारीख"}:</span> <span className="font-medium">{form.childDob}</span></div>
                      <div><span className="text-muted-foreground">{language === "en" ? "Category" : "श्रेणी"}:</span> <span className="font-medium capitalize">{form.beneficiaryCategory.replace(/_/g, " ")}</span></div>
                      <div><span className="text-muted-foreground">{language === "en" ? "Aadhaar" : "आधार"}:</span> <span className="font-mono font-medium">{form.aadhaarNumber}</span></div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-bold text-secondary mb-2">{language === "en" ? "Guardian Details" : "पालकाचा तपशील"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-muted-foreground">{language === "en" ? "Name" : "नाव"}:</span> <span className="font-medium">{form.guardianName}</span></div>
                      <div><span className="text-muted-foreground">{language === "en" ? "Mobile" : "मोबाईल"}:</span> <span className="font-mono font-medium">{form.guardianMobile}</span></div>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="font-bold text-secondary mb-2">{language === "en" ? "Bank & Address" : "बँक आणि पत्ता"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-muted-foreground">{language === "en" ? "Bank A/C" : "बँक खाता"}:</span> <span className="font-mono font-medium">{form.bankAccountNumber}</span></div>
                      <div><span className="text-muted-foreground">IFSC:</span> <span className="font-mono font-medium">{form.ifscCode}</span></div>
                      <div className="col-span-2"><span className="text-muted-foreground">{language === "en" ? "Address" : "पत्ता"}:</span> <span className="font-medium">{form.address}, {form.taluka}, {form.district} - {form.pincode}</span></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-2">
                  <input type="checkbox" id="declaration" className="mt-1 h-4 w-4 rounded border-input accent-primary" required />
                  <label htmlFor="declaration" className="text-xs text-muted-foreground">
                    {language === "en" ? "I declare that all the information provided above is correct to the best of my knowledge. I understand that providing false information may result in rejection of the application and recovery of any benefits paid." : "मी घोषित करतो की वरील सर्व माहिती माझ्या माहितीनुसार योग्य आहे. मला समजते की चुकीची माहिती दिल्यास अर्ज नाकारला जाऊ शकतो आणि दिलेले लाभ परत मागितले जाऊ शकतात."}
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> {t("common.back")}
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!validate(step)} className="bg-primary gap-1" data-testid="btn-next-step">
                  {t("common.next")} <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={createApp.isPending} className="bg-green-600 hover:bg-green-700 gap-1" data-testid="btn-submit-app">
                  {createApp.isPending ? t("common.loading") : (language === "en" ? "Submit Application" : "अर्ज सादर करा")} <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
