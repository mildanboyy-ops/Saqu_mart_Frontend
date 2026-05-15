import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 min-h-[400px] text-center space-y-6 bg-destructive/5 rounded-[3rem] border-2 border-dashed border-destructive/20">
          <div className="bg-destructive/20 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-destructive tracking-tight">Component Intelligence Failure</h2>
            <p className="text-muted-foreground font-medium max-w-md mx-auto">
              Satu atau lebih komponen "God-Tier" mengalami gangguan. Sistem AI sedang mencoba melakukan stabilisasi.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="rounded-2xl border-destructive/20 hover:bg-destructive/10 text-destructive font-black gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" /> REBOOT DASHBOARD
          </Button>
          <pre className="text-[10px] font-mono text-muted-foreground/40 bg-black/5 p-4 rounded-xl max-w-lg overflow-auto">
             {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
