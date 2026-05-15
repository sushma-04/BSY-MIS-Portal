import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
import { useSendOtp, useRegisterApplicant } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, ArrowRight } from "lucide-react";

export default function Register() {
  const { t, language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const sendOtp = useSendOtp();
  const register = useRegisterApplicant();

  const handleSendOtp = () => {
    if (!name.trim() || name.trim().length < 3) {
      toast({ title: language === "en" ? "Please enter your full name (min 3 characters)" : "कृपया संपूर्ण नाव प्रविष्ट करा (किमान ३ अक्षरे)", variant: "destructive" });
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast({ title: language === "en" ? "Invalid mobile number" : "अवैध मोबाईल क्रमांक", variant: "destructive" });
      return;
    }
    sendOtp.mutate({ data: { mobile } }, {
      onSuccess: (res) => {
        setOtpSent(true);
        setOtpValue((res as any).otp || "");
        toast({ title: language === "en" ? "OTP Sent" : "OTP पाठवला" });
      },
    });
  };

  const handleRegister = () => {
    register.mutate({ data: { mobile, name: name.trim(), otp } }, {
      onSuccess: () => {
        toast({ title: language === "en" ? "Registration Successful! Welcome to BSY Portal" : "नोंदणी यशस्वी! BSY पोर्टलवर स्वागत आहे" });
        setLocation("/dashboard");
      },
      onError: () => toast({ title: t("common.error"), variant: "destructive" }),
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary">{t("register.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {language === "en" ? "Create your account to apply for BSY benefits" : "BSY लाभांसाठी अर्ज करण्यासाठी तुमचे खाते तयार करा"}
          </p>
        </div>
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="name" className="font-semibold">{t("register.name")} *</Label>
              <Input
                id="name"
                placeholder={language === "en" ? "Enter your full name as per Aadhaar" : "आधार कार्डप्रमाणे संपूर्ण नाव प्रविष्ट करा"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={otpSent}
                data-testid="input-name"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="mobile-reg" className="font-semibold">{t("register.mobile")} *</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="mobile-reg"
                  type="tel"
                  placeholder={language === "en" ? "10-digit mobile number" : "१०-अंकी मोबाईल क्रमांक"}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  maxLength={10}
                  disabled={otpSent}
                  data-testid="input-mobile-reg"
                  className="flex-1"
                />
                {!otpSent && (
                  <Button onClick={handleSendOtp} disabled={sendOtp.isPending} className="bg-primary" data-testid="btn-send-otp-reg">
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
                  <Label htmlFor="otp-reg" className="font-semibold">{t("login.enterOtp")}</Label>
                  <Input
                    id="otp-reg"
                    type="text"
                    placeholder="XXXXXX"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    data-testid="input-otp-reg"
                    className="mt-1.5 font-mono tracking-widest text-lg"
                  />
                </div>
                <Button onClick={handleRegister} disabled={register.isPending || otp.length !== 6} className="w-full bg-primary" data-testid="btn-register-submit">
                  {register.isPending ? t("common.loading") : t("register.submit")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="text-center pt-2">
              <span className="text-sm text-muted-foreground">{language === "en" ? "Already registered?" : "आधीच नोंदणी केली आहे?"} </span>
              <a href="/login" className="text-sm text-primary font-semibold hover:underline">
                {language === "en" ? "Login here" : "येथे लॉगिन करा"}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
