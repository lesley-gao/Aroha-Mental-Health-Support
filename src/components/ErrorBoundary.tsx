import React from "react";
import { Button } from "./ui/button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log the error to console for now — replace with remote logging if desired
    // Keep this lightweight to avoid depending on app context.
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-xl w-full bg-white rounded shadow py-20 px-12 text-center">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className=" text-gray-600 mb-8">
              An unexpected error occurred. You can try reloading the page or
              returning to the home screen.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="default"
                onClick={() => window.location.reload()}
                className="min-w-[150px]"
              >
                Reload
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="min-w-[150px]"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
