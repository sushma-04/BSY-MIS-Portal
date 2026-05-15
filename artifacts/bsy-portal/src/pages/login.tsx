import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { useSendOtp, useVerifyOtp, useStaffLogin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, Users, ArrowRight, Eye, EyeOff } from "lucide-react";

type LoginMode = "applicant" | "staff";

const staffRoles = [
  { value: "gimaba", en: "GIMABA / District WCD Officer", mr: "GIMABA / जिल्हा WCD अधिकारी" },
  { value: "po", en: "Protection Officer (PO)", mr: "संरक्षण अधिकारी (PO)" },
  { value: "pwc", en: "PWC Committee Member", mr: "PWC समिती सदस्य" },
  { value: "sanstha", en: "Sanstha / NGO", mr: "संस्था / NGO" },
  { value: "facilitator", en: "Facilitator (e-Suvidha / Anganwadi)", mr: "सुलभक (ई-सुविधा / अंगणवाडी)" },
];

export default function Login() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [mode, setMode] = useState<LoginMode>("applicant");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState(""); // dev helper
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("gimaba");
  const [showPw, setShowPw] = useState(false);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();
  const staffLogin = useStaffLogin();

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      toast({ title: language === "en" ? "Invalid mobile number" : "अवैध मोबाईल क्रमांक", variant: "destructive" });
      return;
    }
    sendOtp.mutate({ data: { mobile } }, {
      onSuccess: (res) => {
        setOtpSent(true);
        setOtpValue((res as any).otp || "");
        toast({ title: language === "en" ? "OTP Sent" : "OTP पाठवला", description: language === "en" ? `OTP sent to ${mobile}` : `${mobile} वर OTP पाठवला` });
      },
      onError: () => toast({ title: t("common.error"), variant: "destructive" }),
    });
  };

  const handleVerifyOtp = () => {
    verifyOtp.mutate({ data: { mobile, otp } }, {
      onSuccess: () => {
        toast({ title: language === "en" ? "Login Successful" : "लॉगिन यशस्वी" });
        setLocation("/dashboard");
      },
      onError: () => toast({ title: language === "en" ? "Invalid OTP" : "अवैध OTP", variant: "destructive" }),
    });
  };

  const handleStaffLogin = () => {
    staffLogin.mutate({ data: { username, password, role } }, {
      onSuccess: () => {
        toast({ title: language === "en" ? "Login Successful" : "लॉगिन यशस्वी" });
        setLocation("/dashboard");
      },
      onError: () => toast({ title: language === "en" ? "Invalid credentials" : "अवैध प्रमाणपत्रे", variant: "destructive" }),
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">{t("login.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("login.subtitle")}</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-lg border border-border bg-white mb-6 p-1">
          <button
            onClick={() => setMode("applicant")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${mode === "applicant" ? "bg-primary text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
            data-testid="tab-applicant"
          >
            <User className="h-4 w-4" />
            {t("login.applicant")}
          </button>
          <button
            onClick={() => setMode("staff")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold transition-all ${mode === "staff" ? "bg-secondary text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
            data-testid="tab-staff"
          >
            <Users className="h-4 w-4" />
            {t("login.staff")}
          </button>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6">
            {mode === "applicant" ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mobile" className="font-semibold">{t("login.mobile")}</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder={language === "en" ? "10-digit mobile number" : "१०-अंकी मोबाईल क्रमांक"}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={10}
                      disabled={otpSent}
                      data-testid="input-mobile"
                      className="flex-1"
                    />
                    {!otpSent && (
                      <Button onClick={handleSendOtp} disabled={sendOtp.isPending} data-testid="btn-send-otp" className="bg-primary">
                        {sendOtp.isPending ? t("common.loading") : t("login.sendOtp")}
                      </Button>
                    )}
                  </div>
                </div>
                {otpSent && (
                  <div className="space-y-3 animate-in fade-in">
                    {otpValue && (
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        {language === "en" ? "Demo OTP:" : "डेमो OTP:"} <strong className="font-mono">{otpValue}</strong>
                      </div>
                    )}
                    <div>
                      <Label htmlFor="otp" className="font-semibold">{t("login.enterOtp")}</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder={language === "en" ? "Enter 6-digit OTP" : "६-अंकी OTP प्रविष्ट करा"}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        data-testid="input-otp"
                        className="mt-1.5 font-mono tracking-widest text-lg"
                      />
                    </div>
                    <Button onClick={handleVerifyOtp} disabled={verifyOtp.isPending || otp.length !== 6} className="w-full bg-primary" data-testid="btn-verify-otp">
                      {verifyOtp.isPending ? t("common.loading") : t("login.verifyOtp")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <button onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full text-sm text-muted-foreground hover:text-primary">
                      {language === "en" ? "Change mobile number" : "मोबाईल क्रमांक बदला"}
                    </button>
                  </div>
                )}
                <div className="text-center pt-2">
                  <span className="text-sm text-muted-foreground">{language === "en" ? "New user?" : "नवीन वापरकर्ता?"} </span>
                  <a href="/register" className="text-sm text-primary font-semibold hover:underline">
                    {language === "en" ? "Register here" : "येथे नोंदणी करा"}
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role" className="font-semibold">{t("login.role")}</Label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full mt-1.5 border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    data-testid="select-role"
                  >
                    {staffRoles.map((r) => (
                      <option key={r.value} value={r.value}>{language === "en" ? r.en : r.mr}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="username" className="font-semibold">{t("login.username")}</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={language === "en" ? "Mobile number / Username" : "मोबाईल क्रमांक / वापरकर्तानाव"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    data-testid="input-username"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="font-semibold">{t("login.password")}</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      placeholder={language === "en" ? "Enter password" : "पासवर्ड प्रविष्ट करा"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      data-testid="input-password"
                    />
                    <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-muted-foreground">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                  {language === "en" ? "Demo: Use mobile numbers from seeded users (e.g., 9999000002 for GIMABA)" : "डेमो: Seeded users चे मोबाईल क्रमांक वापरा"}
                </div>
                <Button onClick={handleStaffLogin} disabled={staffLogin.isPending || !username || !password} className="w-full bg-secondary" data-testid="btn-staff-login">
                  {staffLogin.isPending ? t("common.loading") : language === "en" ? "Login to Portal" : "पोर्टलवर लॉगिन करा"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {language === "en" ? "Session timeout: 30 minutes of inactivity" : "सेशन टाइमआउट: ३० मिनिटांची निष्क्रियता"}
        </p>
      </div>
    </div>
  );
}
