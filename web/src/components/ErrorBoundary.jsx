import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Between App Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--color-bg, #0D0E11)',
          color: 'var(--color-ink, #FFFFFF)',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)'
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            padding: '36px 28px',
            background: 'var(--color-surface, #1A1C23)',
            borderRadius: '24px',
            border: '1px solid rgba(217, 78, 52, 0.3)',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(217, 78, 52, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--color-ember, #E0533C)'
            }}>
              <ShieldAlert size={32} strokeWidth={2.2} />
            </div>

            <h2 style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: '24px',
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              A Moment of Pause
            </h2>

            <p style={{
              fontSize: '14px',
              color: 'var(--color-body, #A0A5B5)',
              lineHeight: 1.6,
              marginBottom: '24px'
            }}>
              Something encountered a brief hiccup while loading your cards. Let's get you right back to your connection.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--color-ember, #E0533C)',
                  color: '#FFF',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Home size={18} strokeWidth={2.2} />
                <span>Return to Lobby</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="btn-secondary"
                style={{
                  width: '100%',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  color: 'var(--color-ink, #FFF)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} strokeWidth={2.2} />
                <span>Refresh Page</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
