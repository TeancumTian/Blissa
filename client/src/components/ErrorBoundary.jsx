/**
 * @fileoverview 错误边界组件，用于捕获和处理React组件树中的JavaScript错误
 * @module ErrorBoundary
 */

import React, { Component } from "react";
import styles from "./ErrorBoundary.module.css";

/**
 * @typedef {Object} ErrorBoundaryState
 * @property {boolean} hasError - 是否发生错误
 * @property {Error|null} error - 错误对象
 * @property {Object|null} errorInfo - React错误信息
 */

/**
 * 错误边界组件类
 * @extends {Component<{children: React.ReactNode}, ErrorBoundaryState>}
 */
class ErrorBoundary extends Component {
  /**
   * @constructor
   * @param {Object} props - 组件属性
   * @param {React.ReactNode} props.children - 子组件
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  /**
   * 从错误中派生状态
   * @static
   * @param {Error} error - 捕获的错误
   * @returns {ErrorBoundaryState} 新的状态
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * 捕获错误和错误栈信息
   * @param {Error} error - 捕获的错误
   * @param {React.ErrorInfo} errorInfo - React错误信息
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  /**
   * 渲染组件
   * @returns {React.ReactElement} 渲染的组件
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <h1>Something went wrong</h1>
          <p>
            We apologize for the inconvenience. Please try refreshing the page.
          </p>
          <button
            className={styles.refreshButton}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === "development" && (
            <details className={styles.errorDetails}>
              <summary>Error Details</summary>
              <pre>{this.state.error && this.state.error.toString()}</pre>
              <pre>
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
