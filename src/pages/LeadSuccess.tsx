import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { trackEvent } from '@/lib/analytics'
import { useEffect } from 'react'

export default function LeadSuccess() {
  useEffect(() => {
    trackEvent('page_view', { page: 'lead_success' })
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg border text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Sucesso!</h1>
        <p className="text-muted-foreground text-lg">
          Verifique seu email. Enviamos um link especial para você ativar seu teste gratuito e
          acessar a plataforma.
        </p>
        <div className="pt-6 space-y-4">
          <Button asChild className="w-full h-12 text-lg">
            <Link to="/">Acessar Plataforma</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-lg"
            onClick={() => trackEvent('demo_agendada')}
          >
            Agendar Demonstração
          </Button>
        </div>
        <p className="text-sm text-muted-foreground pt-4">
          Precisa de ajuda?{' '}
          <a href="#" className="text-primary hover:underline">
            Entre em contato com o suporte
          </a>
        </p>
      </div>
    </div>
  )
}
