import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import {
  useGetCurrentUser, useGetDashboardStats, useListApplications,
  useListBeneficiaries, useListPayments, useListNotifications, useLogout,
  useReviewApplication, useSubmitSir, useScheduleMeeting, useRecordMeetingDecision,
  useListMeetings, useMarkNotificationRead,
  getListApplicationsQueryKey, getListBeneficiariesQueryKey, getListPaymentsQueryKey,
  getListNotificationsQueryKey, getDashboardStatsQueryKey,
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Users, FileText, Banknote, Bell, LogOut, Plus, Search,
  CheckCircle, Clock, XCircle, AlertCircle, Eye, RotateCcw,
  TrendingUp, Shield, Building2, Home, ChevronLeft, ChevronRight,
  Calendar, ClipboardList, BarChart2, ArrowLeft, Filter, Menu, X,
  MapPin, Star, Clipboard, UserCheck, RefreshCw, IndianRupee,
} from "lucide-react";

/* ─── helpers ─── */
function sc(status: string) {
  const m: Record<string, string> = {
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    submitted: "bg-blue-100 text-blue-800 border-blue-200",
    under_review: "bg-yellow-100 text-yellow-800 border-yellow-200",
    pending_documents: "bg-amber-100 text-amber-800 border-amber-200",
    forwarded_to_po: "bg-purple-100 text-purple-800 border-purple-200",
    sir_pending: "bg-indigo-100 text-indigo-800 border-indigo-200",
    pwc_scheduled: "bg-sky-100 text-sky-800 border-sky-200",
    draft: "bg-gray-100 text-gray-700 border-gray-200",
    active: "bg-green-100 text-green-800 border-green-200",
    inactive: "bg-red-100 text-red-700 border-red-200",
    success: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  return m[status] ?? "bg-gray-100 text-gray-700 border-gray-200";
}
function sl(s: string, lang: string) {
  const m: Record<string, [string, string]> = {
    draft: ["Draft", "मसुदा"], submitted: ["Submitted", "सादर"], under_review: ["Under Review", "पुनरावलोकन"],
    pending_documents: ["Docs Pending", "कागदपत्रे प्रलंबित"], forwarded_to_po: ["At PO", "PO कडे"],
    sir_pending: ["SIR Pending", "SIR प्रलंबित"], pwc_scheduled: ["PWC Meeting", "PWC बैठक"],
    approved: ["Approved", "मंजूर"], rejected: ["Rejected", "नाकारले"],
    active: ["Active", "सक्रिय"], inactive: ["Inactive", "निष्क्रिय"],
    success: ["Paid", "भरले"], failed: ["Failed", "अयशस्वी"], pending: ["Pending", "प्रलंबित"],
    scheduled: ["Scheduled", "नियोजित"], completed: ["Completed", "पूर्ण"], cancelled: ["Cancelled", "रद्द"],
  };
  return lang === "en" ? (m[s]?.[0] ?? s) : (m[s]?.[1] ?? s);
}
function fmtDate(d?: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtAmt(n?: number | string | null) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  return (
    <Card className={`border-l-4 ${color}`}>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted/50"><Icon className="h-5 w-5 opacity-70" /></div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-xs text-muted-foreground leading-tight">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Empty state ─── */
function Empty({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
      <Icon className="h-10 w-10 opacity-30" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/* ─── Section heading ─── */
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-secondary">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   APPLICANT SECTIONS
══════════════════════════════════════════════════════════════════ */
function ApplicantOverview({ user, lang }: { user: any; lang: string }) {
  const { data: appsData } = useListApplications({});
  const { data: rawPayments } = useListPayments({});
  const apps = appsData?.applications ?? [];
  const payments = Array.isArray(rawPayments) ? rawPayments : [];
  const approved = apps.filter((a: any) => a.status === "approved").length;
  const inProgress = apps.filter((a: any) => !["approved", "rejected", "draft"].includes(a.status)).length;
  const totalPaid = payments.filter((p: any) => p.status === "success").reduce((s: number, p: any) => s + Number(p.amount), 0);

  return (
    <div>
      <SectionHead title={lang === "en" ? `Welcome, ${user.name}` : `स्वागत, ${user.name}`} sub={lang === "en" ? "Your BSY application overview" : "तुमचा BSY अर्ज आढावा"} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileText} label={lang === "en" ? "My Applications" : "माझे अर्ज"} value={apps.length} color="border-l-primary" />
        <StatCard icon={CheckCircle} label={lang === "en" ? "Approved" : "मंजूर"} value={approved} color="border-l-green-500" />
        <StatCard icon={Clock} label={lang === "en" ? "In Progress" : "प्रगतीत"} value={inProgress} color="border-l-yellow-500" />
        <StatCard icon={IndianRupee} label={lang === "en" ? "Total Received" : "एकूण प्राप्त"} value={fmtAmt(totalPaid)} color="border-l-blue-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />{lang === "en" ? "Recent Applications" : "अलीकडील अर्ज"}</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {apps.length === 0 ? <Empty icon={FileText} label={lang === "en" ? "No applications yet" : "अद्याप कोणतेही अर्ज नाहीत"} /> :
              apps.slice(0, 4).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-muted/30">
                  <div>
                    <p className="font-mono text-xs font-semibold text-primary">{a.applicationNumber}</p>
                    <p className="text-sm font-medium">{a.childName}</p>
                    <p className="text-xs text-muted-foreground">{a.district} · {a.financialYear}</p>
                  </div>
                  <Badge className={`text-xs ${sc(a.status)}`}>{sl(a.status, lang)}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><IndianRupee className="h-4 w-4 text-blue-600" />{lang === "en" ? "Recent Payments" : "अलीकडील अदायगी"}</CardTitle></CardHeader>
          <CardContent className="pt-0 space-y-2">
            {payments.length === 0 ? <Empty icon={Banknote} label={lang === "en" ? "No payments yet" : "अद्याप अदायगी नाही"} /> :
              payments.slice(0, 4).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{p.paymentMonth}</p>
                    <p className="text-xs text-muted-foreground">{fmtDate(p.processedAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{fmtAmt(p.amount)}</span>
                    <Badge className={`text-xs ${sc(p.status)}`}>{sl(p.status, lang)}</Badge>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-3 mt-4">
        <Link href="/apply"><Button className="bg-primary gap-2"><Plus className="h-4 w-4" />{lang === "en" ? "New Application" : "नवीन अर्ज"}</Button></Link>
        <Link href="/track"><Button variant="outline" className="gap-2"><Search className="h-4 w-4" />{lang === "en" ? "Track Application" : "अर्ज ट्रॅक करा"}</Button></Link>
        <Link href="/certificates"><Button variant="outline" className="gap-2"><Star className="h-4 w-4" />{lang === "en" ? "Download Certificate" : "प्रमाणपत्र"}</Button></Link>
      </div>
    </div>
  );
}

function ApplicantApplications({ lang }: { lang: string }) {
  const [status, setStatus] = useState("all");
  const { data: appsData } = useListApplications({});
  const apps = (appsData?.applications ?? []).filter((a: any) => status === "all" || a.status === status);
  return (
    <div>
      <SectionHead title={lang === "en" ? "My Applications" : "माझे अर्ज"} />
      <div className="flex items-center gap-3 mb-4">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === "en" ? "All Statuses" : "सर्व"}</SelectItem>
            {["draft","submitted","under_review","forwarded_to_po","pwc_scheduled","approved","rejected"].map(s => (
              <SelectItem key={s} value={s}>{sl(s, lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Link href="/apply"><Button size="sm" className="bg-primary gap-1 h-9"><Plus className="h-4 w-4" />{lang === "en" ? "New" : "नवीन"}</Button></Link>
      </div>
      <div className="space-y-2">
        {apps.length === 0 ? <Empty icon={FileText} label={lang === "en" ? "No applications found" : "अर्ज सापडले नाहीत"} /> :
          apps.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-primary">{a.applicationNumber}</span>
                  <Badge className={`text-xs ${sc(a.status)}`}>{sl(a.status, lang)}</Badge>
                  {a.aadhaarSeeded && <Badge className="text-xs bg-green-50 text-green-700 border border-green-200">Aadhaar ✓</Badge>}
                </div>
                <p className="text-sm font-semibold mt-0.5">{a.childName}</p>
                <p className="text-xs text-muted-foreground">{a.district} · {a.taluka} · FY {a.financialYear}</p>
                <p className="text-xs text-muted-foreground">Category: {a.beneficiaryCategory} · Submitted: {fmtDate(a.submittedAt)}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function PaymentsPanel({ lang }: { lang: string }) {
  const { data: raw } = useListPayments({});
  const payments = Array.isArray(raw) ? raw : [];
  const total = payments.filter((p: any) => p.status === "success").reduce((s: number, p: any) => s + Number(p.amount), 0);
  return (
    <div>
      <SectionHead title={lang === "en" ? "Payment History" : "अदायगी इतिहास"} />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon={CheckCircle} label={lang === "en" ? "Total Paid" : "एकूण भरले"} value={fmtAmt(total)} color="border-l-green-500" />
        <StatCard icon={Clock} label={lang === "en" ? "Pending" : "प्रलंबित"} value={payments.filter((p: any) => p.status === "pending").length} color="border-l-yellow-500" />
        <StatCard icon={XCircle} label={lang === "en" ? "Failed" : "अयशस्वी"} value={payments.filter((p: any) => p.status === "failed").length} color="border-l-red-500" />
      </div>
      <div className="space-y-2">
        {payments.length === 0 ? <Empty icon={Banknote} label={lang === "en" ? "No payment records" : "अदायगी नोंदी नाहीत"} /> :
          payments.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-sm">{p.beneficiaryName}</p>
                <p className="text-xs text-muted-foreground">{p.paymentMonth} · Ref: {p.transactionRef ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{fmtDate(p.processedAt)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{fmtAmt(p.amount)}</p>
                <Badge className={`text-xs mt-1 ${sc(p.status)}`}>{sl(p.status, lang)}</Badge>
                {p.failureReason && <p className="text-xs text-red-500 mt-0.5">{p.failureReason}</p>}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function NotificationsPanel({ lang }: { lang: string }) {
  const qc = useQueryClient();
  const { data: raw } = useListNotifications();
  const mark = useMarkNotificationRead();
  const notifs = Array.isArray(raw) ? raw : (raw as any)?.notifications ?? [];
  function markRead(id: number) {
    mark.mutate({ id }, { onSuccess: () => qc.invalidateQueries({ queryKey: getListNotificationsQueryKey() }) });
  }
  return (
    <div>
      <SectionHead title={lang === "en" ? "Notifications" : "सूचना"} />
      {notifs.length === 0 ? <Empty icon={Bell} label={lang === "en" ? "No notifications" : "कोणत्याही सूचना नाहीत"} /> :
        <div className="space-y-2">
          {notifs.map((n: any) => (
            <div key={n.id} className={`p-4 rounded-lg border ${!n.isRead ? "bg-blue-50 border-blue-200" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 flex-1">
                  {n.type === "success" ? <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> :
                    n.type === "warning" ? <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" /> :
                      <Bell className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="font-semibold text-sm">{n.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{fmtDate(n.createdAt)}</p>
                  </div>
                </div>
                {!n.isRead && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => markRead(n.id)}>
                    {lang === "en" ? "Mark read" : "वाचले"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   GIMABA SECTIONS
══════════════════════════════════════════════════════════════════ */
function GimabaOverview({ lang }: { lang: string }) {
  const { data: stats } = useGetDashboardStats();
  const s = (stats ?? {}) as any;
  return (
    <div>
      <SectionHead title={lang === "en" ? "GIMABA Dashboard Overview" : "GIMABA डॅशबोर्ड आढावा"} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={FileText} label={lang === "en" ? "Total Applications" : "एकूण अर्ज"} value={s.totalApplications ?? 0} color="border-l-primary" />
        <StatCard icon={Clock} label={lang === "en" ? "Pending Review" : "पुनरावलोकन प्रलंबित"} value={s.pendingReview ?? 0} color="border-l-yellow-500" />
        <StatCard icon={Users} label={lang === "en" ? "Active Beneficiaries" : "सक्रिय लाभार्थी"} value={s.approvedBeneficiaries ?? 0} color="border-l-green-500" />
        <StatCard icon={IndianRupee} label={lang === "en" ? "Total Disbursed" : "एकूण वितरित"} value={fmtAmt(s.totalDisbursed)} color="border-l-blue-500" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={AlertCircle} label={lang === "en" ? "Aadhaar Pending" : "आधार प्रलंबित"} value={s.aadhaarPendingCount ?? 0} color="border-l-amber-500" />
        <StatCard icon={RotateCcw} label={lang === "en" ? "Renewal Due" : "नूतनीकरण देय"} value={s.renewalDueCount ?? 0} color="border-l-orange-500" />
        <StatCard icon={XCircle} label={lang === "en" ? "Rejected" : "नाकारले"} value={s.rejectedApplications ?? 0} color="border-l-red-500" />
        <StatCard icon={Calendar} label={lang === "en" ? "PWC Scheduled" : "PWC नियोजित"} value={s.pwcScheduled ?? 0} color="border-l-sky-500" />
      </div>
    </div>
  );
}

function ReviewQueue({ lang }: { lang: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: appsData } = useListApplications({ status: "submitted" });
  const review = useReviewApplication();
  const [remarks, setRemarks] = useState<Record<number, string>>({});

  function doReview(id: number, action: "forward_to_po" | "request_documents" | "reject") {
    review.mutate(
      { id, data: { action, remarks: remarks[id] ?? "" } },
      {
        onSuccess: () => {
          toast({ title: lang === "en" ? "Action submitted" : "कार्य सादर केले" });
          qc.invalidateQueries({ queryKey: getListApplicationsQueryKey({}) });
        },
        onError: () => toast({ title: lang === "en" ? "Action failed" : "कार्य अयशस्वी", variant: "destructive" }),
      }
    );
  }

  const apps = appsData?.applications ?? [];
  return (
    <div>
      <SectionHead title={lang === "en" ? "Review Queue — Submitted Applications" : "पुनरावलोकन रांग — सादर अर्ज"} sub={lang === "en" ? `${apps.length} applications awaiting GIMABA review` : `${apps.length} अर्ज GIMABA पुनरावलोकनाची प्रतीक्षा`} />
      {apps.length === 0 ? <Empty icon={CheckCircle} label={lang === "en" ? "No applications pending review" : "पुनरावलोकनासाठी अर्ज नाहीत"} /> :
        <div className="space-y-4">
          {apps.map((a: any) => (
            <Card key={a.id} className="border-l-4 border-l-yellow-400">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-primary">{a.applicationNumber}</span>
                      <Badge className={`text-xs ${sc(a.status)}`}>{sl(a.status, lang)}</Badge>
                    </div>
                    <p className="font-semibold mt-0.5">{a.childName}</p>
                    <p className="text-sm text-muted-foreground">{a.district} · {a.taluka} · {a.beneficiaryCategory}</p>
                    <p className="text-xs text-muted-foreground">Guardian: {a.guardianName} · Mobile: {a.guardianMobile}</p>
                    <p className="text-xs text-muted-foreground">Annual Income: {fmtAmt(a.annualIncome)} · School: {a.schoolName ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">Submitted: {fmtDate(a.submittedAt)}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Textarea
                    placeholder={lang === "en" ? "Remarks / observations (optional)" : "टिप्पणी (ऐच्छिक)"}
                    className="text-sm h-16 mb-2"
                    value={remarks[a.id] ?? ""}
                    onChange={e => setRemarks(r => ({ ...r, [a.id]: e.target.value }))}
                  />
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 gap-1 text-xs" onClick={() => doReview(a.id, "forward_to_po")} disabled={review.isPending}>
                      <ArrowLeft className="h-3 w-3 rotate-180" />{lang === "en" ? "Forward to PO" : "PO कडे पाठवा"}
                    </Button>
                    <Button size="sm" variant="outline" className="border-amber-500 text-amber-700 gap-1 text-xs" onClick={() => doReview(a.id, "request_documents")} disabled={review.isPending}>
                      <Clipboard className="h-3 w-3" />{lang === "en" ? "Request Documents" : "कागदपत्रे मागवा"}
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-400 text-red-600 gap-1 text-xs" onClick={() => doReview(a.id, "reject")} disabled={review.isPending}>
                      <XCircle className="h-3 w-3" />{lang === "en" ? "Reject" : "नाकारा"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}

function AllApplications({ lang, role }: { lang: string; role: string }) {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const { data: appsData } = useListApplications(status !== "all" ? { status } : {});
  const all = (appsData?.applications ?? []).filter((a: any) =>
    !search || a.childName?.toLowerCase().includes(search.toLowerCase()) || a.applicationNumber?.includes(search)
  );
  return (
    <div>
      <SectionHead title={lang === "en" ? "All Applications" : "सर्व अर्ज"} sub={lang === "en" ? `${appsData?.total ?? 0} total` : `एकूण ${appsData?.total ?? 0}`} />
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={lang === "en" ? "Search by name or app number…" : "नाव किंवा अर्ज क्रमांकाने शोधा…"} className="pl-8 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44 h-9"><Filter className="h-3 w-3 mr-1" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === "en" ? "All Statuses" : "सर्व"}</SelectItem>
            {["submitted","under_review","pending_documents","forwarded_to_po","sir_pending","pwc_scheduled","approved","rejected","draft"].map(s => (
              <SelectItem key={s} value={s}>{sl(s, lang)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {all.length === 0 ? <Empty icon={FileText} label={lang === "en" ? "No applications found" : "अर्ज सापडले नाहीत"} /> :
          all.map((a: any) => (
            <div key={a.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 items-center p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-primary">{a.applicationNumber}</span>
                  <Badge className={`text-xs ${sc(a.status)}`}>{sl(a.status, lang)}</Badge>
                  {a.aadhaarSeeded && <Badge className="text-xs bg-green-50 text-green-700 border border-green-200">Aadhaar ✓</Badge>}
                </div>
                <p className="font-semibold text-sm mt-0.5">{a.childName} <span className="font-normal text-muted-foreground text-xs">({a.childGender}, {a.casteCategory})</span></p>
                <p className="text-xs text-muted-foreground">{a.district} · {a.taluka} · FY {a.financialYear} · {a.beneficiaryCategory}</p>
                <p className="text-xs text-muted-foreground">Guardian: {a.guardianName} · {a.guardianMobile} · Income: {fmtAmt(a.annualIncome)}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>{fmtDate(a.submittedAt ?? a.createdAt)}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function BeneficiaryRegistry({ lang }: { lang: string }) {
  const [aadhaarFilter, setAadhaarFilter] = useState("all");
  const { data: raw } = useListBeneficiaries(aadhaarFilter !== "all" ? { aadhaarSeeded: aadhaarFilter === "yes" } : {});
  const beneficiaries = Array.isArray(raw) ? raw : [];
  return (
    <div>
      <SectionHead title={lang === "en" ? "Beneficiary Registry" : "लाभार्थी नोंदणी"} sub={lang === "en" ? `${beneficiaries.length} beneficiaries` : `${beneficiaries.length} लाभार्थी`} />
      <div className="flex gap-3 mb-4">
        <Select value={aadhaarFilter} onValueChange={setAadhaarFilter}>
          <SelectTrigger className="w-52 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === "en" ? "All Aadhaar Status" : "सर्व आधार"}</SelectItem>
            <SelectItem value="yes">{lang === "en" ? "Aadhaar Seeded" : "आधार जोडलेले"}</SelectItem>
            <SelectItem value="no">{lang === "en" ? "Aadhaar Pending" : "आधार प्रलंबित"}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {beneficiaries.length === 0 ? <Empty icon={Users} label={lang === "en" ? "No beneficiaries found" : "लाभार्थी सापडले नाहीत"} /> :
          beneficiaries.map((b: any) => (
            <div key={b.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30">
              <div>
                <p className="font-semibold text-sm">{b.childName}</p>
                <p className="text-xs text-muted-foreground">{b.district} · {b.beneficiaryCategory} · {fmtAmt(b.monthlyAmount)}/mo</p>
                <p className="text-xs text-muted-foreground">Approved: {fmtDate(b.approvalDate)} · Sanstha: {b.sansthaName ?? "—"}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className={`text-xs ${sc(b.status)}`}>{sl(b.status, lang)}</Badge>
                {b.aadhaarSeeded ? <Badge className="text-xs bg-green-50 text-green-700 border border-green-200">Aadhaar ✓</Badge> : <Badge className="text-xs bg-amber-50 text-amber-700 border border-amber-200">Aadhaar ✗</Badge>}
                {b.renewalDue && <Badge className="text-xs bg-orange-50 text-orange-700 border border-orange-200">Renewal Due</Badge>}
                {b.eligibilityRisk && <Badge className="text-xs bg-red-50 text-red-700 border border-red-200">Risk ⚠</Badge>}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function PaymentsOverview({ lang }: { lang: string }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: raw } = useListPayments(statusFilter !== "all" ? { status: statusFilter } : {});
  const payments = Array.isArray(raw) ? raw : [];
  const total = payments.filter((p: any) => p.status === "success").reduce((s: number, p: any) => s + Number(p.amount), 0);
  return (
    <div>
      <SectionHead title={lang === "en" ? "Payment Reports" : "अदायगी अहवाल"} />
      <div className="grid grid-cols-3 gap-4 mb-5">
        <StatCard icon={CheckCircle} label={lang === "en" ? "Total Disbursed" : "एकूण वितरित"} value={fmtAmt(total)} color="border-l-green-500" />
        <StatCard icon={Clock} label={lang === "en" ? "Pending" : "प्रलंबित"} value={payments.filter((p: any) => p.status === "pending").length} color="border-l-yellow-500" />
        <StatCard icon={XCircle} label={lang === "en" ? "Failed" : "अयशस्वी"} value={payments.filter((p: any) => p.status === "failed").length} color="border-l-red-500" />
      </div>
      <div className="flex gap-3 mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{lang === "en" ? "All" : "सर्व"}</SelectItem>
            {["success","pending","failed","processing"].map(s => <SelectItem key={s} value={s}>{sl(s, lang)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {payments.length === 0 ? <Empty icon={Banknote} label={lang === "en" ? "No payments found" : "अदायगी सापडली नाही"} /> :
          payments.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-sm">{p.beneficiaryName}</p>
                <p className="text-xs text-muted-foreground">{p.paymentMonth} · Ref: {p.transactionRef ?? "—"}</p>
                {p.failureReason && <p className="text-xs text-red-500">{p.failureReason}</p>}
              </div>
              <div className="text-right">
                <p className="font-bold">{fmtAmt(p.amount)}</p>
                <Badge className={`text-xs mt-1 ${sc(p.status)}`}>{sl(p.status, lang)}</Badge>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PO SECTIONS
══════════════════════════════════════════════════════════════════ */
function POAssignedCases({ lang }: { lang: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: appsData } = useListApplications({ status: "forwarded_to_po" });
  const submitSir = useSubmitSir();
  const [sirForms, setSirForms] = useState<Record<number, { visitDate: string; recommendation: string; observations: string }>>({});
  const apps = appsData?.applications ?? [];

  function updateForm(id: number, field: string, value: string) {
    setSirForms(f => ({ ...f, [id]: { ...f[id], [field]: value } }));
  }
  function doSir(id: number) {
    const form = sirForms[id];
    if (!form?.visitDate || !form?.recommendation || !form?.observations) {
      toast({ title: lang === "en" ? "Fill all SIR fields" : "सर्व SIR माहिती भरा", variant: "destructive" });
      return;
    }
    submitSir.mutate({ id, data: { visitDate: form.visitDate, recommendation: form.recommendation as any, observations: form.observations, photoUrls: [] } }, {
      onSuccess: () => { toast({ title: lang === "en" ? "SIR submitted" : "SIR सादर केला" }); qc.invalidateQueries({ queryKey: getListApplicationsQueryKey({}) }); },
      onError: () => toast({ title: lang === "en" ? "SIR failed" : "SIR अयशस्वी", variant: "destructive" }),
    });
  }

  return (
    <div>
      <SectionHead title={lang === "en" ? "Assigned Cases — Submit SIR" : "नियुक्त प्रकरणे — SIR सादर करा"} sub={lang === "en" ? `${apps.length} cases assigned for home visit` : `${apps.length} प्रकरणे गृहभेटीसाठी`} />
      {apps.length === 0 ? <Empty icon={MapPin} label={lang === "en" ? "No cases assigned" : "कोणतेही प्रकरण नियुक्त नाही"} /> :
        <div className="space-y-5">
          {apps.map((a: any) => (
            <Card key={a.id} className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2"><span className="font-mono text-xs font-bold text-primary">{a.applicationNumber}</span><Badge className={`text-xs ${sc(a.status)}`}>{sl(a.status, lang)}</Badge></div>
                    <p className="font-semibold">{a.childName}</p>
                    <p className="text-sm text-muted-foreground">{a.district} · {a.taluka} · {a.address}</p>
                    <p className="text-xs text-muted-foreground">Guardian: {a.guardianName} · {a.guardianMobile}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Home Visit Date" : "गृहभेट दिनांक"}</label>
                    <Input type="date" className="h-8 mt-1 text-sm" value={sirForms[a.id]?.visitDate ?? ""} onChange={e => updateForm(a.id, "visitDate", e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Recommendation" : "शिफारस"}</label>
                    <Select value={sirForms[a.id]?.recommendation ?? ""} onValueChange={v => updateForm(a.id, "recommendation", v)}>
                      <SelectTrigger className="h-8 mt-1 text-sm"><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">{lang === "en" ? "Recommended" : "शिफारस केली"}</SelectItem>
                        <SelectItem value="not_recommended">{lang === "en" ? "Not Recommended" : "शिफारस नाही"}</SelectItem>
                        <SelectItem value="further_inquiry">{lang === "en" ? "Further Inquiry" : "पुढील तपास"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Observations" : "निरीक्षणे"}</label>
                    <Textarea placeholder={lang === "en" ? "Enter visit observations…" : "भेट निरीक्षणे नोंदवा…"} className="h-16 mt-1 text-sm" value={sirForms[a.id]?.observations ?? ""} onChange={e => updateForm(a.id, "observations", e.target.value)} />
                  </div>
                </div>
                <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700 gap-1" onClick={() => doSir(a.id)} disabled={submitSir.isPending}>
                  <ClipboardList className="h-4 w-4" />{lang === "en" ? "Submit SIR Report" : "SIR अहवाल सादर करा"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PWC SECTIONS
══════════════════════════════════════════════════════════════════ */
function PWCPendingDecisions({ lang }: { lang: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data: appsData } = useListApplications({ status: "pwc_scheduled" });
  const { data: rawMeetings } = useListMeetings();
  const decide = useRecordMeetingDecision();
  const scheduleMtg = useScheduleMeeting();
  const apps = appsData?.applications ?? [];
  const meetings = Array.isArray(rawMeetings) ? rawMeetings : [];
  const [forms, setForms] = useState<Record<number, { decision: string; reason: string }>>({});
  const [mtgForm, setMtgForm] = useState<{ appId: string; date: string; mode: string; venue: string }>({ appId: "", date: "", mode: "offline", venue: "" });

  function decideMtg(meetingId: number) {
    const f = forms[meetingId];
    if (!f?.decision) { toast({ title: "Select a decision", variant: "destructive" }); return; }
    decide.mutate({ id: meetingId, data: { decision: f.decision as any, decisionReason: f.reason, minutes: "" } }, {
      onSuccess: () => { toast({ title: lang === "en" ? "Decision recorded" : "निर्णय नोंदवला" }); qc.invalidateQueries({ queryKey: getListApplicationsQueryKey({}) }); },
    });
  }
  function scheduleMeeting() {
    if (!mtgForm.appId || !mtgForm.date || !mtgForm.venue) { toast({ title: "Fill all meeting fields", variant: "destructive" }); return; }
    scheduleMtg.mutate({ data: { applicationId: parseInt(mtgForm.appId), scheduledDate: mtgForm.date, mode: mtgForm.mode as any, venueOrLink: mtgForm.venue } }, {
      onSuccess: () => { toast({ title: lang === "en" ? "Meeting scheduled" : "बैठक नियोजित" }); setMtgForm({ appId: "", date: "", mode: "offline", venue: "" }); qc.invalidateQueries({}); },
    });
  }

  const scheduledMeetings = meetings.filter((m: any) => m.status === "scheduled");

  return (
    <div className="space-y-6">
      <div>
        <SectionHead title={lang === "en" ? "Schedule Meeting" : "बैठक नियोजित करा"} />
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Application ID" : "अर्ज ID"}</label>
                <Input className="h-8 mt-1 text-sm" placeholder="e.g. 12" value={mtgForm.appId} onChange={e => setMtgForm(f => ({ ...f, appId: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Meeting Date" : "बैठक दिनांक"}</label>
                <Input type="datetime-local" className="h-8 mt-1 text-sm" value={mtgForm.date} onChange={e => setMtgForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Mode" : "प्रकार"}</label>
                <Select value={mtgForm.mode} onValueChange={v => setMtgForm(f => ({ ...f, mode: v }))}>
                  <SelectTrigger className="h-8 mt-1 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">{lang === "en" ? "In-Person" : "समक्ष"}</SelectItem>
                    <SelectItem value="online">{lang === "en" ? "Online" : "ऑनलाइन"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">{lang === "en" ? "Venue / Link" : "स्थळ / दुवा"}</label>
                <Input className="h-8 mt-1 text-sm" placeholder={lang === "en" ? "Venue or meeting link" : "स्थळ किंवा दुवा"} value={mtgForm.venue} onChange={e => setMtgForm(f => ({ ...f, venue: e.target.value }))} />
              </div>
            </div>
            <Button size="sm" className="mt-3 bg-sky-600 hover:bg-sky-700 gap-1" onClick={scheduleMeeting} disabled={scheduleMtg.isPending}>
              <Calendar className="h-4 w-4" />{lang === "en" ? "Schedule Meeting" : "बैठक नियोजित करा"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <SectionHead title={lang === "en" ? "Scheduled Meetings" : "नियोजित बैठका"} sub={lang === "en" ? `${scheduledMeetings.length} upcoming` : `${scheduledMeetings.length} आगामी`} />
        {scheduledMeetings.length === 0 ? <Empty icon={Calendar} label={lang === "en" ? "No scheduled meetings" : "नियोजित बैठका नाहीत"} /> :
          <div className="space-y-3">
            {scheduledMeetings.map((m: any) => (
              <Card key={m.id} className="border-l-4 border-l-sky-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-semibold text-sm">App ID #{m.applicationId} · Meeting #{m.id}</p>
                      <p className="text-sm text-muted-foreground">{fmtDate(m.scheduledDate)} · {m.mode} · {m.venueOrLink}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={forms[m.id]?.decision ?? ""} onValueChange={v => setForms(f => ({ ...f, [m.id]: { ...f[m.id], decision: v } }))}>
                        <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Decision…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="approved">{lang === "en" ? "Approve" : "मंजूर"}</SelectItem>
                          <SelectItem value="rejected">{lang === "en" ? "Reject" : "नाकारा"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input className="h-8 w-32 text-xs" placeholder="Reason" value={forms[m.id]?.reason ?? ""} onChange={e => setForms(f => ({ ...f, [m.id]: { ...f[m.id], reason: e.target.value } }))} />
                      <Button size="sm" className="h-8 text-xs bg-green-600 hover:bg-green-700" onClick={() => decideMtg(m.id)} disabled={decide.isPending}>
                        {lang === "en" ? "Record" : "नोंदवा"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>}
      </div>

      <div>
        <SectionHead title={lang === "en" ? "PWC Scheduled Applications" : "PWC नियोजित अर्ज"} sub={lang === "en" ? `${apps.length} pending PWC decision` : `${apps.length} PWC निर्णय प्रलंबित`} />
        {apps.length === 0 ? <Empty icon={CheckCircle} label={lang === "en" ? "No applications pending PWC" : "PWC साठी अर्ज नाहीत"} /> :
          <div className="space-y-2">
            {apps.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between p-4 rounded-lg border border-sky-200 bg-sky-50/30">
                <div>
                  <div className="flex items-center gap-2"><span className="font-mono text-xs font-bold text-primary">{a.applicationNumber}</span><Badge className={`text-xs ${sc(a.status)}`}>{sl(a.status, lang)}</Badge></div>
                  <p className="font-semibold text-sm">{a.childName}</p>
                  <p className="text-xs text-muted-foreground">{a.district} · {a.beneficiaryCategory}</p>
                </div>
              </div>
            ))}
          </div>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SANSTHA SECTIONS
══════════════════════════════════════════════════════════════════ */
function SansthaOverview({ user, lang }: { user: any; lang: string }) {
  const { data: raw } = useListBeneficiaries({});
  const beneficiaries = Array.isArray(raw) ? raw : [];
  const active = beneficiaries.filter((b: any) => b.status === "active").length;
  const renewalDue = beneficiaries.filter((b: any) => b.renewalDue).length;
  const aadhaarPending = beneficiaries.filter((b: any) => !b.aadhaarSeeded).length;
  return (
    <div>
      <SectionHead title={lang === "en" ? "Sanstha Dashboard" : "संस्था डॅशबोर्ड"} sub={user.name} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={Users} label={lang === "en" ? "Total Enrolled" : "एकूण नोंदणीकृत"} value={beneficiaries.length} color="border-l-primary" />
        <StatCard icon={CheckCircle} label={lang === "en" ? "Active" : "सक्रिय"} value={active} color="border-l-green-500" />
        <StatCard icon={RotateCcw} label={lang === "en" ? "Renewal Due" : "नूतनीकरण देय"} value={renewalDue} color="border-l-orange-500" />
        <StatCard icon={AlertCircle} label={lang === "en" ? "Aadhaar Pending" : "आधार प्रलंबित"} value={aadhaarPending} color="border-l-amber-500" />
      </div>
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 mb-4">
        ⚠ {lang === "en" ? "Max 200 beneficiaries per Sanstha (BSY rule). Current: " : "संस्थेसाठी कमाल २०० लाभार्थी (BSY नियम). सध्या: "}<strong>{beneficiaries.length}/200</strong>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   FACILITATOR SECTIONS
══════════════════════════════════════════════════════════════════ */
function FacilitatorOverview({ user, lang }: { user: any; lang: string }) {
  const { data: appsData } = useListApplications({});
  const apps = appsData?.applications ?? [];
  return (
    <div>
      <SectionHead title={lang === "en" ? "Facilitator Dashboard" : "सुविधादाता डॅशबोर्ड"} sub={user.name} />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <StatCard icon={FileText} label={lang === "en" ? "Total Assisted" : "एकूण सहाय्य केले"} value={apps.length} color="border-l-primary" />
        <StatCard icon={CheckCircle} label={lang === "en" ? "Approved" : "मंजूर"} value={apps.filter((a: any) => a.status === "approved").length} color="border-l-green-500" />
        <StatCard icon={Clock} label={lang === "en" ? "In Progress" : "प्रगतीत"} value={apps.filter((a: any) => !["approved","rejected","draft"].includes(a.status)).length} color="border-l-yellow-500" />
      </div>
      <Link href="/apply">
        <Button className="bg-primary gap-2"><Plus className="h-4 w-4" />{lang === "en" ? "Assist New Application" : "नवीन अर्ज सहाय्य करा"}</Button>
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SIDEBAR CONFIG
══════════════════════════════════════════════════════════════════ */
function getSidebarItems(role: string, lang: string) {
  const en = lang === "en";
  if (role === "applicant") return [
    { id: "overview", icon: Home, label: en ? "Overview" : "आढावा" },
    { id: "applications", icon: FileText, label: en ? "My Applications" : "माझे अर्ज" },
    { id: "payments", icon: Banknote, label: en ? "Payment History" : "अदायगी इतिहास" },
    { id: "notifications", icon: Bell, label: en ? "Notifications" : "सूचना" },
  ];
  if (role === "gimaba") return [
    { id: "overview", icon: BarChart2, label: en ? "Overview" : "आढावा" },
    { id: "review_queue", icon: ClipboardList, label: en ? "Review Queue" : "पुनरावलोकन रांग" },
    { id: "all_applications", icon: FileText, label: en ? "All Applications" : "सर्व अर्ज" },
    { id: "beneficiaries", icon: Users, label: en ? "Beneficiary Registry" : "लाभार्थी नोंदणी" },
    { id: "payments", icon: Banknote, label: en ? "Payments" : "अदायगी" },
    { id: "notifications", icon: Bell, label: en ? "Notifications" : "सूचना" },
  ];
  if (role === "po") return [
    { id: "assigned_cases", icon: MapPin, label: en ? "Assigned Cases" : "नियुक्त प्रकरणे" },
    { id: "all_applications", icon: FileText, label: en ? "All Applications" : "सर्व अर्ज" },
    { id: "notifications", icon: Bell, label: en ? "Notifications" : "सूचना" },
  ];
  if (role === "pwc") return [
    { id: "overview", icon: BarChart2, label: en ? "Overview" : "आढावा" },
    { id: "pending_decisions", icon: Calendar, label: en ? "Meetings & Decisions" : "बैठका व निर्णय" },
    { id: "all_applications", icon: FileText, label: en ? "All Applications" : "सर्व अर्ज" },
    { id: "beneficiaries", icon: Users, label: en ? "Beneficiaries" : "लाभार्थी" },
    { id: "payments", icon: Banknote, label: en ? "Payments" : "अदायगी" },
  ];
  if (role === "sanstha") return [
    { id: "overview", icon: Building2, label: en ? "Overview" : "आढावा" },
    { id: "beneficiaries", icon: Users, label: en ? "Enrolled Beneficiaries" : "नोंदणीकृत लाभार्थी" },
    { id: "payments", icon: Banknote, label: en ? "Payments" : "अदायगी" },
    { id: "all_applications", icon: FileText, label: en ? "Applications" : "अर्ज" },
  ];
  if (role === "facilitator") return [
    { id: "overview", icon: Home, label: en ? "Overview" : "आढावा" },
    { id: "all_applications", icon: FileText, label: en ? "Assisted Applications" : "सहाय्य अर्ज" },
    { id: "notifications", icon: Bell, label: en ? "Notifications" : "सूचना" },
  ];
  return [];
}

function getDefaultSection(role: string) {
  if (role === "po") return "assigned_cases";
  return "overview";
}

/* ══════════════════════════════════════════════════════════════════
   SECTION RENDERER
══════════════════════════════════════════════════════════════════ */
function SectionContent({ section, role, user, lang }: { section: string; role: string; user: any; lang: string }) {
  if (section === "overview") {
    if (role === "applicant") return <ApplicantOverview user={user} lang={lang} />;
    if (role === "gimaba") return <GimabaOverview lang={lang} />;
    if (role === "pwc") return <GimabaOverview lang={lang} />;
    if (role === "sanstha") return <SansthaOverview user={user} lang={lang} />;
    if (role === "facilitator") return <FacilitatorOverview user={user} lang={lang} />;
  }
  if (section === "applications") return <ApplicantApplications lang={lang} />;
  if (section === "payments") return <PaymentsPanel lang={lang} />;
  if (section === "notifications") return <NotificationsPanel lang={lang} />;
  if (section === "review_queue") return <ReviewQueue lang={lang} />;
  if (section === "all_applications") return <AllApplications lang={lang} role={role} />;
  if (section === "beneficiaries") return <BeneficiaryRegistry lang={lang} />;
  if (section === "assigned_cases") return <POAssignedCases lang={lang} />;
  if (section === "pending_decisions") return <PWCPendingDecisions lang={lang} />;
  return <div className="p-4 text-muted-foreground">Coming soon…</div>;
}

/* ══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { language } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useGetCurrentUser();
  const { data: rawNotifs } = useListNotifications();
  const logout = useLogout();
  const notifs = Array.isArray(rawNotifs) ? rawNotifs : (rawNotifs as any)?.notifications ?? [];
  const unread = notifs.filter((n: any) => !n.isRead).length;

  const role = user?.role ?? "";
  const items = getSidebarItems(role, language);
  const [active, setActive] = useState<string>(() => getDefaultSection(role || "applicant"));
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => { toast({ title: language === "en" ? "Logged out" : "लॉग आउट" }); setLocation("/"); },
    });
  }

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{language === "en" ? "Loading dashboard…" : "डॅशबोर्ड लोड होत आहे…"}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold text-lg text-secondary mb-4">{language === "en" ? "Please login to access the dashboard" : "डॅशबोर्ड ऍक्सेस करण्यासाठी लॉगिन करा"}</p>
          <Link href="/login"><Button className="bg-primary">{language === "en" ? "Go to Login" : "लॉगिन करा"}</Button></Link>
        </div>
      </div>
    );
  }

  const roleLabel: Record<string, [string, string]> = {
    applicant: ["Applicant", "अर्जदार"],
    gimaba: ["GIMABA Officer", "GIMABA अधिकारी"],
    po: ["Protection Officer", "संरक्षण अधिकारी"],
    pwc: ["PWC Committee", "PWC समिती"],
    sanstha: ["Sanstha / NGO", "संस्था / NGO"],
    facilitator: ["Facilitator", "सुविधादाता"],
  };
  const rl = language === "en" ? (roleLabel[role]?.[0] ?? role) : (roleLabel[role]?.[1] ?? role);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top Bar ── */}
      <header className="bg-secondary text-white h-14 flex items-center px-4 gap-3 sticky top-0 z-40 shadow-md">
        {/* Mobile hamburger */}
        <button className="md:hidden p-1.5 rounded hover:bg-white/10" onClick={() => setMobileSidebarOpen(o => !o)}>
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo / back to portal */}
        <Link href="/">
          <button className="flex items-center gap-2 hover:bg-white/10 rounded px-2 py-1 transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0">WCD</div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-tight">BSY MIS Portal</p>
              <p className="text-[10px] text-white/70 leading-tight">{language === "en" ? "← Back to Portal" : "← पोर्टलवर परत"}</p>
            </div>
          </button>
        </Link>

        <div className="flex-1" />

        {/* User info */}
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            {user.name?.charAt(0) ?? "U"}
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold leading-tight">{user.name}</p>
            <p className="text-[10px] text-white/70 leading-tight">{rl}</p>
          </div>
        </div>

        {/* Notifications bell */}
        <button
          className="relative p-1.5 rounded hover:bg-white/10 transition-colors"
          onClick={() => setActive("notifications")}
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold">{unread}</span>}
        </button>

        <button
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-white/30 hover:bg-white/10 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{language === "en" ? "Logout" : "लॉगआउट"}</span>
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* ── Sidebar (desktop) ── */}
        <aside className={`hidden md:flex flex-col bg-white border-r border-border transition-all duration-200 ${sidebarOpen ? "w-56" : "w-14"} flex-shrink-0`}>
          {/* Collapse toggle */}
          <button
            className="flex items-center justify-end px-3 py-2 text-muted-foreground hover:text-secondary border-b border-border"
            onClick={() => setSidebarOpen(o => !o)}
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>

          {/* Role badge */}
          {sidebarOpen && (
            <div className="px-3 py-2 border-b border-border">
              <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] w-full justify-center py-0.5">{rl}</Badge>
            </div>
          )}

          {/* Nav items */}
          <nav className="flex-1 py-2 overflow-y-auto">
            {items.map(item => (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${active === item.id ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}`}
                onClick={() => setActive(item.id)}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {sidebarOpen && item.id === "notifications" && unread > 0 && (
                  <span className="ml-auto text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">{unread}</span>
                )}
              </button>
            ))}
          </nav>

          {/* Portal link at bottom */}
          {sidebarOpen && (
            <div className="border-t border-border p-3">
              <Link href="/">
                <button className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-secondary py-1.5 px-2 rounded hover:bg-muted/50 transition-colors">
                  <Home className="h-3.5 w-3.5" />
                  {language === "en" ? "Back to Portal" : "पोर्टलवर परत"}
                </button>
              </Link>
            </div>
          )}
        </aside>

        {/* ── Mobile Sidebar Overlay ── */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
            <aside className="relative w-64 bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary text-white">
                <span className="font-semibold text-sm">{rl}</span>
                <button onClick={() => setMobileSidebarOpen(false)}><X className="h-5 w-5" /></button>
              </div>
              <nav className="flex-1 py-2 overflow-y-auto">
                {items.map(item => (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${active === item.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
                    onClick={() => { setActive(item.id); setMobileSidebarOpen(false); }}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              <div className="border-t p-4">
                <Link href="/">
                  <button className="w-full flex items-center gap-2 text-sm text-secondary py-2 font-medium" onClick={() => setMobileSidebarOpen(false)}>
                    <Home className="h-4 w-4" />{language === "en" ? "Back to Portal" : "पोर्टलवर परत"}
                  </button>
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {/* Section breadcrumb */}
            <div className="flex items-center gap-2 mb-5 text-xs text-muted-foreground">
              <span className="font-medium text-secondary">{rl}</span>
              <ChevronRight className="h-3 w-3" />
              <span>{items.find(i => i.id === active)?.label ?? active}</span>
            </div>

            <SectionContent section={active} role={role} user={user} lang={language} />
          </div>
        </main>
      </div>
    </div>
  );
}
