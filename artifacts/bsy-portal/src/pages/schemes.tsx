import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { useListSchemes } from "@workspace/api-client-react";
import { Search, ExternalLink, Child, Users, Banknote } from "lucide-react";

export default function Schemes() {
  const { language } = useLanguage();
  const { data, isLoading } = useListSchemes();
  const [filter, setFilter] = useState<"all" | "children" | "women">("all");
  const [search, setSearch] = useState("");

  const filtered = (Array.isArray(data) ? data : []).filter(s => {
    const matchesFilter = filter === "all" || s.targetGroup === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || (s.marathiName || "").toLowerCase().includes(q) || (s.benefit || "").toLowerCase().includes(q) || (s.department || "").toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-secondary">
            {language === "en" ? "Related Government Schemes" : "संबंधित सरकारी योजना"}
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-2xl mx-auto">
            {language === "en"
              ? "Other Central and State Government welfare schemes available for BSY beneficiaries and their families"
              : "BSY लाभार्थी आणि त्यांच्या कुटुंबासाठी उपलब्ध इतर केंद्र आणि राज्य सरकारी कल्याण योजना"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={language === "en" ? "Search schemes..." : "योजना शोधा..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              data-testid="input-scheme-search"
            />
          </div>
          <div className="flex gap-2">
            {["all", "children", "women"].map(f => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f as any)}
                className={filter === f ? "bg-primary" : ""}
              >
                {f === "all" ? (language === "en" ? "All" : "सर्व") : f === "children" ? (language === "en" ? "Children" : "मुले") : (language === "en" ? "Women" : "महिला")}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-muted-foreground">
            {language === "en" ? "Loading schemes..." : "योजना लोड होत आहेत..."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(filtered as any[]).map(scheme => (
              <Card key={scheme.id} className="hover:border-primary transition-colors shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={scheme.targetGroup === "children" ? "bg-pink-100 text-pink-800 border-pink-200" : "bg-purple-100 text-purple-800 border-purple-200"}>
                          {scheme.targetGroup === "children" ? (language === "en" ? "Children" : "मुले") : (language === "en" ? "Women" : "महिला")}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-secondary">
                        {language === "en" ? scheme.name : (scheme.marathiName || scheme.name)}
                      </h3>
                      {language === "mr" && scheme.marathiName && (
                        <p className="text-xs text-muted-foreground">{scheme.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground font-medium min-w-24 shrink-0">{language === "en" ? "Department:" : "विभाग:"}</span>
                      <span className="text-foreground">{scheme.department}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground font-medium min-w-24 shrink-0">{language === "en" ? "Benefit:" : "फायदा:"}</span>
                      <span className="text-foreground">{scheme.benefit}</span>
                    </div>
                    {scheme.eligibility && (
                      <div className="flex items-start gap-2">
                        <span className="text-muted-foreground font-medium min-w-24 shrink-0">{language === "en" ? "Eligibility:" : "पात्रता:"}</span>
                        <span className="text-foreground">{scheme.eligibility}</span>
                      </div>
                    )}
                  </div>
                  {scheme.link && (
                    <div className="mt-4">
                      <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/5">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {language === "en" ? "Official Website" : "अधिकृत वेबसाइट"}
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-14">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-muted-foreground">
              {language === "en" ? "No schemes found" : "योजना सापडल्या नाहीत"}
            </p>
          </div>
        )}

        <div className="mt-10 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-1">{language === "en" ? "How to apply for related schemes?" : "संबंधित योजनांसाठी अर्ज कसा करावा?"}</p>
          <p>{language === "en" ? "Visit the nearest e-Suvidha Kendra, Seva Kendra, or the respective department's official website. BSY beneficiaries are entitled to priority consideration for most State and Central welfare schemes." : "जवळच्या ई-सुविधा केंद्र, सेवा केंद्र किंवा संबंधित विभागाच्या अधिकृत वेबसाइटला भेट द्या. BSY लाभार्थ्यांना बहुतेक राज्य आणि केंद्रीय कल्याण योजनांसाठी प्राधान्य विचार मिळण्याचा हक्क आहे."}</p>
        </div>
      </div>
    </div>
  );
}
