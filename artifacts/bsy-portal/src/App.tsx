import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { PageWrapper } from "@/components/layout/PageWrapper";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Track from "@/pages/track";
import Apply from "@/pages/apply";
import Dashboard from "@/pages/dashboard";
import Schemes from "@/pages/schemes";
import About from "@/pages/about";
import Certificates from "@/pages/certificates";
import EkalMahila from "@/pages/ekal-mahila";
import OrphanChildren from "@/pages/orphan-children";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 1;
      },
      staleTime: 30_000,
    },
  },
});

function PublicRouter() {
  return (
    <PageWrapper>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/track" component={Track} />
        <Route path="/apply" component={Apply} />
        <Route path="/schemes" component={Schemes} />
        <Route path="/about" component={About} />
        <Route path="/certificates" component={Certificates} />
        <Route path="/ekal-mahila" component={EkalMahila} />
        <Route path="/orphan-children" component={OrphanChildren} />
        <Route component={NotFound} />
      </Switch>
    </PageWrapper>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
            <Switch>
              <Route path="/dashboard" component={Dashboard} />
              <Route component={PublicRouter} />
            </Switch>
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
