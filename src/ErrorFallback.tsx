import { Button } from "./components/ui/button";

import { AlertTriangleIcon, RefreshCwIcon } from "lucide-react";
import { FallbackProps } from "react-error-boundary";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  if (import.meta.env.DEV) throw error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Custom alert using native HTML - replaced Radix Alert for lighter bundle */}
        <div 
          role="alert" 
          className="relative w-full rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-destructive [&>svg~*]:pl-7"
        >
          <AlertTriangleIcon className="h-4 w-4" />
          <h5 className="mb-1 font-medium leading-none tracking-tight text-destructive">
            Something went wrong
          </h5>
          <div className="text-sm text-destructive/90">
            Something unexpected happened while running the application. The error details are shown below.
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Error Details:</h3>
          <pre className="text-xs text-destructive bg-muted/50 p-3 rounded border overflow-auto max-h-32">
            {error.message}
          </pre>
        </div>
        
        <Button 
          onClick={resetErrorBoundary} 
          className="w-full"
          variant="outline"
        >
          <RefreshCwIcon />
          Try Again
        </Button>
      </div>
    </div>
  );
}
