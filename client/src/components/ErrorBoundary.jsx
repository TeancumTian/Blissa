import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("组件错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>出现了一些问题，请刷新页面重试。</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
