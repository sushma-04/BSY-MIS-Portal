import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import {
  useGetCurrentUser, useGetDashboardStats, useListApplications,
  useListBeneficiaries, useListPayments, useListNotifications, useLogout,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Users, FileText, Banknote, Bell, LogOut, Plus, Search,
  CheckCircle, Clock, XCircle, AlertCircle, Eye, RotateCcw,
  TrendingUp, Shield, Building2
} from "lucide-react";

function statusColor(status: string) {
  switch (status) {
    case "approved": return "bg-green-100 text-green-800";
    case "rejected": return "bg-red-100 text-red-800";
    case "submitted": return "bg-blue-100 text-blue-800";
    case "under_review": return "bg-yellow-100 text-yellow-800";
    case "pending_documents": return "bg-orange-100 text-orange-800";
    case "forwarded_to_po": return "bg-purple-100 text-purple-800";
    case "pwc_scheduled": return "bg-indigo-100 text-indigo-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

function statusLabel(status: string, lang: string) {
  const m: Record<string, [string, string]> = {
    draft: ["Draft", "मसुदा"],
    submitted: ["Submitted", "सादर केला"],
    under_review: ["Under Review", "पुनरावलोकनाधीन"],
    pending_documents: ["Documents Pending", "कागदपत्रे प्रलंबित"],
    forwarded_to_po: ["At PO", "PO कडे"],
    pwc_scheduled: ["PWC Meeting", "PWC बैठक"],
    approved: ["Approved", "मंजूर"],
    rejected: ["Rejected", "नाकारले"],
    active: ["Active", "सक्रिय"],
    inactive: ["Inactive", "निष्क्रिय"],
    success: ["Paid", "भरले"],
    failed: ["Failed", "अयशस्वी"],
    pending: ["Pending", "प्रलंबित"],
  };
  return lang === "en" ? (m[status]?.[0] || status) : (m[status]?.[1] || status);
}

function payColor(s: string) {
  return s === "success" ? "bg-green-100 text-green-800" : s === "failed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800";
}

export default function Dashboard() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useGetCurrentUser();
  const { data: stats } = useGetDashboardStats();
  const { data: appsData } = useListApplications({});
  const { data: benefData } = useListBeneficiaries({});
  const { data: paymentsData } = useListPayments({});
  const { data: notifData } = useListNotifications();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => { toast({ title: language === "en" ? "Logged out" : "लॉग आउट" }); setLocation("/"); },
    });
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">{language === "en" ? "Loading dashboard..." : "डॅशबोर्ड लोड होत आहे..."}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-lg text-secondary">{language === "en" ? "Please login to access the dashboard" : "डॅशबोर्ड ऍक्सेस करण्यासाठी लॉगिन करा"}</p>
          <Link href="/login"><Button className="mt-4 bg-primary">{language === "en" ? "Go to Login" : "लॉगिनवर जा"}</Button></Link>
        </div>
      </div>
    );
  }

  const role = user.role;
  const notifications = Array.isArray(notifData) ? notifData : (notifData as any)?.notifications || [];
  const payments = Array.isArray(paymentsData) ? paymentsData : (paymentsData as any)?.payments || [];
  const beneficiaries = Array.isArray(benefData) ? benefData : (benefData as any)?.beneficiaries || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Dashboard Header */}
      <div className="bg-secondary text-white py-5 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{language === "en" ? "Dashboard" : "डॅशबोर्ड"}</h1>
            <p className="text-sm text-white/80">
              {language === "en" ? "Welcome," : "स्वागत,"} <span className="font-semibold">{user.name}</span>
              {" — "}
              <Badge className="bg-primary text-white text-xs capitalize">{role}</Badge>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10 relative"
              data-testid="btn-notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">{unreadCount}</span>
              )}
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10" onClick={handleLogout} data-testid="btn-logout">
              <LogOut className="h-4 w-4 mr-1" /> {language === "en" ? "Logout" : "लॉगआउट"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {role === "applicant" ? (
              <>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary">{appsData?.applications?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "My Applications" : "माझे अर्ज"}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{appsData?.applications?.filter((a: any) => a.status === "approved").length || 0}</div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "Approved" : "मंजूर"}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">{appsData?.applications?.filter((a: any) => !["approved", "rejected", "draft"].includes(a.status)).length || 0}</div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "In Progress" : "प्रगतीत"}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{payments.filter((p: any) => p.status === "success").reduce((s: number, p: any) => s + Number(p.amount), 0).toLocaleString("en-IN") || "0"}
                    </div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "Total Received" : "एकूण प्राप्त"}</div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-primary">{(stats as any).totalApplications || 0}</div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "Total Applications" : "एकूण अर्ज"}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">{(stats as any).pendingReviews || 0}</div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "Pending Review" : "पुनरावलोकन प्रलंबित"}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{(stats as any).activeBeneficiaries || 0}</div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "Active Beneficiaries" : "सक्रिय लाभार्थी"}</div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹{((stats as any).totalDisbursed || 0).toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-muted-foreground">{language === "en" ? "Total Disbursed" : "एकूण वितरित"}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applications */}
            <Card className="shadow-sm">
              <CardHeader className="flex-row items-center justify-between pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {language === "en" ? "Applications" : "अर्ज"}
                </CardTitle>
                <div className="flex gap-2">
                  {role === "applicant" && (
                    <Link href="/apply">
                      <Button size="sm" className="bg-primary h-7 text-xs gap-1" data-testid="btn-new-application">
                        <Plus className="h-3 w-3" /> {language === "en" ? "New" : "नवीन"}
                      </Button>
                    </Link>
                  )}
                  <Link href="/track">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <Search className="h-3 w-3" /> {language === "en" ? "Track" : "ट्रॅक"}
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {appsData?.applications?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">{language === "en" ? "No applications found" : "कोणतेही अर्ज सापडले नाहीत"}</p>
                    {role === "applicant" && (
                      <Link href="/apply"><Button size="sm" className="mt-3 bg-primary" data-testid="btn-apply-empty">{language === "en" ? "Submit Application" : "अर्ज सादर करा"}</Button></Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {appsData?.applications?.slice(0, 5).map((app: any) => (
                      <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-primary truncate">{app.applicationNumber}</span>
                            <Badge className={`text-xs ${statusColor(app.status)}`}>{statusLabel(app.status, language)}</Badge>
                          </div>
                          <p className="text-sm font-medium truncate">{app.childName}</p>
                          <p className="text-xs text-muted-foreground">{app.district} • {app.financialYear}</p>
                        </div>
                        {(role === "gimaba" || role === "po" || role === "pwc") && (
                          <div className="flex gap-2 ml-2">
                            {role === "gimaba" && app.status === "submitted" && (
                              <Button size="sm" className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700" data-testid={`btn-review-${app.id}`}>
                                {language === "en" ? "Review" : "पुनरावलोकन"}
                              </Button>
                            )}
                            {role === "po" && app.status === "forwarded_to_po" && (
                              <Button size="sm" className="h-7 text-xs bg-purple-600 hover:bg-purple-700">
                                {language === "en" ? "SIR" : "SIR"}
                              </Button>
                            )}
                            {role === "pwc" && app.status === "pwc_scheduled" && (
                              <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700">
                                {language === "en" ? "Approve" : "मंजूर"}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Beneficiaries (for staff roles) */}
            {role !== "applicant" && (
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-600" />
                    {language === "en" ? "Active Beneficiaries" : "सक्रिय लाभार्थी"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {!beneficiaries.length ? (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      {language === "en" ? "No beneficiaries found" : "कोणतेही लाभार्थी सापडले नाहीत"}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {beneficiaries.slice(0, 4).map((b: any) => (
                        <div key={b.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                          <div>
                            <p className="font-medium text-sm">{b.childName}</p>
                            <p className="text-xs text-muted-foreground">{b.district} • ₹{Number(b.monthlyAmount).toLocaleString("en-IN")}/mo</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {b.eligibilityRisk && <AlertCircle className="h-4 w-4 text-orange-500" title="Risk" />}
                            {b.renewalDue && <RotateCcw className="h-4 w-4 text-yellow-500" title="Renewal Due" />}
                            <Badge className={`text-xs ${b.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                              {statusLabel(b.status, language)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Payments */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-blue-600" />
                  {language === "en" ? "Payment History" : "अदायगी इतिहास"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {!payments.length ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    {language === "en" ? "No payment records" : "अदायगी नोंदी नाहीत"}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payments.slice(0, 5).map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-sm">{p.beneficiaryName}</p>
                          <p className="text-xs text-muted-foreground">{p.paymentMonth}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">₹{Number(p.amount).toLocaleString("en-IN")}</span>
                          <Badge className={`text-xs ${payColor(p.status)}`}>{statusLabel(p.status, language)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{language === "en" ? "Quick Actions" : "द्रुत क्रिया"}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {role === "applicant" && (
                  <>
                    <Link href="/apply"><Button className="w-full bg-primary justify-start gap-2 h-9 text-sm" data-testid="btn-quick-apply"><Plus className="h-4 w-4" />{language === "en" ? "New Application" : "नवीन अर्ज"}</Button></Link>
                    <Link href="/track"><Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm"><Search className="h-4 w-4" />{language === "en" ? "Track Application" : "अर्ज ट्रॅक करा"}</Button></Link>
                    <Link href="/schemes"><Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm"><TrendingUp className="h-4 w-4" />{language === "en" ? "Related Schemes" : "संबंधित योजना"}</Button></Link>
                  </>
                )}
                {(role === "gimaba" || role === "sanstha") && (
                  <>
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm"><FileText className="h-4 w-4" />{language === "en" ? "Review Applications" : "अर्जांचे पुनरावलोकन"}</Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm"><Users className="h-4 w-4" />{language === "en" ? "Beneficiary List" : "लाभार्थी यादी"}</Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm"><TrendingUp className="h-4 w-4" />{language === "en" ? "Payment Reports" : "अदायगी अहवाल"}</Button>
                  </>
                )}
                {(role === "po" || role === "pwc" || role === "facilitator") && (
                  <>
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm"><Shield className="h-4 w-4" />{language === "en" ? "Pending Cases" : "प्रलंबित प्रकरणे"}</Button>
                    <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm"><Building2 className="h-4 w-4" />{language === "en" ? "Meetings" : "बैठका"}</Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  {language === "en" ? "Notifications" : "सूचना"}
                  {unreadCount > 0 && <Badge className="bg-red-500 text-white text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">{unreadCount}</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {!notifications.length ? (
                  <p className="text-xs text-muted-foreground text-center py-3">{language === "en" ? "No notifications" : "कोणत्याही सूचना नाहीत"}</p>
                ) : (
                  notifications.slice(0, 5).map((n: any) => (
                    <div key={n.id} className={`p-2.5 rounded-lg border text-xs ${!n.isRead ? "bg-blue-50 border-blue-200" : "bg-white border-border"}`}>
                      <div className="flex items-start gap-1.5">
                        {n.type === "success" ? <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" /> :
                          n.type === "warning" ? <AlertCircle className="h-3.5 w-3.5 text-orange-500 flex-shrink-0 mt-0.5" /> :
                            <Bell className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-semibold text-foreground">{n.title}</p>
                          <p className="text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
