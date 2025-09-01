import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="card-primary p-8 text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              
              <h1 className="text-xl font-bold text-foreground mb-2">
                Oops! Algo deu errado
              </h1>
              
              <p className="text-muted-foreground mb-6">
                Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada.
              </p>

              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Detalhes técnicos
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded text-xs font-mono text-destructive">
                    {this.state.error.message}
                    {this.state.error.stack && (
                      <pre className="mt-2 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Recarregar Página
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-ghost w-full"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}