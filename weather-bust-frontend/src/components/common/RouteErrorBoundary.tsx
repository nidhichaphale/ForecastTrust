import React from 'react'
import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom'
import { AlertOctagon, RotateCcw, Home } from 'lucide-react'
import { Button } from '../ui/Button'

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError()
  const navigate = useNavigate()

  let title = 'Application Error'
  let message = 'An unexpected error occurred while rendering this workspace.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.data?.message || 'The requested analytical view could not be loaded.'
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="min-h-screen bg-[#060d19] flex items-center justify-center p-4 text-slate-100 font-sans">
      <div className="max-w-md w-full bg-[#0b172a] border border-red-900/50 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-950/50 border border-red-700/50 mx-auto flex items-center justify-center text-red-400">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Workspace
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/')}
            className="text-xs gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
