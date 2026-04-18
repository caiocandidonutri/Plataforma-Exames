import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

export function HeroSection({ data }: { data: any }) {
  const titulo = data?.titulo || 'Para Profissionais: Análise de Exames em 5 Minutos'
  const subtitulo =
    data?.subtitulo ||
    'Transforme a forma como você interpreta exames de seus pacientes com inteligência e precisão.'
  const cta = data?.cta_primario || 'Começar Teste Gratuito'
  const ctaSec = data?.cta_secundario || 'Ver Demonstração'

  const handleCtaClick = (type: string) => {
    trackEvent(type === 'primary' ? 'cta_primario_clicado' : 'cta_secundario_clicado', {
      section: 'hero',
    })
    if (type === 'primary') {
      document.getElementById('lead-form-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 md:py-32 container mx-auto px-4 text-center space-y-8 animate-fade-in-up">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto">
        {titulo}
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">{subtitulo}</p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button size="lg" className="text-lg px-8 h-14" onClick={() => handleCtaClick('primary')}>
          {cta}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="text-lg px-8 h-14"
          onClick={() => handleCtaClick('secondary')}
        >
          {ctaSec}
        </Button>
      </div>
      <div className="pt-16 max-w-5xl mx-auto">
        <img
          src="https://img.usecurling.com/p/1200/600?q=dashboard"
          alt="Dashboard Preview"
          className="rounded-xl shadow-2xl border bg-muted/50"
        />
      </div>
    </section>
  )
}
