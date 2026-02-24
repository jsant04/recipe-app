import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("UI error boundary caught", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          <h1 className="mb-2 text-base font-semibold">Something went wrong.</h1>
          <p>Try refreshing the page. If the problem persists, please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
